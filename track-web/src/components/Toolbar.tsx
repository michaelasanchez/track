import * as React from 'react';
import $ from 'jquery';
import { map } from 'lodash';
import { Link, Route } from 'react-router-dom';
import ApiRequest from '../models/Request';
import { Form, Button, Modal } from 'react-bootstrap';
import { Dataset } from '../models/Dataset';
import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit as editIcon } from '@fortawesome/free-regular-svg-icons'
import {
  faCheck as saveIcon,
  faEdit as editActive,
  faTimes as cancelIcon,
  faTrash as deleteIcon,
  faPlus,
  faPlusSquare,
  faPlusCircle as createIcon
} from '@fortawesome/free-solid-svg-icons'
import { UserMode } from '../shared/enums';
import { BASE_PATH } from '../config';
import Select from 'react-select';

export enum ToolbarAction {
  CreateBegin,
  CreateSave,
  EditBegin,
  EditSave,
  Cancel
}

type ToolbarProps = {
  dataset: Dataset;
  datasetList: Dataset[];
  mode: UserMode;
  updateMode: Function;
  updateDataset: Function;
  updateDatasetList: Function;
  onAction: Function;
};

const Toolbar: React.FunctionComponent<ToolbarProps> = ({
  mode,
  updateMode,
  updateDataset,
  updateDatasetList,
  datasetList,
  dataset,
  onAction: doAction
}) => {

  const hasDatasets = datasetList?.length > 0;

  const disabled = !hasDatasets;
  const disableSelect = mode == UserMode.Edit || mode == UserMode.Create || disabled;

  const [showModal, setShowModal] = useState(false);

  const archiveDataset = (dataset: Dataset) => new ApiRequest('Datasets').Delete(dataset);
  const handleCloseModal = (confirm: boolean = false) => {
    setShowModal(false);
    updateMode(UserMode.View);
    if (confirm) {
      const req = archiveDataset(dataset);
      req.then(() => updateDatasetList());
    }
  };

  /* Select */
  const renderDatasetSelect = () => {
    return (
      <Select
        className="select"
        isDisabled={disableSelect}
        options={map(datasetList, ds => ({ label: ds.Label, value: ds.Id }))}
        defaultValue={{ label: dataset.Label, value: dataset.Id }}
        onChange={(option: any) => updateDataset(option.value)}
      />
    );
  }

  /* Modal */
  const renderModal = () =>
    <Modal show={showModal} onHide={handleCloseModal} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>You Sure?</Modal.Title>
      </Modal.Header>
      <Modal.Body>Dataset "{dataset.Label}" is about to be <strong>archived</strong></Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => handleCloseModal()}>
          Nevermind
      </Button>
        <Link to={`${BASE_PATH}/`} onClick={() => handleCloseModal(true)}>
          <Button variant="primary">
            Confirm
        </Button>
        </Link>
      </Modal.Footer>
    </Modal>

  /* Home Actions */
  const defaultActions = () =>
    <div className="toolbar-left">
      <Link to={`${BASE_PATH}/edit`} onClick={() => doAction(ToolbarAction.EditBegin)}>
        <FontAwesomeIcon icon={editIcon} color="gray" className={`icon edit${disabled ? ' disabled' : ''}`} />
      </Link>
      <Link to={`${BASE_PATH}/create`} onClick={() => doAction(ToolbarAction.CreateBegin)}>
        <FontAwesomeIcon icon={createIcon} color="gray" className={`icon create${disabled ? ' disabled' : ''}`} />
      </Link>
    </div>;

  /* Create */
  const createActions = () =>
    <>
      <div className="toolbar-left">
        <Link to={`${BASE_PATH}/create`} className="disabled">
          <FontAwesomeIcon icon={editIcon} color="gray" className="icon edit" />
        </Link>
        <Link to={`${BASE_PATH}/`} className="active" onClick={() => doAction(ToolbarAction.Cancel)}>
          <FontAwesomeIcon icon={createIcon} color="gray" className="icon create" />
        </Link>
          <span>Create</span>
      </div>
      <div className="toolbar-right">
        <Link to={`${BASE_PATH}/`} onClick={() => doAction(ToolbarAction.Cancel)}>
          <FontAwesomeIcon icon={cancelIcon} color="gray" className="icon cancel" />
        </Link>
        <Link to={`${BASE_PATH}/`} onClick={() => doAction(ToolbarAction.CreateSave)}>
          <FontAwesomeIcon icon={saveIcon} color="gray" className="icon save" />
        </Link>
      </div>
    </>;

  /* Edit */
  const editActions = () =>
    <>
      <div className="toolbar-left">
        <Link to={`${BASE_PATH}/`} className="active" onClick={() => doAction(ToolbarAction.Cancel)}>
          <FontAwesomeIcon icon={editActive} color="gray" className="icon edit" />
        </Link>
          <span>Edit</span>
        <Link to={`${BASE_PATH}/edit`} className="disabled">
          <FontAwesomeIcon icon={createIcon} color="gray" className="icon create" />
        </Link>
      </div>
      <div className="toolbar-right">
        <Link to={`${BASE_PATH}/edit`} onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={deleteIcon} color="gray" className="icon delete" />
        </Link>
        <div className="divider" />
        <Link to={`${BASE_PATH}/`} onClick={() => doAction(ToolbarAction.Cancel)}>
          <FontAwesomeIcon icon={cancelIcon} color="gray" className="icon cancel" />
        </Link>
        <Link to={`${BASE_PATH}/`} onClick={() => doAction(ToolbarAction.EditSave)}>
          <FontAwesomeIcon icon={saveIcon} color="gray" className="icon save" />
        </Link>
      </div>
    </>;

  const renderActions = () => {
    switch (mode) {
      case UserMode.View:
        return defaultActions();
      case UserMode.Create:
        return createActions();
      case UserMode.Edit:
        return editActions();
    }
  }

  /* Render */
  return (
    <Form className="toolbar">
      {renderDatasetSelect()}
      {renderActions()}
      {showModal && renderModal()}
    </Form>
  )
}

export default Toolbar;