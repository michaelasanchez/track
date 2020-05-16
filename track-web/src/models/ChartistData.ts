import { times, map, each } from 'lodash';
import moment, { Moment } from 'moment';
import { Dataset } from './Dataset';
import { Series } from './Series';

export class ChartistData {

  private _dataset: Dataset;

  private _updated: boolean = false;
  private _lineData: any;

  public labels: any[];
  public seriesIds: any;
  public series: [ChartistSeriesData[]];

  public constructor(dataset: Dataset) {
    this.seriesIds = [];
    each(dataset.Series, (s: Series, i: number) => {
      this.seriesIds[i] = s.Id;
    });
    
    this._dataset = dataset;
    this._lineData = this.generateLineData(this._dataset);
  }

  private generateLineData = (dataset: Dataset) => {
    var labels: string[] = [];
    var series: any = [];
    times(dataset.Series.length, _ => series.push([]));

    map(dataset.Records, r => {
      labels.push(r.DateTime.toString());

      each(r.Properties, (p, i) => {
        // TODO: Improve this
        series[this.seriesIds.findIndex((z: any) => z == p.SeriesId)].push({
          x: moment(r.DateTime),
          y: Number.parseFloat(p.Value),
        });

      });

      // Fill missing data
      each(series, (s: any, i: number) => {
        if (s.length < labels.length)
          s.push(null);
      })
    });

    return {
      labels,
      series,
    }
  }

  public get LineData(): any {
    return this._lineData;
  }
}

export class ChartistSeriesData {
  public x: Moment;
  public y: number;
}