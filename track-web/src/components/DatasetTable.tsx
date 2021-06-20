import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { map } from 'lodash';
import moment from 'moment';
import React from 'react';
import { Table } from 'react-bootstrap';
import { ApiDataset } from '../models/api';
import { defaultColor } from '../utils/ChartistOptionsFactory';

interface DatasetTableProps {
  activeRow: string;
  apiDataset: ApiDataset;
  setActiveRow: (updated: string) => void;
}

export const DatasetTable: React.FunctionComponent<DatasetTableProps> = (
  props
) => {
  const { activeRow, apiDataset, setActiveRow } = props;

  const handleSetActiveRow = (i: string) => {
    setActiveRow(i === activeRow ? null : i);
  };

  const renderTableHead = () => {
    return (
      <tr>
        <th>
          Date <span className="small text-muted">/ Time</span>
        </th>
        {map(apiDataset.NumericalSeries, (n, i) => (
          <th key={i}>{n.Label}</th>
        ))}
        {map(apiDataset.FrequencySeries, (f, i) => (
          <th key={i}>{f.Label}</th>
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
                    <FontAwesomeIcon
                      icon={faCheck}
                      color={f.Color || `#${defaultColor(f.Order)}`}
                    />
                  )}
                </td>
              ))}
            </tr>
          );
        })}
      </>
    );
  };

  return (
    <>
      <div className="table-container">
        <Table striped hover className="table-data">
          <thead>{renderTableHead()}</thead>
          <tbody>{renderTableBody()}</tbody>
        </Table>
      </div>
    </>
  );
};
