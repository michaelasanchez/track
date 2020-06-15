import { ILineChartOptions, FixedScaleAxis, AutoScaleAxis, StepAxis, IChartistFixedScaleAxis, IChartPadding } from "chartist";
import moment from "moment";
import { ApiSeries } from "./ApiSeries";
import { ChartZoom } from "../components/Graph";
import { TimeSpan } from "./TimeSpan";

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

const DEFAULT_CHART_OPTIONS = {
  chartPadding: {
    left: -35,
    right: 5
  },
  axisY: {
    showLabel: false,
  }
} as ILineChartOptions;

const NUMERICAL_OPTIONS = {
  classNames: {
    chart: 'ct-chart-line numerical'
  }
}

const FREQUENCY_OPTIONS = {
  showLine: false,
  classNames: {
    chart: 'ct-chart-line frequency'
  }
}

const AXIS_X_DEFAULT = {
  type: FixedScaleAxis,
  labelOffset: {
    y: 5
  },
  labelInterpolationFnc: function (value: any) {
    const timeFormat = 'h:mma';
    const dateFormat = 'MMM D';
    return moment(value).format(`${dateFormat}`);
    return moment(value).format(`${dateFormat} ${timeFormat}`);
  },
} as IChartistFixedScaleAxis;


const AXIS_Y_DEFAULT = {
  showLine: false,
  showPoint: false,
  axisX: {
    showGrid: false,
    showLabel: false
  },
  axisY: {
    showGrid: false,
    labelOffset: {
      y: 5  // vertically center y-axis labels
    }
  }
} as ILineChartOptions;

const calcDivisor = (span: TimeSpan, zoom: ChartZoom): number => {
  switch (zoom) {
    case ChartZoom.Day:
      return Math.round(span.days);
    case ChartZoom.Month:
      return Math.round(span.days / 30);
  }
}

const calcChartWidth = (span: TimeSpan, refWidth: number, zoom: ChartZoom): number => {

  let chartWidth;
  switch (zoom) {
    case ChartZoom.Day:
      chartWidth = span.days * 100;
      break;
    case ChartZoom.Month:
      chartWidth = (span.days / 30) * 100;
      break;
  }

  // const zoomFill = refWidth / chartWidth;
  // return chartWidth < refWidth ? chartWidth * zoomFill : chartWidth;

  return chartWidth < refWidth ? refWidth : chartWidth;
}

// TODO: Not sure if this makes sense as a class?
export class ChartistOptionsFactory {

  private _width: number;
  private _divisor: number;

  constructor(span: TimeSpan, refWidth: number, zoom: ChartZoom) {
    this._width = calcChartWidth(span, refWidth, zoom);
    this._divisor = calcDivisor(span, zoom);
  }

  public getNumericalLabelOptions = (): ILineChartOptions => {
    return {
      ...AXIS_Y_DEFAULT,
      height: 300
    } as ILineChartOptions;
  }

  public getNumericalChartOptions = (hasFrequencyData: boolean = false): ILineChartOptions => {
    return {
      ...DEFAULT_CHART_OPTIONS,
      ...NUMERICAL_OPTIONS,
      height: 300,
      width: this._width,
      axisX: {
        ...AXIS_X_DEFAULT,
        divisor: this._divisor,
        labelOffset: {
          y: hasFrequencyData ? 12.5 : AXIS_X_DEFAULT.labelOffset.y
        }
      }
    } as ILineChartOptions;
  }

  public getFrequencyLabelOptions = (series: ApiSeries[]): ILineChartOptions => {
    return {
      ...AXIS_Y_DEFAULT,
      height: series.length * 40,
      axisY: {
        ...(AXIS_Y_DEFAULT.axisY),
        onlyInteger: true,
        labelInterpolationFnc: function (value: any, index: number) {
          const l = series.length;
          if (index < l) {
            // Based on boolean values equals -(index + 1) in ChartistRecord
            return series[l - 1 - index].Label;
          }
        },
      },
    } as ILineChartOptions;
  }

  public getFrequencyChartOptions = (series: ApiSeries[], hideLabels: boolean = false): ILineChartOptions => {
    return {
      ...DEFAULT_CHART_OPTIONS,
      ...FREQUENCY_OPTIONS,
      height: series.length * 40,
      width: this._width,
      axisX: {
        ...AXIS_X_DEFAULT,
        divisor: this._divisor,
        showLabel: !hideLabels
      },
      chartPadding: {
        ...(DEFAULT_CHART_OPTIONS.chartPadding),
        bottom: hideLabels ? 0 : 10
      }
    } as ILineChartOptions;
  }


}