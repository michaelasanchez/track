import React, { useState, useEffect } from 'react'
import { Row, Col } from "react-bootstrap";
import { map, filter, findIndex, each, isEqual, cloneDeep } from 'lodash';
import Toolbar, { ToolbarAction } from "./Toolbar";
import { Route } from 'react-router-dom';
import CreateRecord from "./actions/CreateRecord";
import Graph from "./Graph";

import { useOktaAuth } from '@okta/okta-react';
import ApiRequest from "../models/Request";
import { Series } from '../models/Series';
import { Dataset } from '../models/Dataset';
import { ApiDataset } from '../models/ApiDataset';
import { Navbar } from './Navbar';
import { UserMode } from '../shared/enums';
import { Loading } from './Loading';
import { BASE_PATH } from '../config';
import DatasetForm from './forms/DatasetForm';


const FALLBACK_DATASET_ID = 1;

const ALLOW_DATASET_CACHING = true;

// TODO: Figure out what to do with this
const defaultUserMode = (): UserMode => {
  switch (window.location.pathname) {
    case '/':
      return UserMode.View;
    case '/create':
      return UserMode.Create;
    case '/edit':
      return UserMode.Edit;
    default:
      return UserMode.View;
  }
}

const defaultDatasetId = (datasetList: Dataset[]): number => {
  const firstId = datasetList.length ? datasetList[0].Id : FALLBACK_DATASET_ID;

  // Attempt to recover from local storage
  const parsed = parseInt(window.localStorage.getItem('datasetId'));
  let id = isNaN(parsed) ? firstId : parsed;

  // TODO: This should happen on the back end
  // Make sure we're not loading a dataset that isn't in our dataset list
  return filter(datasetList, d => d.Id == id).length ? id : firstId;
}

type HomeProps = {};

