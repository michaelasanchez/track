import { Dataset } from "../../models/Dataset"
import React, { useState } from "react"
import { Form, Row, Col, Button, OverlayTrigger, Tooltip, Collapse } from "react-bootstrap"
import { Series } from "../../models/Series"
import { map, filter, some, countBy, maxBy } from "lodash"
import ColorPicker from "../inputs/ColorPicker"
import { Color } from "react-color"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes as deleteIcon,
  faEye as archiveIcon,
  faEyeSlash as unarchiveIcon,
  faPlusCircle as addIcon,
  faAngleDown as hiddenOpenIcon,
  faAngleUp as hiddenCloseIcon
} from '@fortawesome/free-solid-svg-icons'
import { strings } from "../../shared/strings"
import { SeriesType } from '../../shared/enums';
import { DEFAULT_CHARTIST_COLORS } from "../../models/ChartistOptions"

var HtmlToReactParser = require('html-to-react').Parser;

type DatasetFormProps = {
  dataset: Dataset,
  createMode?: boolean,
  allowPrivate?: boolean,
  updateDataset: (dataset: Dataset) => void,
}

const DatasetForm: React.FunctionComponent<DatasetFormProps> = ({
  dataset,
  updateDataset: commitChanges,
  createMode = false,
  allowPrivate = false,
}) => {

  const [hiddenOpen, setHiddenOpen] = useState<boolean>(false);

  const colWidth = {
    md: 8,
    lg: 6,
  }

  // console.log('dataset', dataset);

  const updateDataset = (updated: Partial<Dataset>) => {
    commitChanges({
      ...dataset,
      ...updated,
      Series: updated?.Series || dataset.Series
    } as Dataset)
  }

  const updateSeries = (seriesId: number, updated: Partial<Series>) => {
    const index = dataset.Series.findIndex(s => s.Id == seriesId);

    dataset.Series[index] = {
      ...(dataset.Series[index]),
      ...updated  
    }
    updateDataset(dataset)
  }

  const addSeries = () => {
    const lastId = maxBy(dataset.Series, s => s.Id)?.Id || 0;
    dataset.Series.push(Series.Default(lastId + 1));
    updateDataset(dataset);
  }

  const deleteSeries = (index: number) => {
    dataset.Series.splice(index, 1);
    updateDataset(dataset);
  }

  /* Series Row */
  const renderSeriesRow = (s: Series, index: number) => {
    return (
      <Form.Group key={s.Id}>
        <Row>
          <Col {...colWidth} className="flex">
            <Form.Control type="text" defaultValue={s.Label} onBlurCapture={(e: any) => updateSeries(s.Id, { Label: e.nativeEvent.srcElement.value })} />

            {<Form.Control as="select" value={s.TypeId.toString()} onChange={(e: any) => updateSeries(s.Id, { TypeId: parseInt(e.target.value) })} disabled={!createMode}>
              {map(SeriesType, (i, j) => {
                return isNaN(i) ? null : <option key={i} value={i}>{j}</option>;
              })}
            </Form.Control>}

            <ColorPicker defaultColor={(s.Color ? s.Color : DEFAULT_CHARTIST_COLORS[s.Order]) as Color} onChange={(e: any) => updateSeries(s.Id, { Color: e.hex.replace('#', '') })} />

            {createMode && dataset.Series.length > 1 &&
              <Button variant="link" onClick={(e: any) => deleteSeries(s.Id)} tabIndex={-1}>
                <FontAwesomeIcon color="gray" className="icon" icon={deleteIcon} />
              </Button>}
            {!createMode &&
              <Button variant="link" onClick={(e: any) => updateSeries(s.Id, { Visible: !s.Visible })} tabIndex={-1}>
                <FontAwesomeIcon color="gray" className={`icon ${s.Visible ? 'archive' : 'unarchive'}`} icon={s.Visible ? archiveIcon : unarchiveIcon} />
              </Button>}

          </Col>
        </Row>
      </Form.Group>
    )
  }

  /* Private Toggle */
  const renderPrivateSwitch = () => {
    // Include div for tooltip css
    return (
      <div>
        <Form.Check
          onChange={(e: any) => updateDataset({ Private: e.currentTarget.checked })}
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

  // TODO: Clean this up
  if (!dataset?.UserId) allowPrivate = false;
  const tooltipMessage = new HtmlToReactParser().parse(dataset?.UserId ? strings.tooltipNotAuthenticated : strings.tooltipNoOwner);

  /* Add Series */
  const addSeriesButton = (
    <Button variant="link" className="add text-secondary" onClick={addSeries}>
      <FontAwesomeIcon icon={addIcon} color="gray" className={`icon`} />Add Series
    </Button>
  );

  /* Hidden Toggle Row */
  const toggleHidden = (
    <a onClick={() => setHiddenOpen(!hiddenOpen)} className="hidden-link-container">
      <h6>
        {`Hidden (${countBy(dataset.Series, s => !s.Visible).true})`}
      </h6>
      <hr />
      <FontAwesomeIcon color="gray" className={`icon`} icon={hiddenOpen ? hiddenOpenIcon : hiddenCloseIcon} />
    </a>
  )

  /* Render */
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
                    {tooltipMessage}
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
            <Form.Control type="text" defaultValue={dataset.Label} onBlurCapture={(e: any) => updateDataset({ Label: e.nativeEvent.srcElement.value })} />
          </Col>
        </Row>
      </Form.Group>

      <h5>Series</h5>
      {filter(dataset.Series, s => s.Visible).map((s: Series, index: number) => {
        return renderSeriesRow(s, index);
      })}

      {addSeries &&
        <Form.Group>
          <Row>
            <Col {...colWidth} className="text-center">
              {addSeriesButton}
            </Col>
          </Row>
        </Form.Group>}

      {some(dataset.Series, s => !s.Visible) &&
        <>
          <Form.Group>
            <Row>
              <Col {...colWidth}>
                {toggleHidden}
              </Col>
            </Row>
          </Form.Group>
          <Collapse in={hiddenOpen}>
            <div>
              {filter(dataset.Series, s => !s.Visible).map((s: Series, index: number) => {
                return renderSeriesRow(s, index);
              })}
            </div>
          </Collapse>
        </>}

    </Form>
  )
}

export default DatasetForm;