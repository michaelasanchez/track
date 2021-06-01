import { useEffect, useState } from 'react';
import { Dataset } from '../../models/odata';
import ApiRequest from '../../utils/Request';

const loadDatasets = (token: string) => {
  return new ApiRequest('Datasets', token)
    .Expand('Category')
    .Filter('Archived eq false')
    .Get()
    .then((d: any) => d.value as Dataset[]);
};

export const DatasetService = (token: string) => {
  const [errors, setErrors] = useState([]);

  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [datasetsLoading, setDatasetsLoading] = useState<boolean>(false);

  useEffect(() => {
    reloadDatasets();
  }, []);

  const reloadDatasets = () => {
    if (!datasetsLoading) {
      setDatasetsLoading(true);

      loadDatasets(token)
        .then((d: Dataset[]) => {
          setDatasets(d);
        })
        .catch((error: any) => {
          errors.push(error);
          setErrors(errors);
        })
        .finally(() => {
          setDatasetsLoading(false);
        });
    }
  };

  return { datasetsLoading, datasets, reloadDatasets };
};
