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

const SERIES_PREFIXES = 'abcdefghijklmnoqrstuvwxyz';


const defaultOptions = {
  height: 400,
  fullWidth: true,
  // chartPadding: { right: 50 },
}

const Graph: React.FunctionComponent<GraphProps> = ({
  dataset,
  defaultType = GraphType.Line
}) => {
  const [type, setType] = useState<GraphType>(defaultType);

  const chartistData = new ChartistData(dataset);

  var options = {
    ...defaultOptions,
    showLine: true,
    axisX: {
      type: FixedScaleAxis,
      divisor: 5,
      labelInterpolationFnc: function (value: any, index: number) {
        return moment(value).format('MMM D');
      }
    },
  } as ILineChartOptions;

  var frequencyOptions = {
    ...defaultOptions,
    height: 200,
    showLine: false,
    axisY: {
      onlyInteger: true,
      labelInterpolationFnc: function (value: any, index: number) {
        if (index < dataset.Series.length)
        return dataset.Series[index].Label;
      },
    },
    axisX: {
      type: FixedScaleAxis,
      divisor: 5,
      labelInterpolationFnc: (value: any) => {
        return moment(value).format('MMM D');
      }
    }
  } as ILineChartOptions;

  const renderColorStyle = () => {
    return (
      <style>
        {map(dataset.Series, (s, i) => {
          var prefix = SERIES_PREFIXES.substr(i, 1);
          return `.ct-series-${prefix} .ct-line, .ct-series-${prefix} .ct-point {
              stroke: ${"#" + s.Color};
            }`
        })}
      </style>
    )
  }

  return (
    <>
      {renderColorStyle()}
      {chartistData.HasLineData() &&
        <ChartistGraph
          data={chartistData.LineData}
          options={options}
          type={type}
        />
      }
      {chartistData.HasFrequencyData() &&
        <ChartistGraph
          data={chartistData.FrequencyData}
          options={frequencyOptions}
          type={type}
        />
      }
    </>
  );
}

export default Graph;