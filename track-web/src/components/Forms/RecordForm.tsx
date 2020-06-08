import * as React from 'react';
import { map, filter, } from 'lodash';
import { Series } from '../../models/Series';
import { Form, Button } from 'react-bootstrap';
import DateTimePicker from '../inputs/DateTimePicker';
import { useEffect, useState } from 'react';
import { Record } from '../../models/Record';
import { SeriesType } from '../../shared/enums';
import { COLORS_DEFAULT } from '../../models/ChartistOptions';

type RecordFormProps = {
  record: Record;
  seriesList: Series[];
  updateDate: Function;
  updateProperty: Function;
  updateNote: any;
  save: any;
};

const RecordForm: React.FunctionComponent<RecordFormProps> = ({
  record,
  seriesList,
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

  // TODO: Be more specific
  const disabled = !record;

  const handleUpdateDate = (d: Date) => {
    // setAutoUpdate(false);
    updateDate(d);
  }

  const handleSave = (e: any) => {
    // setAutoUpdate(true);
    save(e);
  }

  const renderPropertyInput = (s: Series, index: number) => {
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
          checked={prop.length && prop[0].Value === 'true'}
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

    const colorLabel = <div className="color" style={{ backgroundColor: `#${s.Color?s.Color:COLORS_DEFAULT[index]}` }} />;

    if (s.TypeId == SeriesType.Boolean) {
      return <>
        {colorLabel}
        {input}
      </>;
    }

    return <>
      <Form.Label>
        {colorLabel}
        {s.Label}
      </Form.Label>
      {input}
    </>;
  }

  return (
    <>
      <Form>
        {map(seriesList, (s: Series, i: number) =>
          <Form.Group controlId={`series-${s.Id}`} key={s.Id}>
            {renderPropertyInput(s, i)}
          </Form.Group>
        )}
        <Form.Group>
          <Form.Label>Date</Form.Label>
          <DateTimePicker date={record?.DateTime ?? new Date()} updateDate={handleUpdateDate} disabled={disabled} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Note</Form.Label>
          <Form.Control as="textarea" defaultValue={record?.Notes.length ? record.Notes[0].Text : ''} rows="3" onBlurCapture={updateNote} disabled={disabled} />
        </Form.Group>
        <Button variant="primary" onClick={handleSave} disabled={disabled}>
          Add
      </Button>
      </Form>
    </>
  );
}

export default RecordForm;