import * as React from "react"
import ChartistGraph from 'react-chartist';
import { map } from 'lodash';
import moment = require("moment");
import { useState } from "react";
import { ChartistOptions, SERIES_PREFIXES } from "../models/ChartistOptions";
import { ApiDataset } from "../models/ApiDataset";
import { SeriesType } from "../shared/enums";
import { ApiSeries } from "../models/ApiSeries";
import Alert from "react-bootstrap/Alert";

type GraphProps = {
  dataset: ApiDataset;
  defaultType?: GraphType;
};

export enum GraphType {
  Bar = 'Bar',
  Line = 'Line',
}

export const DEFAULT_CHARTIST_COLORS = [
  '#d70206',
  '#f05b4f',
  '#f4c63d',
  '#d17905',
  '#453d3f',
  '#59922b',
  '#0544d3',
  '#6b0392',
  '#f05b4f',
]

const renderColorStyle = (series: ApiSeries[], className: string) => {
  return (
    <style>
      {map(series, (s, i) => {
        const prefix = SERIES_PREFIXES.substr(i, 1);
        const color = s.Color || DEFAULT_CHARTIST_COLORS[s.Order];

        return `
          .${className} .ct-series-${prefix} .ct-line,
          .${className} .ct-series-${prefix} .ct-point {
            stroke: ${color};
          }`;
      })}
    </style>
  )
}

const Graph: React.FunctionComponent<GraphProps> = ({
  dataset,
  defaultType = GraphType.Line
}) => {
  const [type, setType] = useState<GraphType>(defaultType);

  const options = new ChartistOptions();

  const ChartistData = (labels: string[], series: ApiSeries[]) => {
    return {
      labels,
      series: map(series, (s: ApiSeries, i: number) => {
        return map(s.Data, (value: string, j: number) => ChartistRecord(s.SeriesType, labels[j], value, i));
      })
    }
  }

  const ChartistRecord = (type: SeriesType, dateTimeString: string, value?: string, index?: number) => {
    let parsed;
    switch (type) {
      case SeriesType.Decimal:
        parsed = Number.parseFloat(value);
        break;
      case SeriesType.Integer:
        parsed = Number.parseInt(value);
        break;
      case SeriesType.Boolean:
        // Keep series in desc order on chart
        parsed = value === 'true' ? -(index + 1) : null;
        break;
      default:
        parsed = null;
        break;
    }

    return !parsed ? null : {
      x: moment(dateTimeString),
      y: parsed
    };
  }

  let hasNumericalData, hasFrequencyData;

  if (dataset) {
    hasNumericalData = dataset.NumericalSeries.length > 0;
    hasFrequencyData = dataset.FrequencySeries.length > 0;
  }

  const lineGraph = (dataset: ApiDataset) => {
    return (<>
      {renderColorStyle(dataset.NumericalSeries, 'numerical')}
      <ChartistGraph
        data={ChartistData(dataset.SeriesLabels, dataset.NumericalSeries)}
        options={options.getNumericalOptions()}
        type={type}
      />
    </>);
  };

  const frequencyGraph = (dataset: ApiDataset, hideLabels: boolean) => {
    return (<>
      {renderColorStyle(dataset.FrequencySeries, 'frequency')}
      <ChartistGraph
        data={ChartistData(dataset.SeriesLabels, dataset.FrequencySeries)}
        options={options.getFrequencyOptions(dataset.FrequencySeries, hideLabels)}
        type={type}
      />
    </>);
  };

  const blankGraph = () => {
    return (<ChartistGraph
      data={{}}
      options={options.getNumericalOptions()}
      type={type}
    />);
  }

  const alertStyle = {
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 0 0 4px #ffffffcc',
    backgroundColor: '#e2e3e5aa'
  }

  return dataset ?
    (
      <>
        {hasNumericalData && lineGraph(dataset)}
        {hasFrequencyData && frequencyGraph(dataset, hasNumericalData)}
      </>
    )
    :
    (
      <div className="position-relative">
        <Alert variant="secondary" style={alertStyle} className="position-absolute">
          No Dataset
  </Alert>
        {blankGraph()}
      </div>
    );
}

export default Graph;