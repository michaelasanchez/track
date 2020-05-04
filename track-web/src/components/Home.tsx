import React, { useState, useEffect } from 'react'
import { Navbar } from "./Navbar";
import { Row, Col } from "react-bootstrap";
import { map, filter, findIndex, each } from 'lodash';
import { Dataset } from "../models/Dataset";
import Toolbar, { ToolbarAction } from "./Toolbar";
import { Route } from 'react-router-dom';
import EditDataset from "./forms/EditDataset";
import Request from "../models/Request";
import EditRecord from "./forms/EditRecord";
import Graph from "./Graph";

import { useOktaAuth } from '@okta/okta-react';
import CreateDataset from './Forms/CreateDataset';
import { Series } from '../models/Series';

export const API_URL = 'https://localhost:44311/odata/';
const DEF_DATASET_ID = 53;

export enum UserMode {
  View,
  Edit
}

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
  const [loaded, setLoaded] = useState<boolean>(false);
  const [mode, setMode] = useState<UserMode>(defaultUserMode());

  const [dataset, setDataset] = useState<Dataset>();
  const [pendingDataset, setPendingDataset] = useState<Dataset>(new Dataset());

  const [datasetList, setDatasetList] = useState<Dataset[]>();
  const [datasetCache, setDatasetCache] = useState<Dataset[]>([]);

  const { authState, authService } = useOktaAuth();


  const loadDataset = (id: number, force: boolean = false) => {
    window.localStorage.setItem('datasetId', id.toString());
    const cachedIndex = findIndex(datasetCache, c => c.Id == id);

    if (cachedIndex >= 0 && !force) setDataset(datasetCache[cachedIndex]);
    else
      new Request('Datasets', id).Expand('Records/Properties').Expand('Series/SeriesType').Get(authState.accessToken)
        .then((d: Dataset) => {
          setDataset(d);

          if (cachedIndex < 0) {
            datasetCache.push(d);
          } else {
            datasetCache[cachedIndex] = d;
          }
          setDatasetCache(datasetCache);
          if (!loaded) setLoaded(true);
        });
  }

  const loadDatasetList = () => {
    new Request('Datasets').Filter('Archived eq false').Get(authState.accessToken)
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
    each(dataset.Series, (s: Series) => s.TypeId = 2);

    var req = new Request('Datasets').Post({
      UserId: 1,
      Label: dataset.Label,
      Series: dataset.Series,
    } as Dataset, authState.accessToken);
  }


  // Init
  useEffect(() => {
    // console.log('AUTH STATE', authState);
    if (!authState.isPending) {
      loadDatasetList();
      loadDataset(defaultDatasetId());
    }
  }, [authState.accessToken])

  const renderGraph = () =>
    <Row>
      <Col xs={12} lg={3} className="order-2 order-lg-1">
        <EditRecord dataset={dataset} refreshDataset={loadDataset} />
      </Col>
      <Col lg={9} className="order-1 order-lg-2">
        <Graph dataset={dataset} />
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
        />
      </Route>
      <Route path="/create">
        <CreateDataset
          dataset={pendingDataset}
          updateDataset={setPendingDataset}
          refreshList={loadDatasetList}
          refreshDataset={loadDataset}
        />
      </Route>
    </>;

  if (loaded) {
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

  return <div>Loading...</div>;
}