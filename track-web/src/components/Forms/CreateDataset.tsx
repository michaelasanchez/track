import * as React from 'react';
import { Dataset } from '../../models/Dataset';
import { Series } from '../../models/Series';
import DatasetForm from './DatasetForm';
import { useState, useEffect } from 'react';
import { times } from 'lodash';

type CreateDatasetProps = {
  dataset: Dataset;
  updateDataset: Function;
  refreshList: Function;
  refreshDataset: Function;
  allowPrivate?: boolean;
};

const CreateDataset: React.FunctionComponent<CreateDatasetProps> = ({
  dataset,
  updateDataset,
  refreshList,
  refreshDataset,
  allowPrivate = false,
}) => {
  const [nextSeriesIndex, setNextSeriesIndex] = useState<number>(2);

  // TODO: 
  if (!dataset.Series.length) {
    times(2, (i: number) => {
      dataset.Series.push(
        {
          Id: i,
          Label: ''
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

  const handleColorChange = (e: any, seriesId: number) => {
    const hex = e.hex.replace('#', '')
    const seriesIndex = dataset.Series.findIndex(s => s.Id == seriesId);

    dataset.Series[seriesIndex].Color = hex;
    addSeries(seriesIndex, hex);

    updateDataset({
      ...dataset,
      Series: dataset.Series,
    } as Dataset);
  }

  const handleLabelChange = (e: any, seriesId: number) => {
    const value = e.nativeEvent.srcElement.value;
    const seriesIndex = dataset.Series.findIndex(s => s.Id == seriesId);

    dataset.Series[seriesIndex].Label = value;
    addSeries(seriesIndex, value);

    updateDataset({
      ...dataset,
      Series: dataset.Series,
    } as Dataset);
  }

  // Adds new series if pending series has been updateds
  const addSeries = (updatedIndex: number, updatedValue: any) => {
    const numSeries = dataset.Series.length;
    if (updatedIndex == numSeries - 1 && updatedValue !== '') {
      dataset.Series.push({
        Id: nextSeriesIndex,
        Label: ''
      } as Series);
    }
    setNextSeriesIndex(i => i + 1);
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
      onColorChange={handleColorChange}
      createMode={true}
      deleteSeries={removeSeries}
      allowPrivate={allowPrivate}
    />
  );
}

export default CreateDataset;