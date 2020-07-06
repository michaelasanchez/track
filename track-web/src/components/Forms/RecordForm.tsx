import * as React from 'react';
import { findIndex, each, filter, map } from 'lodash';
import { Series } from '../../models/Series';
import { useState, useEffect } from 'react';
import { Record } from '../../models/Record';
import { Note } from '../../models/Note';
import { Property } from '../../models/Property';
import { SeriesType } from '../../shared/enums';
import { Form, Button } from 'react-bootstrap';
import { defaultColor } from '../../models/ChartistOptions';
import DateTimePicker from '../inputs/DateTimePicker';
import useInterval from '../../hooks/useInterval';

type RecordFormProps = {
  series: Series[];
  saveRecord: (record: Record) => Promise<any>;
  disabled?: boolean;
};

const RecordForm: React.FunctionComponent<RecordFormProps> = ({
  series,
  saveRecord,
  disabled
}) => {
  const [autoUpdate, setAutoUpdate] = useState<boolean>(true);
  const [record, setRecord] = useState<Record>(Record.Default(series));

  useInterval(() => {
    if (autoUpdate) handleRecordUpdate({ DateTime: new Date() }) //handleRecordUpdate({ DateTime: new Date() });
  }, 1000);

  const handleRecordUpdate = (updated: Partial<Record>, cancelAutoUpdate: boolean = false) => {
    setRecord({
      ...record,
      ...updated,
      Properties: updated?.Properties || record.Properties,
      Notes: updated?.Notes || record.Notes
    } as Record)

    if (cancelAutoUpdate) setAutoUpdate(false);
  }

  const handleRecordSave = () => {
    saveRecord(record)
      .then(() => {
        setAutoUpdate(true)
        setRecord(Record.Default(series));
      });
  }

  const updateProperty = (seriesId: number, value: string) => {
    const index = findIndex(record.Properties, p => p.SeriesId == seriesId);
    if (index < 0) {
      record.Properties.push(new Property(seriesId, value));
    } else {
      record.Properties[index] = new Property(seriesId, value);
    }

    handleRecordUpdate({
      Properties: record.Properties
    } as Record);
  }

  const renderColorLabel = (color: string, order: number) => {
    return <div className="color" style={{ backgroundColor: `#${color || defaultColor(order)}` }} />;
  }

  const renderNumberInput = (s: Series, prop: Property) => {
    return <>
      <Form.Label>
        {renderColorLabel(s.Color, s.Order)}
        {s.Label}
      </Form.Label>
      <Form.Control
        type="number"
        step={1}
        value={prop?.Value || ''}
        onChange={(e: any) => updateProperty(s.Id, e.target.value)}
      />
    </>;
  }

  const renderCheckInput = (s: Series, prop: Property) => {
    return <>
      {renderColorLabel(s.Color, s.Order)}
      <Form.Check
        type="checkbox"
        custom
        label={s.Label}
        checked={prop?.Value === 'true'}
        onChange={(e: any) => updateProperty(s.Id, e.target.checked ? 'true' : 'false')}
      />
    </>;
  }

  return (
    <Form className="form-record">

      {/* DateTime */}
      <Form.Group>
        <Form.Label>Date</Form.Label>
        <DateTimePicker date={record.DateTime} updateDate={(d: Date) => handleRecordUpdate({ DateTime: d }, true)} disabled={disabled} />
      </Form.Group>

      {/* Props */}
      {filter(series, s => s.Visible).map((s: Series, i: number) =>
        <Form.Group controlId={`series-${s.Id}`} key={s.Id}>
          {s.Visible && s.TypeId == SeriesType.Boolean ?
            renderCheckInput(s, record.Properties[i])
            :
            renderNumberInput(s, record.Properties[i])}
        </Form.Group>
      )}

      {/* Note */}
      <Form.Group>
        <Form.Label>Note</Form.Label>
        <Form.Control
          as="textarea"
          rows="3"
          disabled={disabled}
          value={record?.Notes.length ? record.Notes[0].Text : ''}
          onChange={(e: any) => handleRecordUpdate({ Notes: [{ Text: e.target.value } as Note] })}
        />
      </Form.Group>

      {/* Save */}
      <Button variant="primary" onClick={handleRecordSave} disabled={disabled}>
        Add
      </Button>
    </Form>
  );
}
export default RecordForm;