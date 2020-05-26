import * as React from "react"
import ChartistGraph from 'react-chartist';
import { Dataset } from "../models/Dataset";
import { ChartistDataset } from "../models/ChartistDataset";
import { each, map, times } from 'lodash';
import { ILineChartOptions, FixedScaleAxis } from "chartist";
import moment = require("moment");
import { useState } from "react";
import { ChartistSeries, GraphFormat } from "../models/ChartistSeries";
import { ChartistOptions, SERIES_PREFIXES } from "../models/ChartistOptions";

type GraphProps = {
  dataset: Dataset;
  defaultType?: GraphType;
};

export enum GraphType {
  Bar = 'Bar',
  Line = 'Line',
}

const renderColorStyle = (series: ChartistSeries[], className: string) => {
  return (
    <style>
      {map(series, (s, i) => {
        var prefix = SERIES_PREFIXES.substr(i, 1);
        if (s.Color) {
          return `
            .${className} .ct-series-${prefix} .ct-line,
            .${className} .ct-series-${prefix} .ct-point {
              stroke: #${s.Color};
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
  const chartistDataset = new ChartistDataset(dataset);

  const lineGraph = (
    <>
      {renderColorStyle(chartistDataset.NumericalSeries, 'numerical')}
      <ChartistGraph
        data={chartistDataset.NumericalData}
        options={options.getNumericalOptions()}
        type={type}
      />
    </>
  );

  const frequencyGraph = (
    <>
      {renderColorStyle(chartistDataset.FrequencySeries, 'frequency')}
      <ChartistGraph
        data={chartistDataset.FrequencyData}
        options={options.getFrequencyOptions(chartistDataset)}
        type={type}
      />
    </>
  );

  return (
    <>
      {chartistDataset.HasNumericalData() && lineGraph}
      {chartistDataset.HasFrequencyData() && frequencyGraph}
    </>
  );
}

export default Graph;