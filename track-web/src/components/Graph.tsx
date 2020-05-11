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

const Graph: React.FunctionComponent<GraphProps> = ({ dataset, defaultType = GraphType.Line}) => {
  const [type, setType] = useState<GraphType>(defaultType);

  const convertDatasetToData = (dataset: Dataset): ChartistData => {
    var chartistData = new ChartistData(dataset.Series.length);

    // labels
    chartistData.labels = map(dataset.Records, r => r.DateTime);
    // series
    map(dataset.Records, r => {
      each(r.Properties, (p, i) => {
        chartistData.series[i].push(
          {
            x: new Date(r.DateTime),
            y: Number.parseFloat(p.Value),
          })
      })
    });
    
    return chartistData;
  }

  if (dataset) {
    const seriesPrefixes = 'abcdefghijklmnoqrstuvwxyz';
    var data = convertDatasetToData(dataset);

    var options = {
      height: 500,
      fullWidth: true,
      axisX: {
        type: FixedScaleAxis,
        divisor: 3,
        labelInterpolationFnc: function (value: any) {
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
        <ChartistGraph data={data} options={options} type={type} />
      </>
    );
  }

  return null;
}

export default Graph;