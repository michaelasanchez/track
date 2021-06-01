import { useState } from 'react';
import { Dataset } from '../models/odata';
import ApiRequest from '../utils/Request';

const loadDatasets = (token: string) => {
  return new ApiRequest('Datasets', token)
    .Expand('Category')
    .Filter('Archived eq false')
    .Get()
    .then((d: any) => {
      return d.value as Dataset[];
    });
};

const datasetService = (token: string) => {
  const [errors, setErrors] = useState([]);

  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [datasetsLoading, setDatasetsLoading] = useState<boolean>(false);

  const GetDatasets = () => {
    if (!datasetsLoading) {
      setDatasetsLoading(true);

      loadDatasets(token)
        .then((d: any) => {
            setDatasets(d.value as Dataset[]);
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
};
