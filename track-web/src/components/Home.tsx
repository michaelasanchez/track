import { faCheck, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cloneDeep, filter, isEqual, map } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Tab, Table, Tabs } from 'react-bootstrap';
import { Route, useLocation } from 'react-router-dom';
import { useCategoryService, useDatasetService } from '../App';
import { Dataset, User } from '../models/odata';
import { UserMode } from '../shared/enums';
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
  const { categoryList } = useCategoryService();

  const [key, setKey] = useState('graph');

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

  const [activeRow, setActiveRow] = useState<string>(null);

  const handleSetActiveRow = (i: string) => {
    setActiveRow(i);
  };

  const renderTableHead = () => {
    return (
      <tr>
        <td>Date/Time</td>
        {map(apiDataset.NumericalSeries, (n, i) => (
          <td key={i}>{n.Label}</td>
        ))}
        {map(apiDataset.FrequencySeries, (f, i) => (
          <td key={i}>{f.Label}</td>
        ))}
      </tr>
    );
  };

  const renderTableBody = () => {
    return (
      <>
        {map(apiDataset.SeriesLabels, (s: string, i: string) => {
          const dateTime = moment(s);
          return (
            <tr
              key={i}
              onMouseOver={() => handleSetActiveRow(i)}
              className={i == activeRow ? 'active' : ''}
            >
              <td>
                {dateTime.format('MMM D')}{' '}
                <span className="small text-muted">
                  {dateTime.format('h:ma')}
                </span>
              </td>
              {map(apiDataset.NumericalSeries, (n, j) => (
                <td key={j}>{n.Data[parseInt(i)]}</td>
              ))}
              {map(apiDataset.FrequencySeries, (f, k) => (
                <td key={k}>
                  {f.Data[parseInt(i)] === 'true' && (
                    <FontAwesomeIcon icon={faCheck} color={f.Color} />
                  )}
                </td>
              ))}
            </tr>
          );
        })}
      </>
    );
  };

  const renderRecordActions = () => {
    const active = activeRow !== null;
    return (
      <div
        className={`record-actions${active ? ' active' : ''}`}
        style={{
          transform: `translateY(${
            active ? `${parseInt(activeRow) * 49}px` : '0'
          })`,
        }}
      >
        <Button variant="outline-secondary">
          <FontAwesomeIcon icon={faEdit} />
        </Button>
        <Button variant="outline-secondary">
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </div>
    );
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
                    dataset={currentDataset}
                    loadDataset={loadDataset}
                  />
                )}
              </Col>
              <Col lg={9} className="order-1 order-lg-2">
                <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                >
                  <Tab eventKey="graph" title="Graph" className="graph-tab">
                    <div
                      className="graph-container"
                      style={{ position: 'relative' }}
                    >
                      <Graph dataset={apiDataset} />
                    </div>
                  </Tab>
                  <Tab eventKey="data" title="Data" className="table-tab">
                    <Table
                      striped
                      hover
                      onMouseOut={() => handleSetActiveRow(null)}
                    >
                      <thead>{renderTableHead()}</thead>
                      <tbody>{renderTableBody()}</tbody>
                    </Table>
                    {renderRecordActions()}
                  </Tab>
                </Tabs>
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