export const Home: React.FunctionComponent<HomeProps> = ({ }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [mode, setMode] = useState<UserMode>(defaultUserMode());

  const [currentDataset, setCurrentDataset] = useState<Dataset>();
  const [pendingDataset, setPendingDataset] = useState<Dataset>(new Dataset());

  const [apiDataset, setApiDataset] = useState<ApiDataset>();

  const [datasetList, setDatasetList] = useState<Dataset[]>();
  const [datasetCache, setDatasetCache] = useState<Dataset[]>([]);
  const [apiDatasetCache, setApiDatasetCache] = useState<ApiDataset[]>([]);

  const [errors, setErrors] = useState([]);

  const { authState, authService } = useOktaAuth();

  const loadDataset = (id: number, force: boolean = !ALLOW_DATASET_CACHING) => {
    window.localStorage.setItem('datasetId', id.toString());
    const cachedIndex = findIndex(datasetCache, c => c.Id == id);

    if (cachedIndex >= 0 && !force) {
      setCurrentDataset(datasetCache[cachedIndex]);
      setApiDataset(apiDatasetCache[cachedIndex]);

    } else {
      const datasetRequest = new ApiRequest().EntityType('Datasets').Id(id).Expand('Series').Token(authState.accessToken).Get();
      const apiDatasetRequest = new ApiRequest().EntityType('ApiDatasets').Id(id).GetApiDataset();

      Promise.all([
        datasetRequest,
        apiDatasetRequest
      ])
        .then((values) => {
          const [d, api] = values;

          const datasetExists = d.ok !== false;
          const apiDatasetExists = api.ok !== false;

          if (datasetExists && ALLOW_DATASET_CACHING) {
            if (cachedIndex < 0) {
              datasetCache.push(d)
            } else {
              datasetCache[cachedIndex] = d;
            }
            setDatasetCache(datasetCache);
          }

          if (apiDatasetExists && ALLOW_DATASET_CACHING) {
            if (cachedIndex < 0) {
              apiDatasetCache.push(api);
            } else {
              apiDatasetCache[cachedIndex] = api;
            }
            setApiDatasetCache(apiDatasetCache);
          }

          setCurrentDataset(datasetExists ? d : null);
          setApiDataset(apiDatasetExists ? api : null);

          if (mode == UserMode.Edit) setPendingDataset(cloneDeep(d));
        })
        .catch((error) => {
          errors.push(error);
          setErrors(errors);
        })
        .finally(() => {
          setLoaded(true);
        });
    }
  }

  const loadDatasetList = (skipDatasetLoad: boolean = false) => {
    new ApiRequest().EntityType('Datasets').Filter('Archived eq false').Token(authState.accessToken).Get()
      .then((d: any) => {
        setDatasetList(d.value as Dataset[]);

        if (!skipDatasetLoad)
          loadDataset(defaultDatasetId(d.value));
      })
      .catch((error: any) => {
        errors.push(error);
        setErrors(errors);
      });
  }

  /* Toolbar Actions */
  const handleToolbarAction = (action: ToolbarAction, whoa?: Dataset) => {

    switch (action) {
      case ToolbarAction.CreateBegin:
        setPendingDataset(new Dataset());
        setMode(UserMode.Edit);
        break;

      case ToolbarAction.CreateSave:
        createDataset(pendingDataset);
        setMode(UserMode.View);
        break;

      case ToolbarAction.UpdateBegin:
        setPendingDataset(cloneDeep(currentDataset));
        setMode(UserMode.Create)
        break;

      case ToolbarAction.UpdateSave:
        updateDataset(pendingDataset);
        setMode(UserMode.View);
        break;

      case ToolbarAction.Cancel:
        setPendingDataset(new Dataset());
        setMode(UserMode.View);
        break;
    }
  }

  // TODO: This fires from toolbar. Dataset edits occur in form
  const createDataset = (dataset: Dataset) => {
    dataset.Series = filter(dataset.Series, (s: Series) => s.Label.length) as Series[];

    var req = new ApiRequest().EntityType('Datasets').Token(authState.accessToken).Post({
      Private: dataset.Private,
      Label: dataset.Label,
      Series: dataset.Series,
    } as Dataset);

    req.then((dataset: Dataset) => {
      loadDatasetList(true);
      loadDataset(dataset.Id);
    });
  }

  const updateDataset = (dataset: Dataset) => {
    // let req = new ApiRequest().EntityType('Datasets').Token(authState.accessToken).Id(dataset.Id).Put(dataset);
    const updated = {
      Id: dataset.Id,
      Label: dataset.Label,
      Private: dataset.Private,
    } as Dataset;

    console.log('again', dataset);

    let seriesRequests: any[] = [];
    each(dataset.Series, (s: Series, index: number) => {

      console.log('series id', s.Id, s);
      if (index < currentDataset.Series.length && !isEqual(s, currentDataset.Series[index])) {
        seriesRequests.push(new ApiRequest().EntityType('Series').Patch(s));
      }
    })

    let req = new ApiRequest().EntityType('Datasets').Token(authState.accessToken).Patch(updated);
    Promise.all([seriesRequests, req])
      .then(() => {
        loadDatasetList(true);
        loadDataset(dataset.Id, true);
      })
  }

  // Init
  useEffect(() => {
    if (!authState.isPending) {
      loadDatasetList();
    }
  }, [authState.accessToken])

  const renderGraph = () =>
    <Row>
      <Col xs={12} lg={3} className="order-2 order-lg-1">
        <CreateRecord dataset={currentDataset} refreshDataset={loadDataset} />
      </Col>
      <Col lg={9} className="order-1 order-lg-2">
        <Graph dataset={apiDataset} />
      </Col>
    </Row>;

  const renderRoutes = () =>
    <>
      <Route exact path={`${BASE_PATH}/`}>
        {renderGraph()}
      </Route>
      <Route path={`${BASE_PATH}/edit`}>
        <DatasetForm
          dataset={pendingDataset}
          updateDataset={setPendingDataset}
          allowPrivate={authState.isAuthenticated ? true : false}
        />
      </Route>
      <Route path={`${BASE_PATH}/create`}>
        <DatasetForm
          createMode={true}
          dataset={pendingDataset}
          updateDataset={setPendingDataset}
          allowPrivate={authState.isAuthenticated ? true : false}
        />
      </Route>
    </>;

  if (loaded && !errors.length) {
    return (
      <>
        <Navbar authState={authState} authService={authService} />
        <div className="container">
          <div className="row mt-3">
            <div className="col-12">
              <Toolbar
                dataset={currentDataset}
                datasetList={datasetList}
                mode={mode}
                updateMode={setMode}
                updateDataset={loadDataset}
                updateDatasetList={loadDatasetList}
                onAction={handleToolbarAction}
              />
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-12">
              {renderRoutes()}
            </div>
          </div>
        </div>
      </>
    );
  }

  return <Loading errors={errors} />;
}