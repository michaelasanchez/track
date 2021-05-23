import { cloneDeep, each, filter, findIndex, isEqual } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Route, useLocation } from 'react-router-dom';
import { ApiDataset } from '../models/api';
import { Category, Dataset, Record, Series, User } from '../models/odata';
import { UserMode } from '../shared/enums';
import ApiRequest from '../utils/Request';
import DatasetForm from './forms/DatasetForm';
import RecordForm from './forms/RecordForm';
import Graph from './Graph';
import { Loading } from './Loading';
import Toolbar, { ToolbarAction } from './Toolbar';

const FALLBACK_DATASET_ID = 1;

const ALLOW_DATASET_CACHING = true;

// TODO: Figure out what to do with this
const defaultUserMode = (location: any): UserMode => {
  switch (location.pathname) {
    case '/create':
      return UserMode.Create;
    case '/edit':
      return UserMode.Edit;
    default:
      return UserMode.View;
  }
};

const defaultDatasetId = (datasetList: Dataset[]): number => {
  const firstId = datasetList.length ? datasetList[0].Id : FALLBACK_DATASET_ID;

  // Attempt to recover from local storage
  const parsed = parseInt(window.localStorage.getItem('datasetId'));
  let id = isNaN(parsed) ? firstId : parsed;

  // TODO: This should happen on the back end
  // Make sure we're not loading a dataset that isn't in our dataset list
  return filter(datasetList, (d) => d.Id == id).length ? id : firstId;
};

export type HomeProps = {
  authenticated: boolean;
  user?: User;
  token?: string;
};

