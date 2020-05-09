import * as React from 'react';
import { Dataset } from '../../models/Dataset';
import { Series } from '../../models/Series';
import Request from '../../models/Request';
import DatasetForm from './DatasetForm';

type EditDatasetProps = {
  dataset: Dataset;
  refreshList: Function;
  refreshDataset: Function;
  allowPrivate?: boolean;
};

const EditDataset: React.FunctionComponent<EditDatasetProps> = ({
  dataset,
  refreshList,
  refreshDataset,
  allowPrivate = false,
}) => {
  
  const updateDataset = (dataset: Dataset) => new Request('Datasets').Patch(dataset);
  const updateSeries = (series: Series) => new Request('Series').Patch(series);

  const handleDatasetPrivateChange = (e: any, datasetId: number) => {
    const updatedDataset = {
      Id: datasetId,
      Private: e.currentTarget.checked,
    } as Dataset;
    const req = updateDataset(updatedDataset);
    req.then(_ => {
      refreshList();
      refreshDataset(dataset.Id, true);
    });
  }


  const handleDatasetLabelChange = (e: any, datasetId: number) => {
    const updatedDataset = {
      Id: datasetId,
      Label: e.nativeEvent.srcElement.value
    } as Dataset;
    const req = updateDataset(updatedDataset);
    req.then(_ => {
      refreshList();
      refreshDataset(dataset.Id, true);
    });
  }

  const handleColorChange = (e: any, seriesId: number) => {
    const updatedSeries = {
      Id: seriesId,
      Color: e.hex.replace('#', '')
    } as Series;
    const req = updateSeries(updatedSeries);
    req.then(_ => refreshDataset(dataset.Id, true));
  }

  const handleLabelChange = (e: any, seriesId: number) => {
    const updatedSeries = {
      Id: seriesId,
      Label: e.nativeEvent.srcElement.value
    } as Series;
    const req = updateSeries(updatedSeries);
    req.then(_ => refreshDataset(dataset.Id, true));
  }

  return (
    <DatasetForm
      dataset={dataset}
      onPrivateChange={handleDatasetPrivateChange}
      onDatasetLabelChange={handleDatasetLabelChange}
      onLabelChange={handleLabelChange}
      onColorChange={handleColorChange}
      allowPrivate={allowPrivate}
    />
  );
}

export default EditDataset;