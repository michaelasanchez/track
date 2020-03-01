import * as React from "react"
import { Navbar } from "./Navbar";
import { Dropdown, Form } from "react-bootstrap";
import { first, each, map } from 'lodash';
import { Graph } from "./Graph";
import { Dataset } from "../models/Dataset";
import * as $ from 'jquery';

const API_URL = 'https://localhost:44311/odata/';

type HomeProps = {
  datasetId?: number;
};

export const Home: React.FunctionComponent<HomeProps> = ({ datasetId = 53 }) => {
  const [init, setInit] = React.useState<boolean>(false);
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [dataset, setDataset] = React.useState<Dataset>();
  const [datasetList, setDatasetList] = React.useState<Dataset[]>();

  const loadDataset = (id: number | string | string[]) => {
    fetch(`${API_URL}Datasets(${id})?$expand=Records/Properties,Series/SeriesType`)
      .then(res => res.json())
      .then((result) => {
        const dataset = result as Dataset;
        setDataset(dataset);
        if (!loaded) setLoaded(true); // TODO: make better
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

        setDatasetList(datasets);
      },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log('ERROR:', error);
        })
  }

  if (!init) {
    setInit(true);
    loadDataset(datasetId);
    loadDatasetList();
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row mt-3 mb-3">
          <div className="col-12">
            <Form>
              <Form.Control as="select" className="custom-select" onChange={(e: any) => loadDataset($(e.target).val())} value={loaded ? dataset.Id.toString() : ''}>
                {loaded ? map(datasetList, (d, i) =>
                  <option key={i} value={d.Id.toString()}>
                    {d.Label}
                  </option>
                ) :
                  <option>Loading...</option>
                }
              </Form.Control>
            </Form>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <Graph dataset={dataset} />
          </div>
        </div>
      </div>
    </>
  );
}