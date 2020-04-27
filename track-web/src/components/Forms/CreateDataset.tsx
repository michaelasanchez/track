import * as React from 'react';
import { Dataset } from '../../models/Dataset';
import { Series } from '../../models/Series';
import Request from '../../models/Request';
import DatasetForm from './DatasetForm';
import { useState, useEffect } from 'react';
import { times } from 'lodash';

type CreateDatasetProps = {
  refreshList: Function;
  refreshDataset: Function;
};

const CreateDataset: React.FunctionComponent<CreateDatasetProps> = ({ refreshList, refreshDataset }) => {
  const [dataset, setDataset] = useState<Dataset>(new Dataset());
  const [nextSeriesIndex, setNextSeriesIndex] = useState<number>(2);

  if (!dataset.Series.length) {
    times(2, (i: number) => {
      dataset.Series.push(
        {
          Id: i,
          Label: ''
        } as Series);
    });
  }

  const updateDataset = (dataset: Dataset) => new Request('Datasets').Patch(dataset);
  const updateSeries = (series: Series) => new Request('Series').Patch(series);

  const handleDatasetLabelChange = (e: any, datasetId: number) => {
    setDataset({
      ...dataset,
      Series: dataset.Series,
      Label: e.nativeEvent.srcElement.value
    } as Dataset);
  }

  const handleColorChange = (e: any, seriesId: number) => {
    const hex = e.hex.replace('#', '')
    const seriesIndex = dataset.Series.findIndex(s => s.Id == seriesId);

    dataset.Series[seriesIndex].Color = hex;
    addSeries(seriesIndex, hex);

    setDataset({
      ...dataset,
      Series: dataset.Series,
    } as Dataset);
  }

  const handleLabelChange = (e: any, seriesId: number) => {
    const value = e.nativeEvent.srcElement.value;
    const seriesIndex = dataset.Series.findIndex(s => s.Id == seriesId);

    dataset.Series[seriesIndex].Label = value;
    addSeries(seriesIndex, value);

    setDataset({
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
    setDataset({
      ...dataset,
      Series: dataset.Series,
    } as Dataset);
  }

  // console.log('DATASET', dataset);

  return (
    <DatasetForm
      dataset={dataset}
      onDatasetLabelChange={handleDatasetLabelChange}
      onLabelChange={handleLabelChange}
      onColorChange={handleColorChange}
      createMode={true}
      deleteSeries={removeSeries}
    />
  );
}

export default CreateDataset;