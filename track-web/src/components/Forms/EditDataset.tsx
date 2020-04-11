import * as React from 'react';
import { map } from 'lodash';
import { Form, Row, Col } from 'react-bootstrap';
import { Color } from 'react-color';
import { Dataset } from '../../models/Dataset';
import { Series } from '../../models/Series';
import ColorPicker from '../utils/ColorPicker';
import Request from '../../models/Request';

type EditDatasetProps = {
  dataset: Dataset;
  refreshList: Function;
  refreshDataset: Function;
};

const EditDataset: React.FunctionComponent<EditDatasetProps> = ({ dataset, refreshList, refreshDataset }) => {

  const handleDatasetLabelChange = (e: any, datasetId: number) => {
    const updatedDataset = {
      Id: datasetId,
      Label: e.nativeEvent.srcElement.value
    } as Dataset;
    const req = updateDataset(updatedDataset);
    req.then(_ => {
      refreshList();
      refreshDataset(dataset.Id, true);
    });
  }

  const handleColorChange = (e: any, seriesId: number) => {
    const updatedSeries = {
      Id: seriesId,
      Color: e.hex.replace('#', '')
    } as Series;
    const req = updateSeries(updatedSeries);
    req.then(_ => refreshDataset(dataset.Id, true));
  }

  const handleLabelChange = (e: any, seriesId: number) => {
    const updatedSeries = {
      Id: seriesId,
      Label: e.nativeEvent.srcElement.value
    } as Series;
    const req = updateSeries(updatedSeries);
    req.then(_ => refreshDataset(dataset.Id, true));
  }

  const updateDataset = (dataset: Dataset) => new Request('Datasets').Patch(dataset);

  const updateSeries = (series: Series) => new Request('Series').Patch(series);

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
              {/* <FontAwesomeIcon icon={visibleIcon} color="gray" className="icon visible" /> */}
            </Col>
          </Row>
        </Form.Group>
      )}
    </Form>
  );
}

export default EditDataset;