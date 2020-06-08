import * as React from 'react';
import { Dataset } from '../../models/Dataset';
import { findIndex, each, filter } from 'lodash';
import { Series } from '../../models/Series';
import { useState } from 'react';
import { Record } from '../../models/Record';
import { Note } from '../../models/Note';
import { Property } from '../../models/Property';
import ApiRequest from '../../models/Request';
import RecordForm from '../forms/RecordForm';

type CreateRecordProps = {
  dataset: Dataset;
  refreshDataset: Function;
};

const newRecordState = (dataset: Dataset): Record => {
  let record = new Record(dataset.Id, new Date());
  each(dataset.Series, (s: Series) => record.Properties.push(new Property(s.Id, '')));
  return record;
}

const CreateRecord: React.FunctionComponent<CreateRecordProps> = ({ dataset, refreshDataset }) => {
  // TODO: Look into what happens here
  //    once a dataset has been created!
  const [record, setRecord] = useState<Record>(dataset ? newRecordState(dataset) : null);

  const updateDate = (d: Date) => {
    setRecord({
      ...record,
      DateTime: d,
      Properties: record.Properties,
      Notes: record.Notes,
    } as Record);
  }

  const updateProperty = (e: any, series: Series) => {
    let value;
    if (series.TypeId == 3) {
      value = e.target.checked ? 'true' : 'false';
    } else {
      value = e.target.value;
    }
    const index = findIndex(record.Properties, p => p.SeriesId == series.Id);
    if (index < 0) {
      record.Properties.push(new Property(series.Id, value));
    } else {
      record.Properties[index] = new Property(series.Id, value);
    }
    setRecord({
      ...record,
      Properties: record.Properties,
      Notes: record.Notes,
    } as Record);
  }

  const updateNote = (e: any) => {
    setRecord({
      ...record,
      Properties: record.Properties,
      Notes: [new Note(record.Id, e.target.value)],
    } as Record);
  }

  function addRecord(e: any) {
    const req = new ApiRequest('Records').Post(
      {
        DatasetId: dataset.Id,
        DateTime: record.DateTime,
        Properties: filter(record.Properties, (p: Property) => p.Value.length),
      } as Record);

    req.then(resp => {
      setRecord(newRecordState(dataset));
      refreshDataset(dataset.Id, true);
    });
  }
  return (
    <RecordForm
      record={record}
      seriesList={dataset?.Series}
      updateDate={updateDate}
      updateProperty={updateProperty}
      updateNote={updateNote}
      save={addRecord}
    />
  );
}

export default CreateRecord;