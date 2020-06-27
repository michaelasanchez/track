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
  
  const updateDataset = (dataset: Dataset) => new ApiRequest().EntityType('Datasets').Patch(dataset);
  const updateSeries = (series: Series) => new ApiRequest().EntityType('Series').Patch(series);

  const handleDatasetPrivateChange = (e: any, datasetId: number) => {
    updateDataset({
      Id: datasetId,
      Private: e.currentTarget.checked,
    } as Dataset).then(() => refreshDataset(dataset.Id, true));
  }

  const handleDatasetLabelChange = (e: any, datasetId: number) => {
    const req = updateDataset({
      Id: datasetId,
      Label: e.nativeEvent.srcElement.value
    } as Dataset);
    req.then(() => {
      refreshList(true);
      refreshDataset(dataset.Id, true);
    });
  }

  const handleLabelChange = (e: any, seriesId: number) => {
    const req = updateSeries({
      Id: seriesId,
      Label: e.nativeEvent.srcElement.value
    } as Series);
    req.then(() => refreshDataset(dataset.Id, true));
  }

  const handleColorChange = (e: any, seriesId: number) => {
    const req = updateSeries({
      Id: seriesId,
      Color: e.hex.replace('#', '')
    } as Series);
    req.then(() => refreshDataset(dataset.Id, true));
  }

  const handleVisibleChange = (e: any, seriesId: number, value: boolean) => {
    const req = updateSeries({
      Id: seriesId,
      Visible: value
    } as Series);
    req.then(() => refreshDataset(dataset.Id, true));
  }

  const handleAddSeries = (e: any) => {
    
  }

  return (
    <DatasetForm
      dataset={dataset}
      allowPrivate={allowPrivate}
      onPrivateChange={handleDatasetPrivateChange}
      onDatasetLabelChange={handleDatasetLabelChange}
      onLabelChange={handleLabelChange}
      onColorChange={handleColorChange}
      onVisibleChange={handleVisibleChange}
      addSeries={handleAddSeries}
    />
  );
}

export default EditDataset;