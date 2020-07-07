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

  const [show, setShow] = useState(false);

  const archiveDataset = (dataset: Dataset) => new ApiRequest('Datasets').Delete(dataset);

  const handleShow = () => setShow(true);

  const disabled = !hasDatasets;
  const disableSelect = mode == UserMode.Edit || mode == UserMode.Create || disabled;
  const disableEdit = disabled;
  const disableCreate = false;

  const handleClose = (confirm: boolean = false) => {
    setShow(false);
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
        options={map(datasetList, d => ({ label: d.Label, value: d.Id }))}
        value={{ label: dataset.Label, value: dataset.Id }}
        onChange={(option: any) => updateDataset(option.value)}
      />
    );
  }

  const renderDivider = () => {
    return <div className="divider" />;
  }

  /* Modal */
  const renderModal = () =>
    <Modal show={show} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>You Sure?</Modal.Title>
      </Modal.Header>
      <Modal.Body>Dataset "{dataset.Label}" is about to be <strong>archived</strong></Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => handleClose()}>
          Nevermind
      </Button>
        <Link to={`${BASE_PATH}/`} onClick={() => handleClose(true)}>
          <Button variant="primary">
            Confirm
        </Button>
        </Link>
      </Modal.Footer>
    </Modal>

  /* Home */
  const renderDefault = () =>
    <div className="toolbar-left">
      <Link to={`${BASE_PATH}/edit`} onClick={() => doAction(ToolbarAction.EditBegin)}>
        <FontAwesomeIcon icon={editIcon} color="gray" className={`icon edit${disabled ? ' disabled' : ''}`} />
      </Link>
      <Link to={`${BASE_PATH}/create`} onClick={() => doAction(ToolbarAction.CreateBegin)}>
        <FontAwesomeIcon icon={createIcon} color="gray" className={`icon create${disabled ? ' disabled' : ''}`} />
      </Link>
    </div>;

  /* Create */
  const renderCreate = () =>
    <>
      <div className="toolbar-left">
        <Link to={`${BASE_PATH}/create`} className="disabled">
          <FontAwesomeIcon icon={editIcon} color="gray" className="icon edit" />
        </Link>
        <Link to={`${BASE_PATH}/`} className="active" onClick={() => doAction(ToolbarAction.Cancel)}>
          <FontAwesomeIcon icon={createIcon} color="gray" className="icon create" />
        </Link>
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
  const renderEdit = () =>
    <>
      <div className="toolbar-left">
        <Link to={`${BASE_PATH}/`} className="active" onClick={() => doAction(ToolbarAction.Cancel)}>
          <FontAwesomeIcon icon={editActive} color="gray" className="icon edit" />
        </Link>
        <Link to={`${BASE_PATH}/edit`} className="disabled">
          <FontAwesomeIcon icon={createIcon} color="gray" className="icon create" />
        </Link>
      </div>
      <div className="toolbar-right">
        <Link to={`${BASE_PATH}/edit`} onClick={handleShow}>
          <FontAwesomeIcon icon={deleteIcon} color="gray" className="icon delete" />
        </Link>
        {renderDivider()}
        <Link to={`${BASE_PATH}/`} onClick={() => doAction(ToolbarAction.Cancel)}>
          <FontAwesomeIcon icon={cancelIcon} color="gray" className="icon cancel" />
        </Link>
        <Link to={`${BASE_PATH}/`} onClick={() => doAction(ToolbarAction.EditSave)}>
          <FontAwesomeIcon icon={saveIcon} color="gray" className="icon save" />
        </Link>
      </div>
    </>;

  /* Render */
  return (
    <Form className="toolbar">
      {renderDatasetSelect()}
      <Route exact path={`${BASE_PATH}/`} render={renderDefault}></Route>
      <Route path={`${BASE_PATH}/edit`} render={renderEdit}></Route>
      <Route path={`${BASE_PATH}/create`} render={renderCreate}></Route>
      {show && renderModal()}
    </Form>
  )
}

export default Toolbar;