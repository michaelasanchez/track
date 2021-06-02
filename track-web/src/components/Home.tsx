import { cloneDeep, each, filter, isEqual } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Route, useLocation } from 'react-router-dom';
import { useCategoryService, useDatasetService } from '../App';
import { Category, Dataset, Record, Series, User } from '../models/odata';
import { UserMode } from '../shared/enums';
import ApiRequest from '../utils/Request';
import DatasetForm from './forms/DatasetForm';
import RecordForm from './forms/RecordForm';
import Graph from './Graph';
import { Loading } from './Loading';
import Toolbar, { ToolbarAction } from './Toolbar';

const FALLBACK_DATASET_ID = 1;

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
  const [isRecordLoading, setIsRecordLoading] = useState<boolean>(false);

  const { categoryList, createCategory, loadCategoryList } =
    useCategoryService();

  const {
    apiDataset,
    dataset: currentDataset,
    datasetLoading: isDatasetLoading,
    archiveDataset,
    createDataset,
    loadDataset,
    updateDataset,
    datasetList,
    datasetListLoading: isListLoading,
    reloadDatasetList: loadDatasetList,
    errors,
  } = useDatasetService();

  const [loaded, setLoaded] = useState<boolean>(false);

  const [mode, setMode] = useState<UserMode>(defaultUserMode(useLocation()));

  const [pendingDataset, setPendingDataset] = useState<Dataset>(
    new Dataset(user?.Id)
  );
  const [hasPendingChanges, setHasPendingChanges] = useState<boolean>(false);

  // Init
  useEffect(() => {
    if (!authenticated || (user && token)) {
      loadDatasetList();
    }
  }, [user]);

  useEffect(() => {
    if (!currentDataset && !isDatasetLoading) {
      loadDataset(defaultDatasetId(datasetList));
    }
  }, [datasetList]);

  useEffect(() => {
    if (!!currentDataset && !loaded) {
      // TODO: Move this to dataset list load complete
      setLoaded(true);
    }
  }, [currentDataset]);

  // Determine if pending dataset has changes
  useEffect(() => {
    const equal =
      (mode == UserMode.Create &&
        !isEqual(pendingDataset, new Dataset(user?.Id))) ||
      (mode == UserMode.Edit && !isEqual(currentDataset, pendingDataset));
    setHasPendingChanges(equal);
  }, [pendingDataset]);

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
        handleCreateDataset(pendingDataset);
        setMode(UserMode.View);
        break;

      case ToolbarAction.EditBegin:
        setPendingDataset(cloneDeep(currentDataset));
        setMode(UserMode.Edit);
        break;

      case ToolbarAction.EditSave:
        handleUpdateDataset(pendingDataset);
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
  const handleCreateDataset = (pendingDataset: Dataset) => {
    createDataset(pendingDataset).then((dataset: Dataset) => {
      loadDatasetList();
      loadDataset(dataset.Id);
    });
  };

  /* Update Dataset */
  const handleUpdateDataset = (dataset: Dataset) => {
    if (!isEqual(dataset, currentDataset)) {
      updateDataset(dataset, currentDataset).then(() => {
        loadDatasetList();
        loadDataset(dataset.Id, true);
      });
    }
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
              disabled={isListLoading || isDatasetLoading}
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
