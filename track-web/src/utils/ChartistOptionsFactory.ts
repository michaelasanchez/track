import { AutoScaleAxis, FixedScaleAxis, IChartistFixedScaleAxis, IChartPadding, ILineChartOptions, StepAxis } from "chartist";
import ChartistTooltip from 'chartist-plugin-tooltips-updated';
import { times } from "lodash";
import moment, { Moment } from "moment";

import { ChartZoom } from "../components/Graph";
import { ApiSeries } from "../models/api/ApiSeries";
import { TimeSpan } from "./TimeSpan";
import Chartist from "chartist";

// Default css class suffixes for series (lines, points)
// TODO: figure out what happens after z
export const SERIES_PREFIXES = 'abcdefghijklmnoqrstuvwxyz';
const DEFAULT_CHARTIST_COLORS = [
  'd70206',
  'f05b4f',
  'f4c63d',
  'd17905',
  '453d3f',
  '59922b',
  '0544d3',
  '6b0392',
  'f05b4f'
];
// const TOOLTIP_DATE_FORMAT = 'MMM Do YY h:mma';
const TOOLTIP_DATE_FORMAT = 'M/D/YY h:mma';

// Axis-X Label "precision"
const DEFAULT_PRECISE = false;

// 
const FILL_HOLES = false;

export const defaultColor = (order: number) => {
  return DEFAULT_CHARTIST_COLORS[order % DEFAULT_CHARTIST_COLORS.length]
}

const DEFAULT_OPTIONS = {
  chartPadding: {
    left: -35,
    right: 5
  },
  axisY: {
    showLabel: false,
  },
  plugins: [
    ChartistTooltip({
      // tooltipFnc: (tooltipTitle: any, tooltipText: string) => tooltipTitle,
      transformTooltipTextFnc: (text: string) => {
        const [timestamp, value] = text.split(',');
        return moment(parseInt(timestamp)).format(TOOLTIP_DATE_FORMAT);
      },
      appendToBody: true,
      anchorToPoint: true
    }),
  ]
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
    showLabel: false,
  },
  axisY: {
    showGrid: false,
    labelOffset: {
      y: 5  // vertically center y-axis labels
    }
  }
} as ILineChartOptions;

const calcChartWidth = (span: TimeSpan, refWidth: number, zoom: ChartZoom): number => {
  let chartWidth = getTimeSpanValue(span, zoom) * 100; // px
  return chartWidth < refWidth ? refWidth : chartWidth;
}

const getTimeSpanValue = (span: TimeSpan, zoom: ChartZoom): number => {
  switch (zoom) {
    case ChartZoom.Month:
      return span.months;
    case ChartZoom.Day:
      return span.days;
    case ChartZoom.Hour:
      return span.hours;
    case ChartZoom.Minute:
      return span.minutes;
  }
}

// Axis-X labels
const getDateFormat = (zoom: ChartZoom, precise: boolean = DEFAULT_PRECISE) => {
  switch (zoom) {
    case ChartZoom.Month:
      return precise ? 'MMM D h:mma' : 'MMM';
    case ChartZoom.Day:
      return precise ? 'MMM D h:mma' : 'MMM D';
    case ChartZoom.Hour:
      return precise ? 'MMM D h:mm:ssa' : 'MMM D h:mm:a';
    case ChartZoom.Minute:
      return precise ? 'h:mm:ss a' : 'h:mma';
  }
}

// TODO: Not sure if this makes sense as a class?
export class ChartistOptionsFactory {
  private _zoom: ChartZoom;

  private _width: number;
  private _divisor: number;
  private _dateFormat: string;

  /* Constructor */
  constructor(span: TimeSpan, refWidth: number, zoom: ChartZoom) {
    this._zoom = zoom;

    // When zoom is set to day, divisor is equal to number of day, rounded.
    // Add 1 for padding and keeping dates rounded
    this._divisor = Math.max(Math.floor(getTimeSpanValue(span, zoom)) + 2, 2);

    this._width = calcChartWidth(span, refWidth, zoom);
    this._dateFormat = getDateFormat(zoom);
  }

  private convertSpanSeriesToTicks = (series: any) => {
    const ticks: Date[] = [];

    times(this._divisor, (n: number) => {
      // TODO: "span" series should probably be an actual member
      const clone = series[0].x.clone();
      ticks.push(clone.add(n, this._zoom).toDate());
    });

    return ticks;
  }

  /* Default */
  public static getDefaultOptions = (): ILineChartOptions => {
    return {
      ...DEFAULT_OPTIONS
    } as ILineChartOptions;
  }

  /* Chart Labels */
  public getNumericalLabelOptions = (): ILineChartOptions => {
    return {
      ...AXIS_Y_DEFAULT,
      height: 300
    } as ILineChartOptions;
  }

  public getFrequencyLabelOptions = (series: ApiSeries[]): ILineChartOptions => {
    return {
      ...AXIS_Y_DEFAULT,
      height: series.length * 40,
      axisY: {
        ...(AXIS_Y_DEFAULT.axisY),
        onlyInteger: true,
        divisor: 2,
        labelInterpolationFnc: function (value: any, index: number) {
          const l = series.length;
          if (index < l) {
            // Based on boolean values equals -(index + 1) in ChartistRecord
            // console.log('doog', index, value, series[index].Label)
            return series[l - 1 - index].Label;
          }
        },
      },
    } as ILineChartOptions;
  }

  /* Chart */
  public getNumericalChartOptions = (series: any, hasFrequencyData: boolean = false): ILineChartOptions => {
    const spanSeries = series[series.length - 1];

    return {
      ...DEFAULT_OPTIONS,
      ...NUMERICAL_OPTIONS,
      height: 300,
      width: this._width,
      axisX: {
        ...AXIS_X_DEFAULT,
        divisor: this._divisor,
        ticks: this.convertSpanSeriesToTicks(spanSeries),
        labelOffset: {
          y: hasFrequencyData ? 12.5 : AXIS_X_DEFAULT.labelOffset.y
        },
        labelInterpolationFnc: (dateString: string) => moment(dateString).format(this._dateFormat),
      },
    } as ILineChartOptions;
  }

  public getFrequencyChartOptions = (series: any, hideLabels: boolean = false): ILineChartOptions => {
    const spanSeries = series[series.length - 1];

    return {
      ...DEFAULT_OPTIONS,
      ...FREQUENCY_OPTIONS,
      height: (series.length - 1) * 40, // Graph height = (# of series) x 40px
      width: this._width,
      axisX: {
        ...AXIS_X_DEFAULT,
        divisor: this._divisor,
        ticks: this.convertSpanSeriesToTicks(spanSeries),
        labelInterpolationFnc: (dateString: string) => moment(dateString).format(this._dateFormat),
        showLabel: !hideLabels,
        labelOffset: {
          y: 10,
        }
      },
      chartPadding: {
        ...(DEFAULT_OPTIONS.chartPadding),
        bottom: hideLabels ? 0 : 10
      }
    } as ILineChartOptions;
  }


}