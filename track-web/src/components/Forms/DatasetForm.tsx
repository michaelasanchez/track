import { Dataset } from "../../models/Dataset"
import React from "react"
import { Form, Row, Col, Button, OverlayTrigger, Tooltip } from "react-bootstrap"
import { Series } from "../../models/Series"
import { map } from "lodash"
import ColorPicker from "../inputs/ColorPicker"
import { Color } from "react-color"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes as deleteIcon } from '@fortawesome/free-solid-svg-icons'
import { strings } from "../../shared/strings"
import { SeriesType } from '../../shared/enums';
import { COLORS_DEFAULT } from "../../models/ChartistOptions"

var HtmlToReactParser = require('html-to-react').Parser;

type DatasetFormProps = {
  dataset: Dataset,
  onPrivateChange: Function,
  onDatasetLabelChange: Function,
  onLabelChange: (e: any, seriesId: number) => void,
  onTypeChange?: Function,
  onColorChange: Function,
  createMode?: boolean,
  deleteSeries?: Function,
  allowPrivate?: boolean,
}

const DatasetForm: React.FunctionComponent<DatasetFormProps> = ({
  dataset,
  onPrivateChange,
  onDatasetLabelChange,
  onLabelChange,
  onTypeChange,
  onColorChange,
  createMode = false,
  deleteSeries = null,
  allowPrivate = false,
}) => {

  const colWidth = {
    md: 8,
    lg: 6,
  }
  const tooltip = new HtmlToReactParser().parse(strings.tooltipPrivate);

  const renderSeriesRow = (s: Series, index: number, className: string) => {
    return (
      <Form.Group key={s.Id}>
        <Row>
          <Col {...colWidth} className="flex">
            <Form.Control type="text" defaultValue={s.Label} onBlurCapture={(e: any) => onLabelChange(e, s.Id)} className={className} />

            {<Form.Control as="select" value={s.TypeId.toString()} onChange={(e: any) => onTypeChange(e, s.Id)} className={className} disabled={!createMode || onTypeChange == null}>
              {map(SeriesType, (i, j) => {
                return isNaN(i) ? null : <option key={i} value={i}>{j}</option>;
              })}
            </Form.Control>}

            <ColorPicker defaultColor={(s.Color ? s.Color : COLORS_DEFAULT[index]) as Color} onChange={(e: any) => onColorChange(e, s.Id)} className={className} />

            {createMode && dataset.Series.length > 2 &&
              <Button variant={'link'} onClick={(e: any) => deleteSeries(e, s.Id)} tabIndex={-1}>
                <FontAwesomeIcon icon={deleteIcon} color="gray" className={`icon ${className}`} />
              </Button>}

            {/* <FontAwesomeIcon icon={visibleIcon} color="gray" className="icon visible" /> */}
          </Col>
        </Row>
      </Form.Group>
    )
  }

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
    <Form className={`form-dataset ${createMode ? 'create' : 'edit'}`}>
      <Form.Group>
        <Row>
          <Col {...colWidth} className="d-flex justify-content-end">
            <span>{dataset.Private ? 'Private' : 'Public'}</span>
            {allowPrivate ? renderPrivateSwitch() :
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip id="tooltip-private">
                    {tooltip}
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
        return renderSeriesRow(s, index, createMode && index === dataset.Series.length - 1 ? 'pending' : '');
      })}
    </Form>
  )
}

export default DatasetForm;