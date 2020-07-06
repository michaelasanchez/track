import { ApiSeries } from "./ApiSeries";
import { map } from "lodash";
import ChartistRecord from "./ChartistRecord";

export class ChartistData {
  private _labels: string[];
  private _series: any[];

  constructor(labels: string[], series: ApiSeries[]) {
    this._labels = labels;

    // Create an array of "series"
    // Each "series" is an array of ChartistRecords
    this._series = map(series, (s: ApiSeries, i: number) => {
      return map(s.Data, (value: string, j: number) => ChartistRecord(s, this._labels[j], value, i));
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