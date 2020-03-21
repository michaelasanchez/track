import { useState, useEffect } from "react"
import * as React from 'react';
import { Navbar } from "./Navbar";
import { Form } from "react-bootstrap";
import { map } from 'lodash';
import { Graph } from "./Graph";
import { Dataset } from "../models/Dataset";
import Toolbar from "./Toolbar";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Edit from "./Edit";

const API_URL = 'https://localhost:44311/odata/';

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


  const loadDataset = (id: number | string | string[]) => {
    fetch(`${API_URL}Datasets(${id})?$expand=Records/Properties,Series/SeriesType`)
      .then(res => res.json())
      .then((result) => {
        setDataset(result as Dataset);
        if (!loaded) setLoaded(true); // TODO: make this better
      },
        (error) => {
          console.log('ERROR:', error);
        })
  }

  const loadDatasetList = () => {
    fetch(`${API_URL}Datasets?$filter=Archived eq false`)
      .then(res => res.json())
      .then((result) => {
        var datasets = result.value as Dataset[];
        // console.log(datasets)
        setDatasetList(datasets);
      },
        (error) => {
          console.log('ERROR:', error);
        })
  }

  useEffect(() => {
    loadDataset(datasetId);
    loadDatasetList();
  }, []);

  const renderRoutes = () => {
    return (
      <>
        <Route exact path="/">
          <Graph dataset={dataset} />
        </Route>
        <Route path="/edit">
          <Edit dataset={dataset} />
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