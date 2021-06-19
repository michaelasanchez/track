import { faCheck, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { map } from 'lodash';
import moment from 'moment';
import React, { useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { ApiDataset } from '../models/api';

interface DatasetTableProps {
  apiDataset: ApiDataset;
}

export const DatasetTable: React.FunctionComponent<DatasetTableProps> = (
  props
) => {
  const { apiDataset } = props;

  const [activeRow, setActiveRow] = useState<string>(null);

  const handleSetActiveRow = (i: string) => {
    setActiveRow(i === activeRow ? null : i);
  };

  const renderTableHead = () => {
    return (
      <tr>
        <td>Date/Time</td>
        {map(apiDataset.NumericalSeries, (n, i) => (
          <td key={i}>{n.Label}</td>
        ))}
        {map(apiDataset.FrequencySeries, (f, i) => (
          <td key={i}>{f.Label}</td>
        ))}
      </tr>
    );
  };

  const renderTableBody = () => {
    return (
      <>
        {map(apiDataset.SeriesLabels, (s: string, i: string) => {
          const dateTime = moment(s);
          return (
            <tr
              key={i}
              onClick={() => handleSetActiveRow(i)}
              className={i == activeRow ? 'active' : ''}
            >
              <td>
                {dateTime.format('MMM D')}{' '}
                <span className="small text-muted">
                  {dateTime.format('h:ma')}
                </span>
              </td>
              {map(apiDataset.NumericalSeries, (n, j) => (
                <td key={j}>{n.Data[parseInt(i)]}</td>
              ))}
              {map(apiDataset.FrequencySeries, (f, k) => (
                <td key={k}>
                  {f.Data[parseInt(i)] === 'true' && (
                    <FontAwesomeIcon icon={faCheck} color={f.Color} />
                  )}
                </td>
              ))}
            </tr>
          );
        })}
      </>
    );
  };

  const renderRecordActions = () => {
    const active = activeRow !== null;
    return (
      <div className={`record-actions${active ? ' active' : ''}`}>
        <Button variant="outline-secondary" disabled={!activeRow}>
          <FontAwesomeIcon icon={faTrash} />
        </Button>
        <Button variant="outline-secondary" disabled={!activeRow}>
          <FontAwesomeIcon icon={faEdit} />
        </Button>
      </div>
    );
  };

  return (
    <>
      {renderRecordActions()}
      <Table striped hover>
        <thead>{renderTableHead()}</thead>
        <tbody>{renderTableBody()}</tbody>
      </Table>
    </>
  );
};
