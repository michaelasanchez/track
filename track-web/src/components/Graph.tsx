import * as React from "react"
import ChartistGraph from 'react-chartist';
import { Dataset } from "../models/Dataset";
import { ChartistData } from "../models/ChartistData";
import { each, map, times } from 'lodash';
import { ILineChartOptions, FixedScaleAxis } from "chartist";
import moment = require("moment");
import { useState } from "react";

type GraphProps = {
  dataset: Dataset;
  defaultType?: GraphType;
};

export enum GraphType {
  Bar = 'Bar',
  Line = 'Line',
}

const Graph: React.FunctionComponent<GraphProps> = ({
  dataset,
  defaultType = GraphType.Line
}) => {
  const [type, setType] = useState<GraphType>(defaultType);

  const datasetToChartistData = (dataset: Dataset): ChartistData => {
    var chartistData = new ChartistData(dataset);
    console.log(dataset, chartistData.LineData);

    return chartistData;
  }

  if (dataset) {
    const seriesPrefixes = 'abcdefghijklmnoqrstuvwxyz';
    var chartistData = datasetToChartistData(dataset);

    var options = {
      height: 500,
      fullWidth: true,
      axisX: {
        type: FixedScaleAxis,
        divisor: 3,
        labelInterpolationFnc: function (value: any, index: number) {
          
          return moment(value).format("h:mm a");
        }
      },
      // chartPadding: { right: 50 },
    } as ILineChartOptions;

    return (
      <>
        <style>
          {map(dataset.Series, (s, i) => {
            var prefix = seriesPrefixes.substr(i, 1);
            return `.ct-series-${prefix} .ct-line, .ct-series-${prefix} .ct-point {
            stroke: ${"#" + s.Color};
          }`
          })}
        </style>
        <ChartistGraph data={chartistData.LineData} options={options} type={type} />
      </>
    );
  }

  return null;
}

export default Graph;