export const Home: React.FunctionComponent<HomeProps> = ({
  authenticated,
  user,
  token,
}) => {
  const [isListLoading, setIsListLoading] = useState<boolean>(false);
  const [isDatasetLoading, setIsDatasetLoading] = useState<boolean>(false);
  const [isRecordLoading, setIsRecordLoading] = useState<boolean>(false);

  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [mode, setMode] = useState<UserMode>(defaultUserMode(useLocation()));

  const [datasetCache, setDatasetCache] = useState<Dataset[]>([]);
  const [apiDatasetCache, setApiDatasetCache] = useState<ApiDataset[]>([]);

  const [datasetList, setDatasetList] = useState<Dataset[]>();
  const [categoryList, setCategoryList] = useState<Category[]>();

  const [currentDataset, setCurrentDataset] = useState<Dataset>();
  const [pendingDataset, setPendingDataset] = useState<Dataset>(
    new Dataset(user?.Id)
  );
  const [hasPendingChanges, setHasPendingChanges] = useState<boolean>(false);

  const [apiDataset, setApiDataset] = useState<ApiDataset>();

  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (loading != isListLoading || isDatasetLoading) setLoading(!loading);
  }, [isListLoading, isDatasetLoading]);

  useEffect(() => {
    const equal =
      (mode == UserMode.Create &&
        !isEqual(pendingDataset, new Dataset(user?.Id))) ||
      (mode == UserMode.Edit && !isEqual(currentDataset, pendingDataset));
    setHasPendingChanges(equal);
  }, [pendingDataset]);

  // Init
  useEffect(() => {
    if (!authenticated || (user && token)) {
      loadDatasetList();
      loadCategoryList();
    }
  }, [user]);

  /* Load Dataset List */
  const loadDatasetList = (skipDatasetLoad: boolean = false) => {
    setIsListLoading(true);
    new ApiRequest('Datasets', token)
      .Expand('Category')
      .Filter('Archived eq false')
      .Get()
      .then((d: any) => {
        setDatasetList(d.value as Dataset[]);

        if (!skipDatasetLoad) loadDataset(defaultDatasetId(d.value));
      })
      .catch((error: any) => {
        errors.push(error);
        setErrors(errors);
      })
      .finally(() => {
        setIsListLoading(false);
      });
  };

  /* Load Categories */
  const loadCategoryList = () => {
    new ApiRequest('Categories', token).Get().then((resp: any) => {
      setCategoryList(resp.value);
    });
  };

  /* Load Dataset */
  const loadDataset = (id: number, force: boolean = !ALLOW_DATASET_CACHING) => {
    window.localStorage.setItem('datasetId', id.toString());
    const cachedIndex = findIndex(datasetCache, (c) => c.Id == id);

    if (cachedIndex >= 0 && !force) {
      setCurrentDataset(datasetCache[cachedIndex]);
      setApiDataset(apiDatasetCache[cachedIndex]);
    } else {
      setIsDatasetLoading(true);
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

          setCurrentDataset(datasetExists ? d : null);
          setApiDataset(apiDatasetExists ? api : null);

          if (mode == UserMode.Edit) setPendingDataset(cloneDeep(d));
        })
        .catch((error) => {
          errors.push(error);
          setErrors(errors);
        })
        .finally(() => {
          // TODO: move to dataset list load finally
          if (!loaded) setLoaded(true);
          setIsDatasetLoading(false);
        });
    }
  };

  /* Toolbar Actions */
  const handleToolbarAction = (action: ToolbarAction, args?: any) => {
    // TODO: Shouldn't need set mode here since toolbar uses links
    switch (action) {
      case ToolbarAction.Refresh:
        loadDataset(args);
        break;

      case ToolbarAction.CreateBegin:
        setPendingDataset(new Dataset(user?.Id));
        setMode(UserMode.Create);
        break;

      case ToolbarAction.CreateSave:
        createDataset(pendingDataset);
        setMode(UserMode.View);
        break;

      case ToolbarAction.EditBegin:
        setPendingDataset(cloneDeep(currentDataset));
        setMode(UserMode.Edit);
        break;

      case ToolbarAction.EditSave:
        beginUpdateDataset(pendingDataset);
        setMode(UserMode.View);
        break;

      case ToolbarAction.Discard:
        setPendingDataset(new Dataset(user?.Id));
        setMode(UserMode.View);
        break;

      case ToolbarAction.Delete:
        archiveDataset(currentDataset).then(() => loadDatasetList());
        setMode(UserMode.View);
        break;
    }
  };

  /* Create Dataset */
  const createDataset = (dataset: Dataset) => {
    dataset.Series = filter(
      dataset.Series,
      (s: Series) => s.Label.length
    ) as Series[];

    console.log('NOW', {
      Private: dataset.Private,
      Label: dataset.Label,
      Series: dataset.Series,
      CategoryId: dataset?.CategoryId,
      Category: dataset?.Category,
    });

    console.log('COULD BE', {
      ...dataset,
      Series: dataset.Series,
      Category: dataset?.Category,
    });

    var req = new ApiRequest('Datasets', token).Post({
      Private: dataset.Private,
      Label: dataset.Label,
      Series: dataset.Series,
      CategoryId: dataset?.CategoryId,
      Category: dataset?.Category,
    } as Dataset);

    req.then((dataset: Dataset) => {
      loadDatasetList(true);
      loadDataset(dataset.Id);
    });
  };

  /* Archive Dataset */
  const archiveDataset = (dataset: Dataset) =>
    new ApiRequest('Datasets').Delete(dataset);

  /* Update Dataset */
  const beginUpdateDataset = (dataset: Dataset) => {
    if (!isEqual(dataset, currentDataset)) {
      if (
        !dataset?.CategoryId &&
        !dataset?.Category?.Id &&
        dataset?.Category?.Label
      ) {
        new ApiRequest('Categories', token)
          .Post({
            Label: dataset.Category.Label,
          } as Category)
          .then((category) => {
            dataset.CategoryId = category.Id;
            completeUpdateDataset(dataset);
            loadCategoryList();
          });
      } else {
        completeUpdateDataset(dataset);
      }
    }
  };

  const completeUpdateDataset = (dataset: Dataset) => {
    let requests: any[] = [];

    requests.push(
      new ApiRequest('Datasets', token).Patch({
        Id: dataset.Id,
        Label: dataset.Label,
        Private: dataset.Private,
        CategoryId: dataset.CategoryId,
      } as Dataset)
    );

    setIsDatasetLoading(true);
    each(dataset.Series, (s: Series, index: number) => {
      if (index >= currentDataset.Series.length) {
        delete s.Id;
        s.DatasetId = dataset.Id;
        requests.push(new ApiRequest('Series').Post(s));
      } else if (!isEqual(s, currentDataset.Series[index])) {
        requests.push(new ApiRequest('Series').Put(s));
      }
    });

    Promise.all(requests).then(() => {
      loadDatasetList(true);
      loadDataset(dataset.Id, true);
    });
  };

  /* Create Record */
  const createRecord = (record: Record): Promise<any> => {
    setIsRecordLoading(true);
    const req = new ApiRequest('Records')
      .Post({
        DatasetId: currentDataset.Id,
        DateTime: record.DateTime,
        Properties: filter(record.Properties, (p) => !!p.Value),
        Notes: record.Notes,
        Location: record.Location,
      } as Record)
      .then(() => {
        loadDataset(currentDataset.Id, true);
      })
      .finally(() => {
        setIsRecordLoading(false);
      });

    return req;
  };

  if (loaded && !errors.length) {
    return (
      <>
        <Container className="mt-3">
          <Row>
            <Toolbar
              dataset={
                mode == UserMode.Create ? pendingDataset : currentDataset
              }
              datasetList={datasetList}
              mode={mode}
              disabled={loading}
              onAction={handleToolbarAction}
              hasChanges={hasPendingChanges}
            />
          </Row>
          <hr />
          <Row>
            <Route exact path={`/`}>
              <Col xs={12} lg={3} className="order-2 order-lg-1">
                {currentDataset && (
                  <RecordForm
                    series={currentDataset.Series}
                    saveRecord={createRecord}
                    disabled={isRecordLoading}
                  />
                )}
              </Col>
              <Col
                lg={9}
                className="order-1 order-lg-2"
                style={{ position: 'relative' }}
              >
                <Graph dataset={apiDataset} />
              </Col>
            </Route>
            <Route path={[`/edit`, `/create`]}>
              <Col>
                <DatasetForm
                  createMode={mode == UserMode.Create}
                  dataset={pendingDataset}
                  categoryList={categoryList}
                  updateDataset={setPendingDataset}
                  allowPrivate={
                    token && pendingDataset.UserId === user?.Id ? true : false
                  }
                />
              </Col>
            </Route>
          </Row>
        </Container>
      </>
    );
  }

  return <Loading errors={errors} />;
};
