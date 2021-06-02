import { filter, findIndex } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Form, FormControl, InputGroup } from 'react-bootstrap';
import { useRecordService } from '../../App';
import { positionToGeolocation, useInterval } from '../../hooks';
import { Dataset, Note, Property, Record, Series } from '../../models/odata';
import { SeriesType } from '../../shared/enums';
import { strings } from '../../shared/strings';
import { defaultColor } from '../../utils/ChartistOptionsFactory';
import DateTimePicker from '../inputs/DateTimePicker';

type RecordFormProps = {
  dataset: Dataset;
  loadDataset: (datasetId: number, force: boolean) => void;
  disabled?: boolean;
};

const RecordForm: React.FunctionComponent<RecordFormProps> = ({
  dataset,
  loadDataset,
  disabled,
}) => {
  const [record, setRecord] = useState<Record>(Record.Default(dataset.Series));
  const [autoUpdate, setAutoUpdate] = useState<boolean>(false);

  const [isRecordLoading, setIsRecordLoading] = useState<boolean>(false);

  const { createRecord } = useRecordService();

  // Keep props up to date
  useEffect(() => {
    setRecord(Record.Default(dataset.Series));
  }, [dataset.Series]);

  // DateTime
  useInterval(() => {
    if (autoUpdate) handleUpdateRecord({ DateTime: new Date() });
  }, 1000);

  const handleSaveClick = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          record.Location = positionToGeolocation(position);
          handleSaveRecord(record);
        },
        (error: any) => {
          console.error(error.message);
          handleSaveRecord(record);
        },
        { enableHighAccuracy: true }
      );
    } else {
      handleSaveRecord(record);
    }
  };

  /* Create Record */
  const handleSaveRecord = (record: Record) => {
    setIsRecordLoading(true);
    return createRecord({
      DatasetId: dataset.Id,
      DateTime: record.DateTime,
      Properties: filter(record.Properties, (p) => !!p.Value),
      Notes: record.Notes,
      Location: record.Location,
    } as Record)
      .then(() => {
        loadDataset(dataset.Id, true);
      })
      .finally(() => {
        setIsRecordLoading(false);
        setAutoUpdate(true);
        setRecord(Record.Default(dataset.Series));
      });
  };

  const handleUpdateRecord = (
    updated: Partial<Record>,
    cancelAutoUpdate: boolean = false
  ) => {
    setRecord({
      ...record,
      ...updated,
      Properties: updated?.Properties || record.Properties,
      Notes: updated?.Notes || record.Notes,
      Location: updated?.Location || record?.Location,
    } as Record);

    if (cancelAutoUpdate) setAutoUpdate(false);
  };

  const updateProperty = (seriesId: number, value: string) => {
    const index = findIndex(record.Properties, (p) => p.SeriesId == seriesId);
    if (index < 0) {
      record.Properties.push(new Property(seriesId, value));
    } else {
      record.Properties[index] = new Property(seriesId, value);
    }

    handleUpdateRecord({
      Properties: record.Properties,
    } as Record);
  };

  const renderColorLabel = (color: string, order: number) => {
    return (
      <div
        className="color"
        style={{ backgroundColor: `#${color || defaultColor(order)}` }}
      />
    );
  };

  const renderNumberInput = (s: Series, prop: Property) => {
    return (
      <>
        <Form.Label>
          {renderColorLabel(s.Color, s.Order)}
          {s.Label}
        </Form.Label>
        <Form.Control
          type="number"
          step={1}
          value={prop?.Value || ''}
          disabled={disabled}
          onChange={(e: any) => updateProperty(s.Id, e.target.value)}
        />
      </>
    );
  };

  const renderCheckInput = (s: Series, prop: Property) => {
    return (
      <>
        {renderColorLabel(s.Color, s.Order)}
        <Form.Check
          type="checkbox"
          custom
          className="d-inline-block"
          label={s.Label}
          checked={prop?.Value === 'true'}
          disabled={disabled}
          onChange={(e: any) =>
            updateProperty(s.Id, e.target.checked ? 'true' : 'false')
          }
        />
      </>
    );
  };

  return (
    <Form className="form-record">
      {/* DateTime */}
      <Form.Group>
        <Form.Label>Date</Form.Label>
        <DateTimePicker
          date={record.DateTime}
          updateDate={(d: Date) => handleUpdateRecord({ DateTime: d }, true)}
          disabled={disabled}
        />
      </Form.Group>

      {/* Props */}
      {filter(dataset.Series, (s) => s.Visible).map((s: Series, i: number) => (
        <Form.Group controlId={`series-${s.Id}`} key={s.Id}>
          {s.Visible && s.TypeId == SeriesType.Boolean
            ? renderCheckInput(s, record.Properties[i])
            : renderNumberInput(s, record.Properties[i])}
        </Form.Group>
      ))}

      {/* Note */}
      <Form.Group>
        <Form.Label>Note</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          disabled={disabled}
          value={record?.Notes.length ? record.Notes[0].Text : ''}
          onChange={(e: any) =>
            handleUpdateRecord({ Notes: [{ Text: e.target.value } as Note] })
          }
        />
      </Form.Group>

      {/* Save */}
      <Button variant="primary" onClick={handleSaveClick} disabled={disabled}>
        {strings.createRecordButtonLabel}
      </Button>
    </Form>
  );
};
export default RecordForm;
