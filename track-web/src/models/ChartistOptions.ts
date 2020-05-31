import { ILineChartOptions, FixedScaleAxis } from "chartist";
import moment from "moment";
import { ApiSeries } from "./ApiSeries";

// Default css class suffixes for series (lines, points)
// TODO: figure out what happens after z
export const SERIES_PREFIXES = 'abcdefghijklmnoqrstuvwxyz';

export const COLORS_DEFAULT = [
  'd70206',
  'f05b4f',
  'f4c63d',
  'd17905',
  '453d3f',
  '59922b',
  '0544d3',
  '6b0392',
  'f05b4f'
]

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

  public getFrequencyOptions = (series: ApiSeries[], hideLabel: boolean = false): ILineChartOptions => {
    return {
      ...this._options,
      // height: chartistData.FrequencyData.length * 10,
      height: series.length * 40,
      showLine: false,
      classNames: {
        chart: 'ct-chart-line frequency'
      },
      axisY: {
        onlyInteger: true,
        labelInterpolationFnc: function (value: any, index: number) {
          const l = series.length;
          if (index < l) {
            // Based on boolean values equals -(index + 1) in ChartistRecord
            return series[l - 1 - index].Label;
          }
        },
      },
      axisX: hideLabel ? AXIS_X_OFF : AXIS_X_DEFAULT,
    } as ILineChartOptions;
  }


}