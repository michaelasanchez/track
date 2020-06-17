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
  }
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
    case ChartZoom.Hour:
      return Math.round(span.hours);
    case ChartZoom.Minute:
      return Math.round(span.minutes);
  }
}

const calcChartWidth = (span: TimeSpan, refWidth: number, zoom: ChartZoom): number => {

  let chartWidth;
  switch (zoom) {
    case ChartZoom.Month:
      chartWidth = span.months * 100;
      break;
    case ChartZoom.Day:
      chartWidth = span.days * 100;
      break;
    case ChartZoom.Hour:
      chartWidth = span.hours * 100;
      break;
    case ChartZoom.Minute:
      chartWidth = span.minutes * 100;
      break;
  }

  // const zoomFill = refWidth / chartWidth;
  // return chartWidth < refWidth ? chartWidth * zoomFill : chartWidth;

  return chartWidth < refWidth ? refWidth : chartWidth;
}

const getDateFormat = (zoom: ChartZoom) => {
  switch (zoom) {
    case ChartZoom.Month:
      return 'MMM \'YY'
    case ChartZoom.Day:
      return 'MMM D'
    case ChartZoom.Hour:
      return 'MMM D h:mma'
    case ChartZoom.Minute:
      return 'h:mma'
  }
}

// TODO: Not sure if this makes sense as a class?
export class ChartistOptionsFactory {

  private _zoomMode: ChartZoom;

  private _width: number;
  private _divisor: number;
  private _dateFormat: string;

  constructor(span: TimeSpan, refWidth: number, zoom: ChartZoom) {
    this._zoomMode = zoom;

    // console.log('SPAN', span)
    // console.log('ZOOM', ChartZoom[zoom])

    this._width = calcChartWidth(span, refWidth, zoom);
    this._divisor = calcDivisor(span, zoom);
    this._dateFormat = getDateFormat(zoom);
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
        },
        labelInterpolationFnc: (value: any, i: number) => {
          return moment(value).format(this._dateFormat)
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
        showLabel: !hideLabels,
        labelInterpolationFnc: (value: any, i: number) => {
          return moment(value).format(this._dateFormat)
        }
      },
      chartPadding: {
        ...(DEFAULT_CHART_OPTIONS.chartPadding),
        bottom: hideLabels ? 0 : 10
      }
    } as ILineChartOptions;
  }


}