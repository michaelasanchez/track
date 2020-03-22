import { useState, useEffect } from "react"
import * as React from 'react';
import { Navbar } from "./Navbar";
import { Form, Row, Col } from "react-bootstrap";
import { map } from 'lodash';
import { Graph } from "./Graph";
import { Dataset } from "../models/Dataset";
import Toolbar from "./Toolbar";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import EditDataset from "./Forms/EditDataset";
import { Series } from "../models/Series";
import Request from "../models/Request";

export const API_URL = 'https://localhost:44311/odata/';

type HomeProps = {
  datasetId?: number;
};

export enum UserMode {
  View,
  Edit
}

const defaultUserMode = (): UserMode => {
  const path = window.location.pathname.replace('/', '');
  return UserMode.View;
}


export const Home: React.FunctionComponent<HomeProps> = ({ datasetId = 53 }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [dataset, setDataset] = useState<Dataset>();
  const [datasetList, setDatasetList] = useState<Dataset[]>();
  const [mode, setMode] = useState<UserMode>(defaultUserMode());


  const loadDataset = (id: number) => {
    new Request('Datasets', id).Expand('Records/Properties').Expand('Series/SeriesType').Get()
      .then((d: Dataset) => {
        setDataset(d);
        if (!loaded) setLoaded(true);
      });
  }

  const loadDatasetList = () => {
    new Request('Datasets').Filter('Archived eq false').Get()
      .then(d => setDatasetList(d.value as Dataset[]));
  }

  useEffect(() => {
    loadDataset(datasetId);
    loadDatasetList();
  }, []);

  const renderRoutes = () => {
    return (
      <>
        <Route exact path="/">
          <Row>
            <Col xs={12} md={4} lg={3} className="order-2 order-lg-1">
              <ul>
                {map(dataset.Series, (s: Series) =>
                  <li key={s.Id}>{s.Label}</li>
                )}
              </ul>
            </Col>
            <Col lg={9} className="order-1 order-md-1 order-lg-2">
              <Graph dataset={dataset} />
            </Col>
          </Row>
        </Route>
        <Route path="/edit">
          <EditDataset dataset={dataset} />
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
              <Toolbar datasetId={dataset.Id} datasetList={datasetList} mode={mode} updateMode={setMode} updateDataset={loadDataset} />
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