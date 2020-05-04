import { Dataset } from "../../models/Dataset"
import React, { useState } from "react"
import { Form, Row, Col, Button } from "react-bootstrap"
import { Series } from "../../models/Series"
import { map } from "lodash"
import ColorPicker from "../utils/ColorPicker"
import { Color } from "react-color"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes as deleteIcon } from '@fortawesome/free-solid-svg-icons'

type DatasetFormProps = {
  dataset: Dataset,
  onDatasetLabelChange: Function,
  onLabelChange: Function,
  onColorChange: Function,
  onPrivateChange: Function,
  createMode?: boolean,
  deleteSeries?: Function,
}

const DatasetForm: React.FunctionComponent<DatasetFormProps> = ({
  dataset,
  onDatasetLabelChange,
  onLabelChange,
  onColorChange,
  onPrivateChange,
  createMode = false,
  deleteSeries = null,
}) => {

  const renderSeriesRow = (s: Series, className: string) => {
    return (
      <Form.Group key={s.Id}>
        <Row>
          <Col md={8} lg={6} className="flex">
            <Form.Control type="text" defaultValue={s.Label} onBlurCapture={(e: any) => onLabelChange(e, s.Id)} className={className} />
            {/* <Form.Control as="select" value="Choose...">
              <option>Choose...</option>
              <option>...</option>
            </Form.Control> */}
            <ColorPicker defaultColor={s.Color as Color} onChange={(e: any) => onColorChange(e, s.Id)} className={className} />
            {/* <FontAwesomeIcon icon={visibleIcon} color="gray" className="icon visible" /> */}
            {createMode && dataset.Series.length > 2 &&
              <Button variant={'link'} onClick={(e: any) => deleteSeries(e, s.Id)} tabIndex={-1}>
                <FontAwesomeIcon icon={deleteIcon} color="gray" className={`icon ${className}`} />
              </Button>}
          </Col>
        </Row>
      </Form.Group>
    )
  }

  return (
    <Form className="center">
      <Form.Group>
        <Row>
          <Col sm={12} md={8} lg={6}>
            <div className="dataset-label-container">
              <h5>Label</h5>
              <Form.Check
                type="switch"
                label={dataset.Private ? 'Private' : 'Public'}
                id="private"
                value={dataset.Private ? 'true' : 'false'}
                onChange={(e: any) => onPrivateChange(e, dataset.Id)}
              />
            </div>
            <Form.Control type="text" defaultValue={dataset.Label} onBlurCapture={(e: any) => onDatasetLabelChange(e, dataset.Id)} />
          </Col>
          <Col>
          </Col>
        </Row>
      </Form.Group>
      <h5>Series</h5>
      {map(dataset.Series, (s: Series, index: number) => {
        const className = createMode && index === dataset.Series.length - 1 ? 'pending' : null;
        return renderSeriesRow(s, className);
      })}
    </Form>
  )
}

export default DatasetForm;