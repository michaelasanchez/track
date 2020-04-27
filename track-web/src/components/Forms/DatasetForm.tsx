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
  createMode?: boolean,
  deleteSeries?: Function,
}

const DatasetForm: React.FunctionComponent<DatasetFormProps> = ({
  dataset,
  onDatasetLabelChange,
  onLabelChange,
  onColorChange,
  createMode = false,
  deleteSeries = null,
}) => {

  const numSeries = dataset.Series.length;

  // console.log("BOINGO")

  return (
    <Form className="center">
      <h5>Dataset Label</h5>
      <Form.Group>
        <Row>
          <Col sm={12} md={8} lg={6}>
            <Form.Control type="text" defaultValue={dataset.Label} onBlurCapture={(e: any) => onDatasetLabelChange(e, dataset.Id)} />
          </Col>
        </Row>
      </Form.Group>
      <h5>Properties</h5>
      {map(dataset.Series, (s: Series, index: number) => {
        const className = createMode && index === numSeries - 1 ? 'pending' : null;
        return (
          <Form.Group key={s.Id}>
            <Row>
              <Col md={8} lg={6} className="flex">
                <Form.Control type="text" defaultValue={s.Label} onBlurCapture={(e: any) => onLabelChange(e, s.Id)} className={className} />
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
      })}
    </Form>
  )
}

export default DatasetForm;