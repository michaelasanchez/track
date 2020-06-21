import { ApiSeries } from "./ApiSeries";
import { map } from "lodash";
import moment from "moment";
import { SeriesType } from "../shared/enums";

export class ChartistData {
  private _labels: string[];
  private _series: any[];

  constructor(labels: string[], series: ApiSeries[]) {
    this._labels = labels;

    // Create an array of "series"
    // Each "series" is an array of ChartistRecords
    this._series = map(series, (s: ApiSeries, i: number) => {
      return map(s.Data, (value: string, j: number) => ChartistRecord(s.SeriesType, this._labels[j], value, i));
    })
  }

  public get labels() {
    return this._labels;
  }

  public set labels(value: string[]) {
    this._labels = value;
  }

  public get series() {
    return this._series;
  }

  public set series(value: any[]) {
    this._series = value;
  }
}

const ChartistRecord = (type: SeriesType, dateTimeString: string, value?: string, index?: number) => {
  let parsed;
  switch (type) {
    case SeriesType.Decimal:
      parsed = Number.parseFloat(value);
      break;
    case SeriesType.Integer:
      parsed = Number.parseInt(value);
      break;
    case SeriesType.Boolean:
      // Keep series in desc order on chart
      parsed = value === 'true' ? -(index + 1) : null;
      break;
    default:
      parsed = null;
      break;
  }

  return !parsed ? null : {
    x: moment(dateTimeString),
    y: parsed
  };
}