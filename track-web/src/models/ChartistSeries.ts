import { Series } from "./Series";
import { SeriesType } from "../shared/enums";

export enum GraphFormat {
  Numerical = 1,
  Frequency = 2
}

export class ChartistSeries {

  private _series: Series;

  private _graphType: GraphFormat;

  public constructor(series: Series) {
    this._series = series;

    this._graphType = this._series.TypeId == SeriesType.Boolean ?
      GraphFormat.Frequency
      :
      GraphFormat.Numerical;
  }

  public get Id(): number {
    return this._series.Id;
  }

  public get Label(): string {
    return this._series.Label
  }

  public get GraphFormat(): GraphFormat {
    return this._graphType;
  }

  public get SeriesType(): SeriesType {
    return this._series.TypeId;
  }

  public get Color(): string {
    return this._series.Color;
  }

  public get Order(): number {
    return this._series.Order;
  }
}