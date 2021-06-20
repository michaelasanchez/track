import { cloneDeep, filter, isEqual } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Route, useLocation } from 'react-router-dom';
import { DatasetTabs } from '.';
import { useCategoryService, useDatasetService } from '../../App';
import { appPaths } from '../../Auth';
import { Dataset, User } from '../../models/odata';
import { UserMode } from '../../shared/enums';
import { GraphDimensions } from '../DatasetGraph';
import { CreateRecord } from '../dev';
import DatasetForm from '../forms/DatasetForm';
import RecordForm from '../forms/RecordForm';
import { Loading } from '../ui/Loading';
import Toolbar, { ToolbarAction } from '../ui/Toolbar';

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
  const firstId = datasetList.length ? datasetList[0].Id : 0;

  if (!firstId) return firstId;

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
  const { categoryList } = useCategoryService();

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
    loadDatasetList: loadDatasetList,
    errors,
  } = useDatasetService();

  const [mode, setMode] = useState<UserMode>(defaultUserMode(useLocation()));

  const [pendingDataset, setPendingDataset] = useState<Dataset>(
    new Dataset(user?.Id)
  );
  const [hasPendingChanges, setHasPendingChanges] = useState<boolean>(false);

  /* Initialize app load process */
  // Load dataset list
  useEffect(() => {
    if (user && token && !datasetList.length) {
      loadDatasetList();
    }
  }, [user]);

  // Load initial dataset
  useEffect(() => {
    if (
      !currentDataset &&
      !isDatasetLoading &&
      authenticated &&
      datasetList.length
    ) {
      const datasetId = defaultDatasetId(datasetList);
      datasetId && loadDataset(datasetId);
    }
  }, [datasetList]);

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

  if (!!currentDataset && !isDatasetLoading && !errors.length) {
    return (
      <>
        <Route exact path="/dev">
          {/* <DatasetSelector /> */}
          <CreateRecord />
        </Route>
        <Route exact path={appPaths.filter((p) => p != '/dev')}>
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
                      dataset={currentDataset}
                      loadDataset={loadDataset}
                    />
                  )}
                </Col>
                <Col lg={9} className="order-1 order-lg-2">
                  <div className="home-tab-container">
                    <DatasetTabs apiDataset={apiDataset} />
                  </div>
                </Col>
              </Route>
              <Route path={[`/edit`, `/create`]}>
                <Col>
                  <DatasetForm
                    createMode={mode == UserMode.Create}
                    dataset={pendingDataset}
                    categoryList={categoryList}
                    updateDataset={setPendingDataset}
                    allowPrivate={token && pendingDataset.UserId === user?.Id}
                  />
                </Col>
              </Route>
            </Row>
          </Container>
        </Route>
      </>
    );
  }

  return <Loading errors={errors} />;
};
