import * as React from 'react';
import { Dataset } from '../../models/Dataset';
import { map, findIndex } from 'lodash';
import { Series } from '../../models/Series';
import { Form, Button } from 'react-bootstrap';
import DateTimePicker from '../DateTimePicker';
import { useState } from 'react';
import { Record } from '../../models/Record';
import { Note } from '../../models/Note';
import { Property } from '../../models/Property';
import Request from '../../models/Request';

type EditRecordProps = {
  dataset: Dataset;
};

const EditRecord: React.FunctionComponent<EditRecordProps> = ({ dataset }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [record, setRecord] = useState<Record>(new Record(dataset.Id));


  const updateDate = (d: Date) => {
    record.DateTime = d;
    setRecord(record);
    setDate(d);
  }

  const updateProperty = (e: any, series: Series) => {
    var index = findIndex(record.Properties, p => p.SeriesId == series.Id);
    if (index < 0) {
      record.Properties.push(new Property(series.Id, e.target.value));
    } else {
      record.Properties[index] = new Property(series.Id, e.target.value);
    }
  }

  const updateNote = (e: any) => {
    record.Notes = [new Note(e.target.value)];
    setRecord(record);
  }

  function addRecord(e: any) {
    var req = new Request('Records').Post(
      {
        DatasetId: dataset.Id,
        DateTime: date
      } as Record);

    req.then((r: any) => {
      console.log(r);
    });
  }
  

  return (
    <Form>
      {map(dataset.Series, (s: Series) =>
        <Form.Group controlId={`series-${s.Id}`} key={s.Id}>
          <Form.Label>{s.Label}</Form.Label>
          <Form.Control type="text" onBlurCapture={(e: any) => updateProperty(e, s)} />
        </Form.Group>
      )}
      <Form.Group>
        <Form.Label>Date</Form.Label>
        <DateTimePicker date={date} updateDate={updateDate} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Note</Form.Label>
        <Form.Control as="textarea" rows="3" onBlurCapture={updateNote} />
      </Form.Group>
      <Button variant="primary" onClick={addRecord}>
        Add
      </Button>
    </Form>
  );
}

export default EditRecord;