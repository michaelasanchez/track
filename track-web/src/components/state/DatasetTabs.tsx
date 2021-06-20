import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import { Button, Tab, Tabs } from 'react-bootstrap';
import { ApiDataset } from '../../models/api';
import DatasetGraph, { GraphDimensions } from '../DatasetGraph';
import { DatasetTable } from '../DatasetTable';

interface DatasetTabsProps {
  apiDataset: ApiDataset;
}

export const DatasetTabs: React.FunctionComponent<DatasetTabsProps> = (
  props
) => {
  const { apiDataset } = props;
  const [key, setKey] = useState('graph');

  const [activeRow, setActiveRow] = useState<string>(null);

  const [graphDimensions, setGraphDimensions] = useState<GraphDimensions>({
    height: 0,
    width: 0,
  });

  const chartRef = useRef<HTMLDivElement>();

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
      <Tabs activeKey={key} className="reverse" onSelect={(k) => setKey(k)}>
        <Tab eventKey="graph" title="Graph" className="graph-tab">
          <div className="graph-container" style={{ position: 'relative' }}>
            <DatasetGraph
              dataset={apiDataset}
              graphRef={chartRef}
              graphDimensions={graphDimensions}
              setGraphDimensions={setGraphDimensions}
            />
          </div>
        </Tab>
        <Tab
          eventKey="data"
          title="Table"
          className="table-tab"
          style={{ height: graphDimensions.height }}
        >
          <DatasetTable
            activeRow={activeRow}
            apiDataset={apiDataset}
            setActiveRow={setActiveRow}
          />
        </Tab>
      </Tabs>
      {renderRecordActions()}
    </>
  );
};
