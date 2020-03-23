import { useState, useEffect } from "react"
import * as React from 'react';
import { Navbar } from "./Navbar";
import { Form, Row, Col } from "react-bootstrap";
import { map, filter, findIndex } from 'lodash';
import { Graph } from "./Graph";
import { Dataset } from "../models/Dataset";
import Toolbar from "./Toolbar";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import EditDataset from "./Forms/EditDataset";
import { Series } from "../models/Series";
import Request from "../models/Request";
import EditRecord from "./Forms/EditRecord";

export const API_URL = 'https://localhost:44311/odata/';
const DEF_DATASET_ID = 53;

type HomeProps = {};

export enum UserMode {
  View,
  Edit
}

const defaultUserMode = (): UserMode => {
  return window.location.pathname.replace('/', '') == 'edit' ?
    UserMode.Edit : UserMode.View;
}

const defaultDatasetId = (): number => {
  const parsed = parseInt(window.localStorage.getItem('datasetId'));
  return isNaN(parsed) ? DEF_DATASET_ID : parsed;
}

export const Home: React.FunctionComponent<HomeProps> = ({ }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [dataset, setDataset] = useState<Dataset>();
  const [datasetList, setDatasetList] = useState<Dataset[]>();
  const [mode, setMode] = useState<UserMode>(defaultUserMode());
  const [datasetCache, setDatasetCache] = useState<Dataset[]>([]);

  const loadDataset = (id: number, force: boolean = false) => {
    window.localStorage.setItem('datasetId', id.toString());
    const cachedIndex = findIndex(datasetCache, c => c.Id == id);

    if (cachedIndex >= 0 && !force) setDataset(datasetCache[cachedIndex]);
    else
      new Request('Datasets', id).Expand('Records/Properties').Expand('Series/SeriesType').Get()
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
    new Request('Datasets').Filter('Archived eq false').Get()
      .then(d => setDatasetList(d.value as Dataset[]));
  }

  // Init
  useEffect(() => {
    loadDatasetList();
    loadDataset(defaultDatasetId());
  }, []);

  const renderRoutes = () => {
    return (
      <>
        <Route exact path="/">
          <Row>
            <Col xs={12} lg={3} className="order-2 order-lg-1">
              <EditRecord dataset={dataset} refreshDataset={loadDataset} />
            </Col>
            <Col lg={9} className="order-1 order-lg-2">
              <Graph dataset={dataset} />
            </Col>
          </Row>
        </Route>
        <Route path="/edit">
          <EditDataset dataset={dataset} refreshList={loadDatasetList} refreshDataset={loadDataset} />
        </Route>
      </>
    );
  }

  if (loaded) {
    return (
      <Router>
        <Navbar />
        <div className="container">
          <div className="row mt-3">
            <div className="col-12">
              <Toolbar dataset={dataset} datasetList={datasetList} mode={mode} updateMode={setMode} updateDataset={loadDataset} />
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-12">
              {renderRoutes()}
            </div>
          </div>
        </div>
      </Router>
    );
  }

  return null;
}