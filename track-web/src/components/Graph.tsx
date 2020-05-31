import * as React from "react"
import ChartistGraph from 'react-chartist';
import { map } from 'lodash';
import moment = require("moment");
import { useState } from "react";
import { ChartistOptions, SERIES_PREFIXES } from "../models/ChartistOptions";
import { ApiDataset } from "../models/ApiDataset";
import { SeriesType } from "../shared/enums";
import { ApiSeries } from "../models/ApiSeries";

type GraphProps = {
  dataset: ApiDataset;
  defaultType?: GraphType;
};

export enum GraphType {
  Bar = 'Bar',
  Line = 'Line',
}

const renderColorStyle = (series: ApiSeries[], className: string) => {
  return (
    <style>
      {map(series, (s, i) => {
        var prefix = SERIES_PREFIXES.substr(i, 1);
        if (s.Color) {
          return `
            .${className} .ct-series-${prefix} .ct-line,
            .${className} .ct-series-${prefix} .ct-point {
              stroke: ${s.Color};
            }`;
        } else {
          return null;
        }
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
    switch(type) {
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

  const hasNumericalData = dataset.NumericalSeries.length > 0;
  const hasFrequencyData = dataset.FrequencySeries.length > 0;

  const lineGraph = (
    <>
      {renderColorStyle(dataset.NumericalSeries, 'numerical')}
      <ChartistGraph
        data={ChartistData(dataset.SeriesLabels, dataset.NumericalSeries)}
        options={options.getNumericalOptions()}
        type={type}
      />
    </>
  );

  const frequencyGraph = (
    <>
      {renderColorStyle(dataset.FrequencySeries, 'frequency')}
      <ChartistGraph
        data={ChartistData(dataset.SeriesLabels, dataset.FrequencySeries)}
        options={options.getFrequencyOptions(dataset.FrequencySeries, hasNumericalData)}
        type={type}
      />
    </>
  );

  return (
    <>
      {hasNumericalData && lineGraph}
      {hasFrequencyData && frequencyGraph}
    </>
  );
}

export default Graph;