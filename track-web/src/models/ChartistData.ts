import { times, map, each, filter } from 'lodash';
import moment, { Moment } from 'moment';
import { Dataset } from './Dataset';
import { Record } from './Record';
import { Series } from './Series';
import { SeriesType } from '../shared/enums';

export class ChartistData {

  private _dataset: Dataset;

  private _seriesIndex: number[];
  private _seriesLabels: string[];
  private _seriesData: any;

  private _lineData: any;
  private _frequencyData: any;

  public constructor(dataset: Dataset) {
    this._dataset = dataset;
    
    this._seriesIndex = [];
    each(dataset.Series, (s: Series, i: number) => {
      this._seriesIndex[s.Id] = i;
    });

    this._seriesLabels = map(dataset.Records, r => r.DateTime.toString());
    this._seriesData = this.generateData(this._dataset);

    this._lineData = [];
    this._frequencyData = [];
    each(dataset.Series, (s: Series, i: number) => {
      const index = this._seriesIndex[s.Id];
      if (s.TypeId == SeriesType.Boolean) {
        this._frequencyData.push(this._seriesData[index]);
      } else {
        this._lineData.push(this._seriesData[index]);
      }
    });
  } 

  private generateData = (dataset: Dataset) => {
    let series: any = [];
    times(dataset.Series.length, _ => series.push([]));

    map(dataset.Records, (r: Record, j: number) => {

      each(r.Properties, (p, i) => {
        const index = this._seriesIndex[p.SeriesId];

        let value;
        switch (dataset.Series[index].TypeId) {
          case SeriesType.Decimal:
            value = Number.parseFloat(p.Value);
            break;
          case SeriesType.Integer:
            value = Number.parseInt(p.Value);
            break;
          case SeriesType.Boolean:
            value = index;
            break;
          default:
            value = null;
        }

        let data = {
          x: moment(r.DateTime),
          y: value,
        }
        series[index].push(data);
      });

      // Fill missing data
      each(series, s => {
        if (s.length < j + 1)
          s.push(null);
      })
    });

    return series;
  }

  public HasLineData = (): boolean => {
    return this._lineData.length ? true : false;
  }

  public get LineData(): any {
    return {
      labels: this._seriesLabels,
      series: this._lineData,
    }
  }

  public HasFrequencyData = (): boolean => {
    return this._frequencyData.length ? true : false;
  }

  public get FrequencyData(): any {
    return {
      labels: this._seriesLabels,
      series: this._frequencyData,
    }
  }

}

export class ChartistSeriesData {
  public x: Moment;
  public y: number;
}