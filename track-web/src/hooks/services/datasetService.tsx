import { each, filter, findIndex, isEqual } from 'lodash';
import { useState } from 'react';
import { ApiDataset } from '../../models/api';
import { Dataset, Series } from '../../models/odata';
import ApiRequest from '../../utils/Request';

const ALLOW_DATASET_CACHING = true;

const loadDatasets = (token: string) => {
  return new ApiRequest('Datasets', token)
    .Expand('Category')
    .Filter('Archived eq false')
    .Get()
    .then((d: any) => d.value as Dataset[]);
};

export const DatasetService = (token: string) => {
  const [errors, setErrors] = useState([]);

  /* Cache */
  const [apiDatasetCache, setApiDatasetCache] = useState<ApiDataset[]>([]);
  const [datasetCache, setDatasetCache] = useState<Dataset[]>([]);

  /* Dataset List */
  const [datasetList, setDatasetList] = useState<Dataset[]>([]);
  const [datasetListLoading, setDatasetListLoading] = useState<boolean>(false);

  /* Dataset */
  const [datasetLoading, setDatasetLoading] = useState<boolean>(false);
  const [dataset, setDataset] = useState<Dataset>();
  const [apiDataset, setApiDataset] = useState<ApiDataset>();

  /* Load Dataset List */
  const reloadDatasetList = () => {
    if (!datasetListLoading) {
      setDatasetListLoading(true);

      loadDatasets(token)
        .then((d: Dataset[]) => {
          setDatasetList(d);
        })
        .catch((error: any) => {
          errors.push(error);
          setErrors(errors);
        })
        .finally(() => {
          setDatasetListLoading(false);
        });
    }
  };

  /* Load Dataset */
  const loadDataset = (id: number, force: boolean = !ALLOW_DATASET_CACHING) => {
    window.localStorage.setItem('datasetId', id.toString());
    const cachedIndex = findIndex(datasetCache, (c) => c.Id == id);

    if (cachedIndex >= 0 && !force) {
      setDataset(datasetCache[cachedIndex]);
      setApiDataset(apiDatasetCache[cachedIndex]);
    } else {
      setDatasetLoading(true);
      const datasetRequest = new ApiRequest('Datasets', token)
        .Id(id)
        .Expand('Series')
        .Expand('Category')
        .Get();
      const apiDatasetRequest = new ApiRequest('ApiDatasets')
        .Id(id)
        .GetApiDataset();

      Promise.all([datasetRequest, apiDatasetRequest])
        .then((values) => {
          const [d, api] = values;

          const datasetExists = d.ok !== false;
          const apiDatasetExists = api.ok !== false;

          if (datasetExists && ALLOW_DATASET_CACHING) {
            if (cachedIndex < 0) {
              datasetCache.push(d);
            } else {
              datasetCache[cachedIndex] = d;
            }
            setDatasetCache(datasetCache);
          }

          if (apiDatasetExists && ALLOW_DATASET_CACHING) {
            if (cachedIndex < 0) {
              apiDatasetCache.push(api);
            } else {
              apiDatasetCache[cachedIndex] = api;
            }
            setApiDatasetCache(apiDatasetCache);
          }

          setDataset(datasetExists ? d : null);
          setApiDataset(apiDatasetExists ? api : null);
        })
        .catch((error) => {
          errors.push(error);
          setErrors(errors);
        })
        .finally(() => {
          setDatasetLoading(false);
        });
    }
  };

  /* Create Dataset */
  const createDataset = (dataset: Dataset): Promise<Dataset> => {
    setDatasetLoading(true);
    dataset.Series = filter(
      dataset.Series,
      (s: Series) => s.Label.length
    ) as Series[];

    var req = new ApiRequest('Datasets', token).Post({
      Private: dataset.Private,
      Label: dataset.Label,
      Series: dataset.Series,
      CategoryId: dataset?.CategoryId,
      Category: dataset?.Category,
    } as Dataset);

    return req.then((dataset: Dataset) => {
      setDatasetLoading(false);
      return dataset;
    });
  };

  /* Update Dataset */
  const updateDataset = (updated: Dataset, current: Dataset) => {
    setDatasetLoading(true);
    let requests: any[] = [];

    requests.push(
      new ApiRequest('Datasets', token).Patch({
        Id: updated.Id,
        Label: updated.Label,
        Private: updated.Private,
        CategoryId: updated.CategoryId,
      } as Dataset)
    );

    each(updated.Series, (s: Series, index: number) => {
      if (index >= current.Series.length) {
        delete s.Id;
        s.DatasetId = updated.Id;
        requests.push(new ApiRequest('Series').Post(s));
      } else if (!isEqual(s, current.Series[index])) {
        requests.push(new ApiRequest('Series').Put(s));
      }
    });

    return Promise.all(requests).then((values: any) => {
      setDatasetLoading(false);
      return values;
    });
  };

  /* Archive Dataset */
  const archiveDataset = (dataset: Dataset) =>
    new ApiRequest('Datasets').Delete(dataset);

  return {
    datasetListLoading,
    datasetList,
    loadDatasetList: reloadDatasetList,
    apiDataset,
    dataset,
    datasetLoading,
    archiveDataset,
    createDataset,
    loadDataset,
    updateDataset,
    errors,
  };
};
