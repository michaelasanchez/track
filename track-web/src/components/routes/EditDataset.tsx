import * as React from 'react';
import { Dataset } from '../../models/Dataset';
import { Series } from '../../models/Series';
import ApiRequest from '../../models/Request';
import DatasetForm from '../forms/DatasetForm';

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
  
  const updateDataset = (dataset: Dataset) => new ApiRequest('Datasets').Patch(dataset);
  const updateSeries = (series: Series) => new ApiRequest('Series').Patch(series);

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
    const req = updateDataset({
      Id: datasetId,
      Label: e.nativeEvent.srcElement.value
    } as Dataset);
    req.then(_ => {
      refreshList();
      refreshDataset(dataset.Id, true);
    });
  }

  const handleLabelChange = (e: any, seriesId: number) => {
    const req = updateSeries({
      Id: seriesId,
      Label: e.nativeEvent.srcElement.value
    } as Series);
    req.then(_ => refreshDataset(dataset.Id, true));
  }

  const handleTypeChange = (e: any, seriesId: number) => {
    const req = updateSeries({
      Id: seriesId,
      TypeId: e.target.value,
    } as Series);
    req.then(_ => refreshDataset(dataset.Id, true));
  }

  const handleColorChange = (e: any, seriesId: number) => {
    const req = updateSeries({
      Id: seriesId,
      Color: e.hex.replace('#', '')
    } as Series);
    req.then(_ => refreshDataset(dataset.Id, true));
  }

  return (
    <DatasetForm
      dataset={dataset}
      onPrivateChange={handleDatasetPrivateChange}
      onDatasetLabelChange={handleDatasetLabelChange}
      onLabelChange={handleLabelChange}
      onTypeChange={handleTypeChange}
      onColorChange={handleColorChange}
      allowPrivate={allowPrivate}
    />
  );
}

export default EditDataset;