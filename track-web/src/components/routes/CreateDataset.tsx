import * as React from 'react';
import { Dataset } from '../../models/Dataset';
import { Series } from '../../models/Series';
import DatasetForm from '../forms/DatasetForm';
import { useState, useEffect } from 'react';
import { times } from 'lodash';

type CreateDatasetProps = {
  dataset: Dataset;
  updateDataset: Function;
  allowPrivate?: boolean;
};

// Decimal
const DEF_SERIES_TYPE_ID: number = 2;

const CreateDataset: React.FunctionComponent<CreateDatasetProps> = ({
  dataset,
  updateDataset,
  allowPrivate = false,
}) => {

  // TODO: Just get rid of this. Should happen on dataset init
  if (!dataset.Series.length) {
    times(2, (i: number) => {
      dataset.Series.push(
        {
          Id: i,
          Label: '',
          TypeId: DEF_SERIES_TYPE_ID,
          Visible: true,
          Order: i
        } as Series);
    });
  }

  const handleDatasetPrivateChange = (e: any) => {
    updateDataset({
      ...dataset,
      Series: dataset.Series,
      Private: e.currentTarget.checked
    } as Dataset);
  }

  const handleDatasetLabelChange = (e: any, datasetId: number) => {
    updateDataset({
      ...dataset,
      Series: dataset.Series,
      Label: e.nativeEvent.srcElement.value,
    } as Dataset);
  }

  const handleLabelChange = (e: any, seriesId: number) => {
    const value = e.nativeEvent.srcElement.value;
    const seriesIndex = dataset.Series.findIndex(s => s.Id == seriesId);

    dataset.Series[seriesIndex].Label = value;
    checkNewSeries(seriesIndex, value);

    updateDataset({
      ...dataset,
      Series: dataset.Series,
    } as Dataset);
  }

  const handleTypeChange =(e: any, seriesId: number) => {
    const value = e.target.value;
    const seriesIndex = dataset.Series.findIndex(s => s.Id == seriesId);

    dataset.Series[seriesIndex].TypeId = value;
    checkNewSeries(seriesIndex, value);

    updateDataset({
      ...dataset,
      Series: dataset.Series,
    } as Dataset)
  }

  const handleColorChange = (e: any, seriesId: number) => {
    const hex = e.hex.replace('#', '')
    const seriesIndex = dataset.Series.findIndex(s => s.Id == seriesId);

    dataset.Series[seriesIndex].Color = hex;
    checkNewSeries(seriesIndex, hex);

    updateDataset({
      ...dataset,
      Series: dataset.Series,
    } as Dataset);
  }

  // Adds new series if pending series has been updated
  const checkNewSeries = (updatedIndex: number, updatedValue: any) => {
    // TODO: updateValue is based on text input blur. this could break something else
    if (updatedIndex == dataset.Series.length - 1 && updatedValue !== '') {
      dataset.Series.push({
        Id: dataset.Series.length,
        Label: '',
        TypeId: DEF_SERIES_TYPE_ID,
        Visible: true,
        Order: dataset.Series.length
      } as Series);
    }
  }

  const removeSeries = (e: any, seriesId: number) => {
    dataset.Series.splice(dataset.Series.findIndex(s => s.Id == seriesId), 1);
    updateDataset({
      ...dataset,
      Series: dataset.Series,
    } as Dataset);
  }
  
  return (
    <DatasetForm
      dataset={dataset}
      onPrivateChange={handleDatasetPrivateChange}
      onDatasetLabelChange={handleDatasetLabelChange}
      onLabelChange={handleLabelChange}
      onTypeChange={handleTypeChange}
      onColorChange={handleColorChange}
      createMode={true}
      deleteSeries={removeSeries}
      allowPrivate={allowPrivate}
    />
  );
}

export default CreateDataset;