import { faEdit as editIcon } from '@fortawesome/free-regular-svg-icons';
import { faTimes as cancelIcon, faPlusCircle as createIcon, faTrash as deleteIcon, faEdit as editActive, faCheck as saveIcon } from '@fortawesome/free-solid-svg-icons';
import { map } from 'lodash';
import * as React from 'react';
import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Select from 'react-select';

import { Dataset } from '../models/odata/Dataset';
import { UserMode } from '../shared/enums';
import ApiRequest from '../utils/Request';
import ToolbarButton from './inputs/ToolbarButton';

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

  const editMode = mode == UserMode.Edit;
  const createMode = mode == UserMode.Create;

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
        <Modal.Title>Just checking</Modal.Title>
      </Modal.Header>
      <Modal.Body>Dataset "{dataset.Label}" is about to be <strong>deleted</strong></Modal.Body>
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

  const toolbarLeft = () =>
    <>
      <ToolbarButton
        label="Edit"
        link={editMode ? '/' : '/edit'}
        className={editMode ? 'active' : ''}
        onClick={() => doAction(editMode ? ToolbarAction.Cancel : ToolbarAction.EditBegin)}
        icon={editIcon}
        iconActive={editActive}
        iconClass={`edit ${disableAllClass}`}
        active={editMode}
        disabled={createMode}
      />
      <ToolbarButton
        label="Create"
        link={createMode ? '/' : '/create'}
        className={createMode ? 'active' : ''}
        onClick={() => doAction(createMode ? ToolbarAction.Cancel : ToolbarAction.CreateBegin)}
        icon={createIcon}
        iconClass={`create ${disableAllClass}`}
        active={createMode}
        disabled={editMode}
      />
    </>;

  const toolbarRight = () =>
    <>
      {editMode &&
        <>
          <ToolbarButton
            onClick={() => setShowModal(true)}
            icon={deleteIcon}
            iconClass="delete"
          />
          <div className="divider" />
        </>}
      {(editMode || createMode) &&
        <>
          <ToolbarButton
            link="/"
            onClick={() => doAction(ToolbarAction.Cancel)}
            icon={cancelIcon}
            iconClass="cancel"
          />
          <ToolbarButton
            link="/"
            onClick={() => doAction(editMode ? ToolbarAction.EditSave : ToolbarAction.CreateSave)}
            icon={saveIcon}
            iconClass="save"
          />
        </>}
    </>

  /* Render */
  return (
    <Form className="toolbar">

      {renderDatasetSelect()}

      <div className="toolbar-left">
        {toolbarLeft()}
      </div>

      <div className="toolbar-right">
        {toolbarRight()}
      </div>

      {renderModal()}

    </Form>
  )
}

export default Toolbar;