import * as React from "react"
import ChartistGraph from 'react-chartist';
import { Dataset } from "../models/Dataset";

type GraphProps = {
  dataset: Dataset;
  type?: string;
};

export const Graph: React.FunctionComponent<GraphProps> = ({ dataset, type = "Line" }) => {

  if (dataset) {

    console.log('dataset', dataset);

    var data = {
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
      series: [
        [1, 2, 4, 8, 6, -2, -1, -4, -6, -2]
      ]
    };

    var options = {
      high: 10,
      low: -10,
      fullWidth: true,
      chartPadding: {
        right: 50
      },
      // axisX: {
      //   labelInterpolationFnc: function (value: any, index: any) {
      //     return index % 2 === 0 ? value : null;
      //   }
      // }
    };

    return (
      <ChartistGraph data={data} options={options} type={type} />
    );
  }

  return null;
}