import { ILineChartOptions, FixedScaleAxis, AutoScaleAxis, StepAxis, IChartistFixedScaleAxis } from "chartist";
import moment from "moment";
import { ApiSeries } from "./ApiSeries";
import Chartist from "chartist";
import { ApiDataset } from "./ApiDataset";
import { TimeSpan } from "../interfaces/TimeSpan";

// Default css class suffixes for series (lines, points)
// TODO: figure out what happens after z
export const SERIES_PREFIXES = 'abcdefghijklmnoqrstuvwxyz';

export const DEFAULT_CHARTIST_COLORS = [
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

const AXIS_Y_DEFAULT = {
  labelOffset: {
    y: 5
  }
}

const AXIS_X_DEFAULT = {
  type: FixedScaleAxis,
  labelInterpolationFnc: function (value: any) {
    const dateFormat = 'MMM D';
    const timeFormat = 'h:mma';
    return moment(value).format(`${dateFormat}`);
    return moment(value).format(`${dateFormat} ${timeFormat}`);
  }
} as IChartistFixedScaleAxis;

const AXIS_X_OFF = {
  showLabel: false,
};

const OPTIONS_DEFAULT = {
  // height: 400,
  fullWidth: true,
  // chartPadding: { right: 50 },
};

// TODO: Not sure if this makes sense as a class?
export class ChartistOptions {

  private _options: ILineChartOptions;

  private _span: TimeSpan;

  constructor(dataset: ApiDataset, span: TimeSpan) {
    this._options = OPTIONS_DEFAULT;
    this._span = span;
  }

  public apply = (update: ILineChartOptions) => {
    return this._options = {
      ...this._options,
      ...update
    }
  }

  private calcDivisor = (): number => {
    return Math.round(this._span.days);
  }

  public getNumericalOptions = (): ILineChartOptions => {
    return {
      ...this._options,
      height: 300,
      // chartPadding: {
      //   right: 100
      // },
      classNames: {
        chart: 'ct-chart-line numerical'
      },
      axisX: {
        ...AXIS_X_DEFAULT,
        divisor: this.calcDivisor()
      },
      axisY: {
        ...AXIS_Y_DEFAULT
      }
      // lineSmooth: false
      // lineSmooth: Chartist.Interpolation.cardinal({
      //   fillHoles: true,
      // })
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
        ...AXIS_Y_DEFAULT,
        onlyInteger: true,
        labelInterpolationFnc: function (value: any, index: number) {
          const l = series.length;
          if (index < l) {
            // Based on boolean values equals -(index + 1) in ChartistRecord
            return series[l - 1 - index].Label;
          }
        },
      },
      axisX: hideLabel ?
        {
          ...AXIS_X_DEFAULT,
          ...AXIS_X_OFF,
          divisor: this.calcDivisor()
        }
        :
        {
          ...AXIS_X_DEFAULT,
          divisor: this.calcDivisor()
        },
    } as ILineChartOptions;
  }


}