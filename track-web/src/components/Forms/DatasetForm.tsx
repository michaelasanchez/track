import { Dataset } from "../../models/Dataset"
import React, { useState } from "react"
import { Form, Row, Col, Button, OverlayTrigger, Tooltip } from "react-bootstrap"
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
  allowPrivate?: boolean,
}

const DatasetForm: React.FunctionComponent<DatasetFormProps> = ({
  dataset,
  onDatasetLabelChange,
  onLabelChange,
  onColorChange,
  onPrivateChange,
  createMode = false,
  deleteSeries = null,
  allowPrivate = false,
}) => {

  const colWidth = {
    md: 8,
    lg: 6
  }

  const renderSeriesRow = (s: Series, className: string) => {
    return (
      <Form.Group key={s.Id}>
        <Row>
          <Col {...colWidth} className="flex">
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

  const placement = 'bottom';

  console.log('DATASET FORM', dataset);

  const renderPrivateSwitch = () => {
    // Include div for tooltip css
    return (
      <div>
        <Form.Check
          onChange={(e: any) => onPrivateChange(e, dataset.Id)}
          className="check-private"
          disabled={!allowPrivate}
          id="private"
          label={''}
          type="switch"
          defaultChecked={dataset.Private}
          value={dataset.Private ? 'true' : 'false'}
        />
      </div>
    );
  }

  return (
    <Form className="create">
      <Form.Group>
        <Row>
          <Col {...colWidth} className="d-flex justify-content-end">
            <span>{dataset.Private ? 'Private' : 'Public'}</span>
            {allowPrivate ? renderPrivateSwitch() :
              <OverlayTrigger
                key={placement}
                placement={placement}
                overlay={
                  <Tooltip id={`tooltip-${placement}`}>
                    <strong>Login</strong> for private datasets
                  </Tooltip>
                }
              >
                {renderPrivateSwitch()}
              </OverlayTrigger>
            }
          </Col>
        </Row>
        <Row>
          <Col {...colWidth} >
            <h5>Label</h5>
            <Form.Control type="text" defaultValue={dataset.Label} onBlurCapture={(e: any) => onDatasetLabelChange(e, dataset.Id)} />
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