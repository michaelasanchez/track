import * as React from "react"
import ChartistGraph from 'react-chartist';
import { Dataset } from "../models/Dataset";
import { ChartistData } from "../models/ChartistData";
import { each, map, times } from 'lodash';
import { ILineChartOptions, FixedScaleAxis } from "chartist";
import { Moment } from 'moment';
import moment = require("moment");

type GraphProps = {
  dataset: Dataset;
  type?: string;
};

export const Graph: React.FunctionComponent<GraphProps> = ({ dataset, type = "Line" }) => {

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
    console.log('chartistData', chartistData);
    return chartistData;
  }

  if (dataset) {
    const seriesPrefixes = 'abcdefghijklmnoqrstuvwxyz';
    var data = convertDatasetToData(dataset);

    var options = {
      axisX: {
        type: FixedScaleAxis,
        // divisor: Math.round(Math.max(1, 300/ 30)),
        labelInterpolationFnc: function (value: any) {
          console.log(value);
          return value;
        }
      },
      fullWidth: true,
      chartPadding: {
        right: 50
      },
      // axisX: {
      //   labelInterpolationFnc: function (value: any, index: any) {
      //     return index % 2 === 0 ? value : null;
      //   }
      // }
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