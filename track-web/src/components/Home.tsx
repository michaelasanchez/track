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

export const API_URL = 'https://localhost:44311/odata/';
const DEF_DATASET_ID = 53;

const ALLOW_DATASET_CACHING = false;

const defaultUserMode = (): UserMode => {
  return window.location.pathname.includes('edit') ?
    UserMode.Edit : UserMode.View;
}

const defaultDatasetId = (): number => {
  const parsed = parseInt(window.localStorage.getItem('datasetId'));
  return isNaN(parsed) ? DEF_DATASET_ID : parsed;
}

type HomeProps = {};

export const Home: React.FunctionComponent<HomeProps> = ({ }) => {
  const [mode, setMode] = useState<UserMode>(defaultUserMode());

  const [dataset, setDataset] = useState<Dataset>();
  const [apiDataset, setApiDataset] = useState<ApiDataset>();
  const [pendingDataset, setPendingDataset] = useState<Dataset>(new Dataset());

  const [datasetList, setDatasetList] = useState<Dataset[]>();
  const [datasetCache, setDatasetCache] = useState<Dataset[]>([]);
  const [apiDatasetCache, setApiDatasetCache] = useState<ApiDataset[]>([]);

  const { authState, authService } = useOktaAuth();


  const loadDataset = (id: number, force: boolean = !ALLOW_DATASET_CACHING) => {
    window.localStorage.setItem('datasetId', id.toString());
    const cachedIndex = findIndex(datasetCache, c => c.Id == id);

    if (cachedIndex >= 0 && !force) {
      setDataset(datasetCache[cachedIndex]);
      setApiDataset(apiDatasetCache[cachedIndex]);

    } else {
      const datasetRequest = new ApiRequest('Datasets', id).Expand('Series').Expand('Records/Properties').Get(authState.accessToken);
      const apiDatasetRequest = new ApiRequest('ApiDatasets').Id(id).Test();

      Promise.all([
        datasetRequest,
        apiDatasetRequest
      ]).then((values) => {
        const [d, api] = values;

        if (cachedIndex < 0) {
          datasetCache.push(d);
          apiDatasetCache.push(api);
        } else {
          datasetCache[cachedIndex] = d;
          apiDatasetCache[cachedIndex] = api;
        }

        setDataset(d);
        setDatasetCache(datasetCache);
        setApiDatasetCache(apiDatasetCache);
        setApiDataset(api);
      });
    }
  }
  
  const loadDatasetList = () => {
    new ApiRequest('Datasets').Filter('Archived eq false').Get(authState.accessToken)
      .then(d => setDatasetList(d.value as Dataset[]));
  }

  /* Toolbar Actions */
  const handleToolbarAction = (action: ToolbarAction, whoa?: Dataset) => {
    switch (action) {
      case ToolbarAction.Create:
        createDataset(pendingDataset);
        break;
    }
  }

  const createDataset = (dataset: Dataset) => {
    dataset.Series = filter(dataset.Series, (s: Series) => s.Label.length) as Series[];

    // TODO: typescript private work-wround
    var req = new ApiRequest('Datasets').Post({
      UserId: 1,  // TODO: figure out fk constraint. Can/should this be null?
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
      const id = defaultDatasetId();
      loadDatasetList();
      loadDataset(id);
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
      <Route exact path="/">
        {renderGraph()}
      </Route>
      <Route path="/edit">
        <EditDataset
          dataset={dataset}
          refreshList={loadDatasetList}
          refreshDataset={loadDataset}
          allowPrivate={authState.isAuthenticated ? true : false}
        />
      </Route>
      <Route path="/create">
        <CreateDataset
          dataset={pendingDataset}
          updateDataset={setPendingDataset}
          allowPrivate={authState.isAuthenticated ? true : false}
        />
      </Route>
    </>;

  if (dataset && apiDataset) {
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

  return <Loading />;
}