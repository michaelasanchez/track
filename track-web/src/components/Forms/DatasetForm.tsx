import { faPlusCircle as addIcon, faEye as archiveIcon, faTimes as deleteIcon, faAngleUp as hiddenCloseIcon, faAngleDown as hiddenOpenIcon, faEyeSlash as unarchiveIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { countBy, filter, findIndex, isUndefined, map, maxBy, some } from 'lodash';
import React, { useState } from 'react';
import { Button, Col, Collapse, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { Color } from 'react-color';
import CreatableSelect from 'react-select/creatable';

import { Category, Dataset, Series } from '../../models/odata';
import { SeriesType } from '../../shared/enums';
import { strings } from '../../shared/strings';
import { defaultColor } from '../../utils/ChartistOptionsFactory';
import ColorPicker from '../inputs/ColorPicker';

var HtmlToReactParser = require('html-to-react').Parser;

type DatasetFormProps = {
  dataset: Dataset;
  categoryList: Category[];
  createMode?: boolean;
  allowPrivate?: boolean;
  updateDataset: (dataset: Dataset) => void;
};

const DatasetForm: React.FunctionComponent<DatasetFormProps> = ({
  dataset,
  categoryList,
  updateDataset: commitChanges,
  createMode = false,
  allowPrivate = false,
}) => {
  const [hiddenOpen, setHiddenOpen] = useState<boolean>(false);

  const categoryOptions = map(categoryList, c => {
    return { label: c.Label, value: c.Id };
  });
  const categoryIndex = dataset?.CategoryId && findIndex(categoryOptions, c => dataset.CategoryId == c.value);

  const colWidth = {
    md: 8,
    lg: 6,
  };

  const updateDataset = (updated: Partial<Dataset>) => {
    commitChanges({
      ...dataset,
      ...updated,
      Series: updated?.Series || dataset.Series,
    } as Dataset);
  };

  const updateCategory = (option: any) => {
    if (option) {

      if (option?.__isNew__) {
        updateDataset({ Category: {
          Label: option.label,
        } as Category });
      } else {
        updateDataset({ CategoryId: option.value });
      }
    } else {
      delete dataset.Category;
      updateDataset({ CategoryId: null });
    }
  };

  const updateSeries = (seriesId: number, updated: Partial<Series>) => {
    const index = dataset.Series.findIndex((s) => s.Id == seriesId);

    dataset.Series[index] = {
      ...dataset.Series[index],
      ...updated,
    };
    updateDataset(dataset);
  };

  const addSeries = () => {
    const lastId = maxBy(dataset.Series, (s) => s.Id)?.Id || 0;

    dataset.Series.push(Series.Default(lastId + 1));
    updateDataset(dataset);
  };

  const deleteSeries = (seriesId: number) => {
    const index = dataset.Series.findIndex((s) => s.Id == seriesId);

    dataset.Series.splice(index, 1);
    updateDataset(dataset);
  };

  const tooltipHtml = () => {
    if (isUndefined(dataset?.UserId)) {
      return strings.tooltip.notAuthenticated;
    } else if (dataset?.UserId == null) {
      return strings.tooltip.noOwner;
    } else {
      return strings.tooltip.notOwner;
    }
  };

  /* Series Row */
  const renderSeriesRow = (s: Series, index: number) => {
    return (
      <Form.Group key={s.Id}>
        <Row>
          <Col {...colWidth} className="flex">
            <ColorPicker
              defaultColor={
                (s.Color ? s.Color : defaultColor(s.Order)) as Color
              }
              onChange={(e: any) =>
                updateSeries(s.Id, { Color: e.hex.replace('#', '') })
              }
              disabled={!s.Visible}
            />

            <Form.Control
              type="text"
              defaultValue={s.Label}
              onBlurCapture={(e: any) =>
                updateSeries(s.Id, { Label: e.nativeEvent.srcElement.value })
              }
              disabled={!s.Visible}
            />

            {
              <Form.Control
                as="select"
                value={s.TypeId.toString()}
                onChange={(e: any) =>
                  updateSeries(s.Id, { TypeId: parseInt(e.target.value) })
                }
                disabled={!createMode && !!s.DatasetId}
              >
                {map(SeriesType, (i, j) => {
                  return isNaN(i) ? null : (
                    <option key={i} value={i}>
                      {j}
                    </option>
                  );
                })}
              </Form.Control>
            }

            {((createMode && dataset.Series.length > 1) ||
              !s.DatasetId) /*|| !s.Visible*/ && (
              <Button
                variant="link"
                onClick={(e: any) => deleteSeries(s.Id)}
                tabIndex={-1}
                className="series"
              >
                <FontAwesomeIcon
                  color="gray"
                  className="icon"
                  icon={deleteIcon}
                />
              </Button>
            )}
            {!createMode && !!s.DatasetId && (
              <Button
                variant="link"
                onClick={(e: any) =>
                  updateSeries(s.Id, { Visible: !s.Visible })
                }
                tabIndex={-1}
                className="series"
              >
                <FontAwesomeIcon
                  color="gray"
                  className={`icon ${s.Visible ? 'archive' : 'unarchive'}`}
                  icon={s.Visible ? archiveIcon : unarchiveIcon}
                />
              </Button>
            )}
          </Col>
        </Row>
      </Form.Group>
    );
  };

  /* Private Toggle */
  const privateSwitch = (
    // Include div for tooltip css
    <div>
      <Form.Check
        onChange={(e: any) =>
          updateDataset({ Private: e.currentTarget.checked })
        }
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

  /* Hidden Toggle Row */
  const hiddenToggle = (
    <a
      onClick={() => setHiddenOpen(!hiddenOpen)}
      className="hidden-link-container"
    >
      <h6>
        {`Inactive (${countBy(dataset.Series, (s) => !s.Visible).true || 0})`}
      </h6>
      <hr />
      <FontAwesomeIcon
        color="gray"
        className={`icon`}
        icon={hiddenOpen ? hiddenOpenIcon : hiddenCloseIcon}
      />
    </a>
  );

  /* Add Series */
  const addSeriesButton = (
    <Button variant="link" className="add text-secondary" onClick={addSeries}>
      <FontAwesomeIcon icon={addIcon} color="gray" className={`icon`} />
      {strings.addSeriesButtonLabel}
    </Button>
  );

  /* Render */
  return (
    <Form className={`form-dataset ${createMode ? 'create' : 'edit'}`}>
      <Form.Group>
        {/* Private */}
        <Row>
          <Col {...colWidth} className="d-flex justify-content-end">
            <span>{dataset.Private ? 'Private' : 'Public'}</span>
            {allowPrivate ? (
              privateSwitch
            ) : (
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip id="tooltip-private">
                    {new HtmlToReactParser().parse(tooltipHtml())}
                  </Tooltip>
                }
              >
                {privateSwitch}
              </OverlayTrigger>
            )}
          </Col>
        </Row>

        {/* Label */}
        <Row>
          <Col {...colWidth}>
            <h5>Label</h5>
            <Form.Control
              type="text"
              defaultValue={dataset.Label}
              onBlurCapture={(e: any) =>
                updateDataset({ Label: e.nativeEvent.srcElement.value })
              }
            />
          </Col>
        </Row>
      </Form.Group>

      {/* Category */}
      <Form.Group>
        <Row>
          <Col {...colWidth}>
            <h5>Category</h5>
            <CreatableSelect
              isClearable
              onChange={updateCategory}
              options={categoryOptions}
              defaultValue={categoryOptions[categoryIndex]}
            />
          </Col>
        </Row>
      </Form.Group>

      {/* Series */}
      <h5>Series</h5>
      {filter(dataset.Series, (s) => s.Visible).map(
        (s: Series, index: number) => {
          return renderSeriesRow(s, index);
        }
      )}

      {/* Add Series */}
      {addSeries && (
        <Form.Group>
          <Row>
            <Col {...colWidth} className="text-center">
              {addSeriesButton}
            </Col>
          </Row>
        </Form.Group>
      )}

      {/* Hidden */}
      {some(dataset.Series, (s) => !s.Visible) && (
        <>
          <Form.Group>
            <Row>
              <Col {...colWidth}>{hiddenToggle}</Col>
            </Row>
          </Form.Group>
          <Collapse in={hiddenOpen}>
            <div>
              {filter(dataset.Series, (s) => !s.Visible).map(
                (s: Series, index: number) => {
                  return renderSeriesRow(s, index);
                }
              )}
            </div>
          </Collapse>
        </>
      )}
    </Form>
  );
};

export default DatasetForm;
