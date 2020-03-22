import * as React from 'react';
import * as $ from 'jquery';
import { map } from 'lodash';
import { Link, Route } from 'react-router-dom';
import { UserMode } from './Home';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit as editIcon } from '@fortawesome/free-regular-svg-icons'
import {
  faCheck as saveIcon,
  faEdit as editActive,
  faTimes as cancelIcon,
  faTrash as deleteIcon
} from '@fortawesome/free-solid-svg-icons'
import { Form } from 'react-bootstrap';
import { Dataset } from '../models/Dataset';


type ToolbarProps = {
  dataset: Dataset;
  datasetList: Dataset[];
  mode: UserMode;
  updateMode: Function;
  updateDataset: Function;
};

const Toolbar: React.FunctionComponent<ToolbarProps> = ({ mode, updateMode, updateDataset, datasetList, dataset }) => {

  const handleClick = (e: any) => {
    console.log('Toolbar handleClick', e);
  }

  const renderRouteAction = () => {
    return (
      <>
        <Route exact path="/">
          <Link to="edit" >
            <FontAwesomeIcon icon={editIcon} color="gray" className="icon" onClick={() => updateMode(UserMode.Edit)} />
          </Link>
        </Route>
        <Route path="/edit">
          <Link to="/">
            <FontAwesomeIcon icon={editActive} color="gray" className="icon cancel" onClick={() => updateMode(UserMode.View)} />
          </Link>
          {/* <Link to="/">
            <FontAwesomeIcon icon={saveIcon} color="gray" className="icon save" onClick={handleClick} />
          </Link> */}
          <div className="divider" />
          <Link to="/">
            <FontAwesomeIcon icon={deleteIcon} color="gray" className="icon delete" />
          </Link>
        </Route>
      </>
    )
  }

  return (
    <Form className="toolbar">
      <Form.Control as="select" className="custom-select" disabled={mode == UserMode.Edit} onChange={(e: React.FormEvent) => updateDataset($(e.target).val())} value={dataset.Id.toString()}>
        {map(datasetList, (d, i) =>
          <option key={i} value={d.Id.toString()}>
            {d.Label}
          </option>
        )}
      </Form.Control>
      {renderRouteAction()}
    </Form>
  )
}

export default Toolbar;