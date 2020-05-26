import { GraphFormat } from "./ChartistSeries";
import { ILineChartOptions, FixedScaleAxis } from "chartist";
import moment from "moment";
import { ChartistDataset } from "./ChartistDataset";

// Default css class suffixes for series (lines, points)
// TODO: figure out what happens after z
export const SERIES_PREFIXES = 'abcdefghijklmnoqrstuvwxyz';

const OPTIONS_DEFAULT = {
  // height: 400,
  fullWidth: true,
  // chartPadding: { right: 50 },
};

const AXIS_X_DEFAULT = {
  type: FixedScaleAxis,
  divisor: 5,
  labelInterpolationFnc: function (value: any, index: number) {
    return moment(value).format();
  }
}

const AXIS_X_OFF = {
  showLabel: false,
  type: FixedScaleAxis,
  divisor: 5,
};

// TODO: Not sure if this makes sense as a class?
export class ChartistOptions {

  private _options: ILineChartOptions;

  constructor() {
    this._options = OPTIONS_DEFAULT;
  }

  public getNumericalOptions = (): ILineChartOptions => {
    return {
      ...this._options,
      height: 300,
      classNames: {
        chart: 'ct-chart-line numerical'
      },
      axisX: AXIS_X_DEFAULT,
    } as ILineChartOptions;
  }

  public getFrequencyOptions = (dataset: ChartistDataset): ILineChartOptions => {
    return {
      ...this._options,
      // height: chartistData.FrequencyData.length * 10,
      height: dataset.FrequencySeries.length * 40,
      showLine: false,
      classNames: {
        chart: 'ct-chart-line frequency'
      },
      axisY: {
        onlyInteger: true,
        labelInterpolationFnc: function (value: any, index: number) {
          const l = dataset.FrequencySeries.length;
          if (index < l) {
            // Based on boolean values equals -(index)
            return dataset.FrequencySeries[l - 1 - index].Label;
          }
        },
      },
      axisX: dataset.HasNumericalData() ? AXIS_X_OFF : AXIS_X_DEFAULT,
    } as ILineChartOptions;
  }


}