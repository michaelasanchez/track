import React, { useState, useEffect } from 'react'
import { Row, Col } from "react-bootstrap";
import { map, filter, findIndex, each } from 'lodash';
import Toolbar, { ToolbarAction } from "./Toolbar";
import { Route } from 'react-router-dom';
import EditDataset from "./routes/EditDataset";
import ApiRequest from "../models/Request";
import CreateRecord from "./routes/CreateRecord";
import Graph from "./Graph";

import { useOktaAuth } from '@okta/okta-react';
import CreateDataset from './routes/CreateDataset';
import { Series } from '../models/Series';
import { Dataset } from '../models/Dataset';
import { Navbar } from './Navbar';
import { UserMode } from '../shared/enums';
import { Loading } from './Loading';
import { ApiDataset } from '../models/ApiDataset';
import { BASE_PATH } from '../config';


const DEF_DATASET_ID = 1;

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
  const firstId = datasetList.length ? datasetList[0].Id : DEF_DATASET_ID;

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

  const [dataset, setDataset] = useState<Dataset>();
  const [apiDataset, setApiDataset] = useState<ApiDataset>();
  const [pendingDataset, setPendingDataset] = useState<Dataset>(new Dataset());

  const [datasetList, setDatasetList] = useState<Dataset[]>();
  const [datasetCache, setDatasetCache] = useState<Dataset[]>([]);
  const [apiDatasetCache, setApiDatasetCache] = useState<ApiDataset[]>([]);

  const [errors, setErrors] = useState([]);

  const { authState, authService } = useOktaAuth();


  const loadDataset = (id: number, force: boolean = !ALLOW_DATASET_CACHING) => {
    window.localStorage.setItem('datasetId', id.toString());
    const cachedIndex = findIndex(datasetCache, c => c.Id == id);

    if (cachedIndex >= 0 && !force) {
      setDataset(datasetCache[cachedIndex]);
      setApiDataset(apiDatasetCache[cachedIndex]);

    } else {
      const datasetRequest = new ApiRequest('Datasets', id).Expand('Series').Expand('Records/Properties').Get(authState.accessToken);
      const apiDatasetRequest = new ApiRequest('ApiDatasets').Id(id).GetApiDataset();

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

          setDataset(datasetExists ? d : null);
          setApiDataset(apiDatasetExists ? api : null);
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
    new ApiRequest('Datasets').Filter('Archived eq false').Get(authState.accessToken)
      .then(d => {
        setDatasetList(d.value as Dataset[]);

        const id = defaultDatasetId(d.value);
        
        if (!skipDatasetLoad)
          loadDataset(id);
      })
      .catch((error) => {
        errors.push(error);
        setErrors(errors);
      });
  }

  /* Toolbar Actions */
  const handleToolbarAction = (action: ToolbarAction, whoa?: Dataset) => {
    switch (action) {
      case ToolbarAction.Create:
        createDataset(pendingDataset);
        setMode(UserMode.View);
        break;
    }
  }

  const createDataset = (dataset: Dataset) => {
    dataset.Series = filter(dataset.Series, (s: Series) => s.Label.length) as Series[];

    // TODO: typescript private work-wround
    var req = new ApiRequest('Datasets').Post({
      Private: dataset.Private,
      Label: dataset.Label,
      Series: dataset.Series,
    } as Dataset, authState.accessToken);

    req.then(dataset => {
      loadDatasetList();
      loadDataset(dataset.Id);
    });
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
        <CreateRecord dataset={dataset} refreshDataset={loadDataset} />
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
        <EditDataset
          dataset={dataset}
          refreshList={loadDatasetList}
          refreshDataset={loadDataset}
          allowPrivate={authState.isAuthenticated ? true : false}
        />
      </Route>
      <Route path={`${BASE_PATH}/create`}>
        <CreateDataset
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
                dataset={dataset}
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