import * as React from 'react';
import { Dataset } from '../../models/Dataset';
import { findIndex, each, filter, map } from 'lodash';
import { Series } from '../../models/Series';
import { useState } from 'react';
import { Record } from '../../models/Record';
import { Note } from '../../models/Note';
import { Property } from '../../models/Property';
import ApiRequest from '../../models/Request';
import { SeriesType } from '../../shared/enums';
import { Form, Button } from 'react-bootstrap';
import { defaultColor } from '../../models/ChartistOptions';
import DateTimePicker from '../inputs/DateTimePicker';

type RecordFormProps = {
  dataset: Dataset;
  record: Record;
  updateRecord: (record: Record) => void;
  saveRecord: () => void;
  disabled?: boolean;
};

const RecordForm: React.FunctionComponent<RecordFormProps> = ({
  dataset,
  record,
  updateRecord: commitChanges,
  saveRecord,
  disabled
}) => {

  console.log('RECORD FORM', record);

  const updateRecord = (updated: Partial<Record>) => {
    commitChanges({
      ...record,
      ...updated,
      Properties: updated?.Properties || record.Properties,
      Notes: updated?.Notes || record.Notes
    } as Record)
  }

  const updateProperty = (seriesId: number, value: string) => {
    const index = findIndex(record.Properties, p => p.SeriesId == seriesId);
    if (index < 0) {
      record.Properties.push(new Property(seriesId, value));
    } else {
      record.Properties[index] = new Property(seriesId, value);

      updateRecord({
        Properties: record.Properties
      } as Record);
    }
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
        // step={1}
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
      <Form.Group>
        <Form.Label>Date</Form.Label>
        <DateTimePicker date={record.DateTime} updateDate={(d: Date) => updateRecord({ DateTime: d })} disabled={disabled} />
      </Form.Group>
      {filter(dataset?.Series, s => s.Visible).map((s: Series, i: number) =>
        <Form.Group controlId={`series-${s.Id}`} key={s.Id}>
          {s.Visible && s.TypeId == SeriesType.Boolean ?
            renderCheckInput(s, record.Properties[i])
            :
            renderNumberInput(s, record.Properties[i])}
        </Form.Group>
      )}

      <Form.Group>
        <Form.Label>Note</Form.Label>
        <Form.Control
          as="textarea"
          rows="3"
          disabled={disabled}
          value={record?.Notes.length ? record.Notes[0].Text : ''}
          onChange={(e: any) => updateRecord({ Notes: [{ Text: e.target.value } as Note] })}
        />
      </Form.Group>
      <Button variant="primary" onClick={saveRecord} disabled={disabled}>
        Add
      </Button>
    </Form>
  );
}
export default RecordForm;