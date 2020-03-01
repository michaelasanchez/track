import * as React from "react"
import { Navbar } from "./Navbar";
import { Dropdown } from "react-bootstrap";
import { first, each, map } from 'lodash';
import { Graph } from "./Graph";
import { Dataset } from "../models/Dataset";
import { Record } from "../models/Record";

const API_URL = 'https://localhost:44311/odata/';

type HomeProps = {};

export const Home: React.FunctionComponent<HomeProps> = ({ }) => {
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [dataset, setDataset] = React.useState<Dataset>();
  const [datasetLabel, setDatasetLabel] = React.useState<string>('Loading...');
  const [datasetList, setDatasetList] = React.useState<Dataset[]>();

  if (!loaded) {
    fetch(`${API_URL}Datasets?$filter=Archived eq false`)
      .then(res => res.json())
      .then((result) => {
          var datasets = result.value as Dataset[];
          var defaultDataset = first(datasets);
          
          setLoaded(true);
          setDatasetLabel(defaultDataset.Label);
          setDatasetList(datasets);

          loadDataset(53);
          // loadDataset(defaultDataset.Id);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log('ERROR:', error);
        }
      )
  }

  const loadDataset = (id: number) => {
    fetch(`${API_URL}Datasets(${id})?$expand=Records/Properties,Series/SeriesType`)
      .then(res => res.json())
      .then((result) => {
        setDataset(result as Dataset);
      },
      (error) => {
        console.log('ERROR:', error);
      })
  }

  return (
    <>
      <Navbar />
      <div className="container mt-3">
        <div className="row">
          <div className="col-12">
            <Dropdown>
              <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
                {datasetLabel}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {map(datasetList, (d, i) => 
                  <Dropdown.Item href={`#/action-${i}`} key={i}>{d.Label}</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
            <Graph dataset={dataset} />
          </div>
        </div>
      </div>
    </>
  );
}