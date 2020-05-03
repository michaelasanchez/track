import * as React from 'react';
import $ from 'jquery';
import { map } from 'lodash';
import { Link, Route } from 'react-router-dom';
import { UserMode } from './Home';
import Request from '../models/Request';
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
  const [show, setShow] = useState(false);

  const archiveDataset = (dataset: Dataset) => new Request('Datasets').Delete(dataset);

  const handleShow = () => setShow(true);

  const handleClose = (confirm: boolean = false) => {
    setShow(false);
    updateMode(UserMode.View);
    if (confirm) {
      const req = archiveDataset(dataset);
      req.then(() => updateDatasetList());
    }
  };

  /* Delete Modal */
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
        <Link to="/" onClick={() => handleClose(true)}>
          <Button variant="primary">
            Confirm
          </Button>
        </Link>
      </Modal.Footer>
    </Modal>

  /* Home */
  const renderDefault = () =>
    <Route exact path="/">
      <Link to="edit" onClick={() => updateMode(UserMode.Edit)} >
        <FontAwesomeIcon icon={editIcon} color="gray" className="icon" />
      </Link>
      <div className="divider" />
      <Link to="/create">
        <FontAwesomeIcon icon={createIcon} color="gray" className="icon create" />
      </Link>
    </Route>;

  /* Edit */
  const renderEdit = () =>
    <Route path="/edit">
      <Link to="/" onClick={() => updateMode(UserMode.View)} >
        <FontAwesomeIcon icon={editActive} color="gray" className="icon cancel" />
      </Link>
      {/* <Link to="/">
        <FontAwesomeIcon icon={saveIcon} color="gray" className="icon save" onClick={handleClick} />
      </Link> */}
      <div className="divider" />
      <Link to="/edit" onClick={handleShow}>
        <FontAwesomeIcon icon={deleteIcon} color="gray" className="icon delete" />
      </Link>
    </Route>;


  /* Create */
  const renderCreate = () =>
    <Route path="/create">
      <Link to="edit" onClick={() => updateMode(UserMode.Edit)}  >
        <FontAwesomeIcon icon={editIcon} color="gray" className="icon" />
      </Link>
      <div className="divider" />
      <Link to="/">
        <FontAwesomeIcon icon={cancelIcon} color="gray" className="icon" />
      </Link>
      <Link to="/" onClick={() => onAction(ToolbarAction.Create)}>
        <FontAwesomeIcon icon={saveIcon} color="gray" className="icon" />
      </Link>
    </Route>;

  const renderRouteAction = () =>
    <>
      {renderDefault()}
      {renderEdit()}
      {renderCreate()}
    </>

  return (
    <Form className="toolbar">
      <Form.Control
        as="select"
        className="custom-select"
        disabled={mode == UserMode.Edit}
        onChange={(e: React.FormEvent) => updateDataset($(e.target).val())}
        value={dataset.Id.toString()}>
        {map(datasetList, (d, i) =>
          <option key={i} value={d.Id.toString()}>
            {d.Label}
          </option>
        )}
      </Form.Control>
      {renderRouteAction()}
      {renderModal()}
    </Form>
  )
}

export default Toolbar;