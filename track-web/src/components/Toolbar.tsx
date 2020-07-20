import * as React from 'react';
import $ from 'jquery';
import { map } from 'lodash';
import { Link, Route } from 'react-router-dom';
import ApiRequest from './utils/Request';
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
import Select from 'react-select';
import Icon from './inputs/Icon';

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
  disabled?: boolean;
};

const Toolbar: React.FunctionComponent<ToolbarProps> = ({
  mode,
  updateMode,
  updateDataset,
  updateDatasetList,
  datasetList,
  dataset,
  onAction: doAction,
  disabled
}) => {

  const hasDatasets = datasetList?.length > 0;

  const disableAll = !hasDatasets || disabled;
  const disableSelect = mode == UserMode.Edit || mode == UserMode.Create || disableAll;
  // const disableCreate = ;
  // const disableEdit = ;
  const disableAllClass = disableAll ? ' disabled' : '';

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
        isSearchable={false}
        options={map(datasetList, ds => ({ label: ds.Label, value: ds.Id }))}
        value={{ label: dataset.Label, value: dataset.Id }}
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
        <Link to={`/`} onClick={() => handleCloseModal(true)}>
          <Button variant="primary">
            Confirm
        </Button>
        </Link>
      </Modal.Footer>
    </Modal>

  const toolbarLeft = () => {
    const editMode = mode == UserMode.Edit;
    const createMode = mode == UserMode.Create;

    return <>
      <Icon
        label="Edit"
        path={editMode ? '/' : '/edit'}
        className={editMode ? 'active' : ''}
        onClick={() => doAction(editMode ? ToolbarAction.Cancel : ToolbarAction.EditBegin)}
        icon={editIcon}
        iconActive={editActive}
        iconClass={`edit ${disableAllClass}`}
        active={editMode}
        disabled={createMode}
      />
      <Icon
        label="Create"
        path={createMode ? '/' : '/create'}
        className={createMode ? 'active' : ''}
        onClick={() => doAction(createMode ? ToolbarAction.Cancel : ToolbarAction.CreateBegin)}
        icon={createIcon}
        iconClass={`create ${disableAllClass}`}
        active={createMode}
        disabled={editMode}
      />
    </>;
  }

  /* Create */
  const createActions = () =>
    <>
      <div className="toolbar-right">
        <Icon
          path="/"
          onClick={() => doAction(ToolbarAction.Cancel)}
          icon={cancelIcon}
          iconClass="cancel"
        />
        <Icon
          path="/"
          onClick={() => doAction(ToolbarAction.CreateSave)}
          icon={saveIcon}
          iconClass="save"
        />
      </div>
    </>;

  /* Edit */
  const editActions = () =>
    <>
      <div className="toolbar-right">
        <Icon
          onClick={() => setShowModal(true)}
          icon={deleteIcon}
          iconClass="delete"
        />
        <div className="divider" />
        <Icon
          path="/"
          onClick={() => doAction(ToolbarAction.Cancel)}
          icon={cancelIcon}
          iconClass="cancel"
        />
        <Icon
          path="/"
          onClick={() => doAction(ToolbarAction.EditSave)}
          icon={saveIcon}
          iconClass="save"
        />
      </div>
    </>;

  const renderActions = () => {
    switch (mode) {
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
      <div className="toolbar-left">
        {toolbarLeft()}
      </div>
      {renderActions()}
      {showModal && renderModal()}
    </Form>
  )
}

export default Toolbar;