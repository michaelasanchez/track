import * as React from 'react';
import { map } from 'lodash';
import { Form, Row, Col } from 'react-bootstrap';
import { Color } from 'react-color';
import { Dataset } from '../../models/Dataset';
import { Series } from '../../models/Series';
import ColorPicker from '../ColorPicker';
import { API_URL } from '../Home';
import Request from '../../models/Request';

type EditDatasetProps = {
  dataset: Dataset;
};

const EditDataset: React.FunctionComponent<EditDatasetProps> = ({ dataset }) => {

  const handleDatasetLabelChange = (e: any, datasetId: number) => {
    const updatedDataset = {
      Id: datasetId,
      Label: e.nativeEvent.srcElement.value
    } as Dataset;
    // new Request('Datasets', datasetId);
    var test = updateDataset(updatedDataset);
    test.then((x: any) => {
      console.log('XXXX', x, x.body, x.json());
    })
    // console.log('TESTER', test);
  }

  const handleColorChange = (e: any, seriesId: number) => {
    const updatedSeries = {
      Id: seriesId,
      Color: e.hex.replace('#', '')
    } as Series;
    updateSeries(updatedSeries);
  }

  const handleLabelChange = (e: any, seriesId: number) => {
    const updatedSeries = {
      Id: seriesId,
      Label: e.nativeEvent.srcElement.value
    } as Series;
    updateSeries(updatedSeries);
  }

  async function updateDataset(dataset: Dataset) {
    const response = await fetch(`${API_URL}Datasets(${dataset.Id})`, {
      method: 'PATCH',
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(dataset)
    });
    return await response;
  }

  async function updateSeries(series: Series) {
    console.log('SERIES', series, typeof(series));
    const response = await fetch(`${API_URL}Series(${series.Id})`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(series)
    });
    return await response;
  }

  return (
    <Form className="center">
      <h5>Label</h5>
      <Form.Group>
        <Row>
          <Col sm={12} md={8} lg={6}>
            {/* <Form.Label>Label</Form.Label> */}
            <Form.Control type="text" defaultValue={dataset.Label} onBlurCapture={(e: any) => handleDatasetLabelChange(e, dataset.Id)} />
          </Col>
        </Row>
      </Form.Group>
      <h5>Properties</h5>
      {map(dataset.Series, (s: Series) =>
        <Form.Group key={s.Id}>
          <Row>
            <Col md={8} lg={6} className="flex">
              <Form.Control type="text" defaultValue={s.Label} onBlurCapture={(e: any) => handleLabelChange(e, s.Id)} />
              <ColorPicker defaultColor={s.Color as Color} onChange={(e: any) => handleColorChange(e, s.Id)} />
            </Col>
          </Row>
        </Form.Group>
      )}
    </Form>
  );
}

export default EditDataset;