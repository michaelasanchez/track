import * as React from 'react';
import { map, filter, } from 'lodash';
import { Series } from '../../models/Series';
import { Form, Button } from 'react-bootstrap';
import DateTimePicker from '../inputs/DateTimePicker';
import { useEffect, useState } from 'react';
import { Record } from '../../models/Record';
import { SeriesType } from '../../shared/enums';

type RecordFormProps = {
  record: Record;
  series: Series[];
  updateDate: Function;
  updateProperty: Function;
  updateNote: any;
  save: any;
};

const RecordForm: React.FunctionComponent<RecordFormProps> = ({
  record,
  series,
  updateDate,
  updateProperty,
  updateNote,
  save
}) => {
  // const [autoUpdate, setAutoUpdate] = useState<boolean>(true);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (autoUpdate == true) {
  //       updateDate(new Date());
  //     }
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  const handleUpdateDate = (d: Date) => {
    // setAutoUpdate(false);
    updateDate(d);
  }

  const handleSave = (e: any) => {
    // setAutoUpdate(true);
    save(e);
  }

  const renderPropertyInput = (s: Series) => {
    const prop = record.Properties.filter(p => p.SeriesId == s.Id);

    const defaultProps = {
      onChange: (e: any) => updateProperty(e, s),
    }

    let inputProps;
    if (s.TypeId != SeriesType.Boolean) {
      inputProps = {
        ...defaultProps,
        value: prop.length ? prop[0].Value : '',
      }
    }

    let input;
    switch (s.TypeId) {
      case 1:
        input = <Form.Control
          type="number"
          step={1}
          {...inputProps}
        />;
        break;
      case 2:
        input = <Form.Control
          type="number"
          {...inputProps}
        />;
        break;
      case 3:
        input = <Form.Check
          type="checkbox"
          custom
          label={s.Label}
          checked={prop.length && prop[0].Value.length > 0}
          {...defaultProps}
        />;
        break;
      default:
        input = <Form.Control
          type="text"
          {...inputProps}
        />;
        break;
    }

    if (s.TypeId == SeriesType.Boolean) {
      return input;
    }
    return <><Form.Label>{s.Label}</Form.Label>{input}</>;
  }

  return (
    <>
      <Form>
        {map(series, (s: Series) =>
          <Form.Group controlId={`series-${s.Id}`} key={s.Id}>
            {renderPropertyInput(s)}
          </Form.Group>
        )}
        <Form.Group>
          <Form.Label>Date</Form.Label>
          <DateTimePicker date={record.DateTime} updateDate={handleUpdateDate} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Note</Form.Label>
          <Form.Control as="textarea" defaultValue={record.Notes.length ? record.Notes[0].Text : ''} rows="3" onBlurCapture={updateNote} />
        </Form.Group>
        <Button variant="primary" onClick={handleSave}>
          Add
      </Button>
      </Form>
    </>
  );
}

export default RecordForm;