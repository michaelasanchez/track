import * as React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { Dataset } from '../models/Dataset';
import { map } from 'lodash';
import { Series } from '../models/Series';
import ColorPicker from './ColorPicker';
import { Color } from 'react-color';

type EditProps = {
  dataset: Dataset;
};

const Edit: React.FunctionComponent<EditProps> = ({ dataset }) => {
  console.log('dataset', dataset);

  const handleColorChange = (e: any) => {
    console.log('color changed', e);
  }


  return (
    <Form className="center">
      <h5>Label</h5>
      <Form.Group>
        <Row>
          <Col sm={12} md={8} lg={6}>
            {/* <Form.Label>Label</Form.Label> */}
            <Form.Control type="text" defaultValue={dataset.Label} />
          </Col>
        </Row>
      </Form.Group>
      <h5>Properties</h5>
      {map(dataset.Series, (s: Series) =>
        <Form.Group key={s.Id}>
          <Row>
            <Col md={8} lg={6} className="flex">
              <Form.Control type="text" defaultValue={s.Label} />
              <ColorPicker defaultColor={s.Color as Color} onChange={handleColorChange} />
            </Col>
          </Row>
        </Form.Group>
      )}
    </Form>
  );
}

export default Edit;