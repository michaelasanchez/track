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
import { useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Select, { components, OptionsType } from 'react-select';
import { Dataset } from '../models/odata/Dataset';
import { UserMode } from '../shared/enums';
import { strings } from '../shared/strings';
import ToolbarButton from './inputs/ToolbarButton';
import { IModalState, Modal } from './Modal';

export enum ToolbarAction {
  CreateBegin,
  CreateSave,
  EditBegin,
  EditSave,
  Delete,
  Discard,
  Refresh,
}

enum SortOrder {
  Ascending = 1,
  Descending = -1,
  Id = 0,
}

// TODO: move into toolbar options
const _groupOptions = true;
const _groupSort = SortOrder.Ascending;
const _optionSort = SortOrder.Ascending;

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

interface SelectOption extends OptionsType<any> {
  label: string;
  value: any;
}

type SelectOptionGroup = {
  label: string;
  options: SelectOption[];
};

type ToolbarProps = {
  dataset: Dataset;
  datasetList: Dataset[];
  mode: UserMode;
  disabled?: boolean;
  onAction: (action: ToolbarAction, args?: any) => void;
  hasChanges?: boolean;
};

const Toolbar: React.FunctionComponent<ToolbarProps> = ({
  mode,
  datasetList,
  dataset,
  onAction: performAction,
  disabled,
  hasChanges,
}) => {
  const editMode = mode == UserMode.Edit;
  const createMode = mode == UserMode.Create;

  const hasDatasets = datasetList?.length > 0;

  const disableAll = !hasDatasets || disabled;
  const disableSelect = editMode || createMode || disableAll;
  const disableAllClass = disableAll ? ' disabled' : '';

  const [modalState, setModalState] = useState<IModalState>(null);
  let history = useHistory();

  const getModalState = (
    strings: any,
    toolbarAction: ToolbarAction,
    variant?: string
  ): IModalState => {
    let newState = {
      title: strings.title,
      confirmLabel: strings.confirm,
      cancelLabel: strings.cancel,
      onConfirm: () => handleCloseModal(toolbarAction),
      onCancel: () => setModalState(null),
    } as IModalState;

    if (strings?.body) {
      newState.body = strings.body(dataset.Label);
    }
    if (variant) newState.variant = variant;

    return newState;
  };

  const handleShowModal = (action: ToolbarAction) => {
    switch (action) {
      case ToolbarAction.Discard:
        if (hasChanges)
          setModalState(
            getModalState(strings.modal.discard, action, 'outline-primary')
          );
        else {
          history.push('/');
          performAction(ToolbarAction.Discard);
        }
        break;

      case ToolbarAction.Delete:
        setModalState(getModalState(strings.modal.delete, action));
        break;
    }
  };

  const handleCloseModal = (toolbarAction: ToolbarAction) => {
    switch (toolbarAction) {
      case ToolbarAction.Delete:
        performAction(ToolbarAction.Delete);
        break;

      case ToolbarAction.Discard:
        performAction(ToolbarAction.Discard);
        break;
    }

    setModalState(null);
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

    if (!_groupOptions) {
      if (!!_optionSort) {
        options = options.sort((a, b) => sortFn(a, b, _optionSort));
      }
      return [options, current];
    } else {
      let groups: SelectOptionGroup[] = [
        {
          label: 'Empty',
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

      if (!!_groupSort) {
        groups = groups.sort((a, b) =>
          a.label.toLowerCase() > b.label.toLowerCase()
            ? _groupSort
            : -_groupSort
        );
      }

      if (!!_optionSort) {
        each(groups, (g) => {
          g.options = g.options.sort((a, b) => sortFn(a, b, _optionSort));
        });
      }

      return [groups, current];
    }
  };

  /* Select */
  const renderDatasetSelect = () => {
    const [options, current] = groupedOptions();

    const handleHeaderClick = (id: any) => {
      const node = document.querySelector(`#${id}`).parentElement
        .nextElementSibling;
      node.classList.toggle('collapsed');
    };

    const CustomGroupHeading = (props: any) => {
      return (
        <div
          className="group-heading-wrapper"
          onClick={() => handleHeaderClick(props.id)}
        >
          <components.GroupHeading {...props} />
        </div>
      );
    };

    return (
      <Select
        className="select"
        isDisabled={disableSelect}
        isSearchable={false}
        options={options}
        value={current}
        formatGroupLabel={formatGroupLabel}
        onChange={(option: any) =>
          performAction(ToolbarAction.Refresh, option.value)
        }
        // menuIsOpen={true} // dev
        components={{ GroupHeading: CustomGroupHeading }}
      />
    );
  };

  const toolbarLeft = (
    <>
      <ToolbarButton
        label="Edit"
        link={mode == UserMode.View && '/edit'}
        onClick={
          editMode
            ? () => handleShowModal(ToolbarAction.Discard)
            : () => performAction(ToolbarAction.EditBegin)
        }
        icon={editIcon}
        iconActive={editActive}
        iconClass={`edit ${disableAllClass}`}
        active={editMode}
        disabled={createMode} // keep width
      />
      {!editMode && (
        <ToolbarButton
          label="Create"
          link={mode == UserMode.View && '/create'}
          onClick={() =>
            createMode
              ? handleShowModal(ToolbarAction.Discard)
              : performAction(ToolbarAction.CreateBegin)
          }
          icon={createIcon}
          iconClass={`create ${disableAllClass}`}
          active={createMode}
        />
      )}
    </>
  );

  const toolbarRight = (
    <>
      {editMode && (
        <>
          <ToolbarButton
            onClick={() => handleShowModal(ToolbarAction.Delete)}
            icon={deleteIcon}
            iconClass="delete"
          />
          <div className="divider" />
        </>
      )}
      {(editMode || createMode) && (
        <>
          <ToolbarButton
            onClick={() => handleShowModal(ToolbarAction.Discard)}
            icon={cancelIcon}
            iconClass="cancel"
          />
          <ToolbarButton
            link="/"
            onClick={() =>
              performAction(
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
    <>
      <Col xs={6} md={4} lg={3}>
        {renderDatasetSelect()}
      </Col>
      <Col xs={6} md={4} lg={3} className="pl-0">
        <Form className="toolbar">
          <div className="toolbar-left">{toolbarLeft}</div>
          <div className="toolbar-right">{toolbarRight}</div>
        </Form>
      </Col>
      <Modal show={!!modalState} state={modalState} />
    </>
  );
};

export default Toolbar;
