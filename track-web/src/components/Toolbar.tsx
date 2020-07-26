import { faEdit as editIcon } from "@fortawesome/free-regular-svg-icons";
import {
  faCheck as saveIcon,
  faEdit as editActive,
  faPlusCircle as createIcon,
  faTimes as cancelIcon,
  faTrash as deleteIcon,
} from "@fortawesome/free-solid-svg-icons";
import { findIndex, map } from "lodash";
import * as React from "react";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Select from "react-select";

import { Dataset } from "../models/odata/Dataset";
import { UserMode } from "../shared/enums";
import { strings } from "../shared/strings";
import ApiRequest from "../utils/Request";
import ToolbarButton from "./inputs/ToolbarButton";

export enum ToolbarAction {
  CreateBegin,
  CreateSave,
  EditBegin,
  EditSave,
  Cancel,
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
  disabled,
}) => {
  const editMode = mode == UserMode.Edit;
  const createMode = mode == UserMode.Create;

  const hasDatasets = datasetList?.length > 0;

  const disableAll = !hasDatasets || disabled;
  const disableSelect = editMode || createMode || disableAll;
  const disableAllClass = disableAll ? " disabled" : "";

  const selectedIndex = findIndex(datasetList, (ds) => ds.Id == dataset.Id);

  const [showModal, setShowModal] = useState(false);

  const archiveDataset = (dataset: Dataset) =>
    new ApiRequest("Datasets").Delete(dataset);
  const handleCloseModal = (confirm: boolean = false) => {
    setShowModal(false);
    updateMode(UserMode.View);
    if (confirm) {
      archiveDataset(dataset).then(() => updateDatasetList());
    }
  };

  /* Select */
  const renderDatasetSelect = () => {
    const options = map(datasetList, (ds) => ({
      label: ds.Label,
      value: ds.Id,
    }));
    return (
      <Select
        className="select"
        isDisabled={disableSelect}
        isSearchable={false}
        options={options}
        value={options[selectedIndex]}
        onChange={(option: any) => updateDataset(option.value)}
      />
    );
  };

  /* Modal */
  const renderModal = () => (
    <Modal show={showModal} onHide={handleCloseModal} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>{strings.modal.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{strings.modal.body(dataset.Label)}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => handleCloseModal()}>
          {strings.modal.cancel}
        </Button>
        <Link to={`/`} onClick={() => handleCloseModal(true)}>
          <Button variant="primary">{strings.modal.confirm}</Button>
        </Link>
      </Modal.Footer>
    </Modal>
  );

  const toolbarLeft = (
    <>
      <ToolbarButton
        label="Edit"
        link={editMode ? "/" : "/edit"}
        className={editMode ? "active" : ""}
        onClick={() =>
          doAction(editMode ? ToolbarAction.Cancel : ToolbarAction.EditBegin)
        }
        icon={editIcon}
        iconActive={editActive}
        iconClass={`edit ${disableAllClass}`}
        active={editMode}
        disabled={createMode}
      />
      <ToolbarButton
        label="Create"
        link={createMode ? "/" : "/create"}
        className={createMode ? "active" : ""}
        onClick={() =>
          doAction(
            createMode ? ToolbarAction.Cancel : ToolbarAction.CreateBegin
          )
        }
        icon={createIcon}
        iconClass={`create ${disableAllClass}`}
        active={createMode}
        disabled={editMode}
      />
    </>
  );

  const toolbarRight = (
    <>
      {editMode && (
        <>
          <ToolbarButton
            onClick={() => setShowModal(true)}
            icon={deleteIcon}
            iconClass="delete"
          />
          <div className="divider" />
        </>
      )}
      {(editMode || createMode) && (
        <>
          <ToolbarButton
            link="/"
            onClick={() => doAction(ToolbarAction.Cancel)}
            icon={cancelIcon}
            iconClass="cancel"
          />
          <ToolbarButton
            link="/"
            onClick={() =>
              doAction(
                editMode ? ToolbarAction.EditSave : ToolbarAction.CreateSave
              )
            }
            icon={saveIcon}
            iconClass="save"
          />
        </>
      )}
    </>
  );

  /* Render */
  return (
    <Form className="toolbar">
      {renderDatasetSelect()}

      <div className="toolbar-left">{toolbarLeft}</div>

      <div className="toolbar-right">{toolbarRight}</div>

      {renderModal()}
    </Form>
  );
};

export default Toolbar;
