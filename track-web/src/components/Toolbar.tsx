import { faEdit as editIcon } from '@fortawesome/free-regular-svg-icons';
import {
  faCheck as saveIcon,
  faEdit as editActive,
  faPlusCircle as createIcon,
  faTimes as cancelIcon,
  faTrash as deleteIcon,
} from '@fortawesome/free-solid-svg-icons';
import { each, findIndex, map } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Select, { OptionsType } from 'react-select';

import { Dataset } from '../models/odata/Dataset';
import { UserMode } from '../shared/enums';
import { strings } from '../shared/strings';
import ApiRequest from '../utils/Request';
import ToolbarButton from './inputs/ToolbarButton';

export enum ToolbarAction {
  CreateBegin,
  CreateSave,
  EditBegin,
  EditSave,
  Cancel,
}

enum SortOrder {
  Ascending = 1,
  Descending = -1,
  Id = 0,
}

// TODO: move into toolbar options
const groupOptions = true;
const groupSort = SortOrder.Ascending;
const optionSort = SortOrder.Ascending;

const sortFn = (a: SelectOption, b: SelectOption, sort: SortOrder): number => {
  return a.label.toLowerCase() > b.label.toLowerCase() ? sort : -sort;
};

const groupStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const groupLabelStyles = {
  color: '#999',
};

const groupBadgeStyles = {
  backgroundColor: '#EBECF0',
  borderRadius: '2em',
  color: '#888',
  display: 'inline-block',
  fontSize: 10,
  fontWeight: 'bold',
  lineHeight: '1',
  minWidth: 1,
  padding: '0.25em 0.7em',
  textAlign: 'center',
} as React.CSSProperties;

const formatGroupLabel = (data: any) => (
  <div style={groupStyles}>
    <span style={groupLabelStyles}>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

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

interface SelectOption extends OptionsType<any> {
  label: string;
  value: any;
}

type SelectOptionGroup = {
  label: string;
  options: SelectOption[];
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
  const disableAllClass = disableAll ? ' disabled' : '';

  const [showModal, setShowModal] = useState(false);

  const archiveDataset = (dataset: Dataset) =>
    new ApiRequest('Datasets').Delete(dataset);

  const handleCloseModal = (confirm: boolean = false) => {
    setShowModal(false);
    updateMode(UserMode.View);
    if (confirm) {
      archiveDataset(dataset).then(() => updateDatasetList());
    }
  };

  const groupedOptions = () => {
    let options: SelectOption[] = map(
      datasetList,
      (ds) =>
        ({
          label: ds.Label,
          value: ds.Id,
        } as SelectOption)
    );

    const current =
      options[findIndex(datasetList, (ds) => ds.Id == dataset.Id)];

    if (groupOptions) {
      let groups: SelectOptionGroup[] = [
        {
          label: 'Uncategorized',
          options: [],
        },
      ];

      each(datasetList, (ds: Dataset, datasetIndex: number) => {
        const option = options[datasetIndex];

        if (ds.Category) {
          // TODO: shouldn't be based on label
          const groupIndex = findIndex(
            groups,
            (g) => g.label == ds.Category.Label
          );

          if (groupIndex < 0) {
            groups.push({
              label: ds.Category.Label,
              options: [option],
            });
          } else {
            groups[groupIndex].options.push(option);
          }
        } else {
          groups[0].options.push(option);
        }
      });

      if (!!groupSort) {
        groups = groups.sort((a, b) =>
          a.label.toLowerCase() > b.label.toLowerCase() ? groupSort : -groupSort
        );
      }

      if (!!optionSort) {
        each(groups, (g) => {
          g.options = g.options.sort((a, b) => sortFn(a, b, optionSort));
        });
      }

      return [groups, current];
    } else {
      if (!!optionSort) {
        options = options.sort((a, b) => sortFn(a, b, optionSort));
      }
      return [options, current];
    }
  };

  /* Select */
  const renderDatasetSelect = () => {
    const [options, current] = groupedOptions();

    return (
      <Select
        className="select"
        isDisabled={disableSelect}
        isSearchable={false}
        options={options}
        value={current}
        // menuIsOpen={true} // dev
        onChange={(option: any) => updateDataset(option.value)}
        formatGroupLabel={formatGroupLabel}
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
        link={editMode ? '/' : '/edit'}
        className={editMode ? 'active' : ''}
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
        link={createMode ? '/' : '/create'}
        className={createMode ? 'active' : ''}
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
