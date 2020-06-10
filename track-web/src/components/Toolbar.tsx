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
import { BASE_PATH } from './Home';

export enum ToolbarAction {
  Create,
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
  onAction
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

  const renderDivider = () => {
    return <div className="divider" />;
  }

  const getOptions = map(datasetList, d => { return { value: d.Id, label: d.Label } });

  /* Select */
  const renderDatasetSelect = () => {
    return (
      <>
        <Form.Control
          as="select"
          className="custom-select"
          disabled={disableSelect}
          onChange={(e: React.FormEvent) => updateDataset($(e.target).val())}
          value={dataset?.Id.toString()}>
          {map(datasetList, (d, i) =>
            <option key={i} value={d.Id.toString()}>
              {d.Label}
            </option>
          )}
        </Form.Control>
      </>
    );
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
    <>
      <div className="toolbar-left">
        <Link to={`${BASE_PATH}/edit`} onClick={() => updateMode(UserMode.Edit)}>
          <FontAwesomeIcon icon={editIcon} color="gray" className={`icon edit${disabled ? ' disabled' : ''}`} />
        </Link>
      </div>
      <div className="toolbar-right">
        <Link to={`${BASE_PATH}/create`} onClick={() => updateMode(UserMode.Create)}>
          <FontAwesomeIcon icon={createIcon} color="gray" className={`icon create${disabled ? ' disabled' : ''}`} />
        </Link>
      </div>
    </>;

  /* Edit */
  const renderEdit = () =>
    <>
      <div className="toolbar-left">
        <Link to={`${BASE_PATH}/`} onClick={() => updateMode(UserMode.View)} >
          <FontAwesomeIcon icon={editActive} color="gray" className="icon cancel" />
        </Link>
        {/* <Link to="/">
          <FontAwesomeIcon icon={saveIcon} color="gray" className="icon save" onClick={handleClick} />
        </Link> */}
      </div>
      <div className="toolbar-right">
        <Link to={`${BASE_PATH}/edit`} onClick={handleShow}>
          <FontAwesomeIcon icon={deleteIcon} color="gray" className="icon delete" />
        </Link>
      </div>
    </>;

  /* Create */
  const renderCreate = () =>
    <>
      <div className="toolbar-left">
        <Link to={`${BASE_PATH}/create`} onClick={() => updateMode(UserMode.Create)}>
          <FontAwesomeIcon icon={editIcon} color="gray" className="icon disabled" />
        </Link>
      </div>
      <div className="toolbar-right">
        <Link to={`${BASE_PATH}/`} onClick={() => onAction(ToolbarAction.Create)}>
          <FontAwesomeIcon icon={saveIcon} color="gray" className="icon save" />
        </Link>
        <Link to={`${BASE_PATH}/`} onClick={() => updateMode(UserMode.View)}>
          <FontAwesomeIcon icon={cancelIcon} color="gray" className="icon cancel" />
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