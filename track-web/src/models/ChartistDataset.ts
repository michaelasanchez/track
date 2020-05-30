import { times, map, each, filter } from 'lodash';
import moment, { Moment } from 'moment';
import { Dataset as ApiDataset } from './Dataset';
import { Record } from './Record';
import { Series } from './Series';
import { SeriesType } from '../shared/enums';
import { ChartistSeries, GraphFormat } from './ChartistSeries';

export class ChartistDataset {

  // TODO: Dataset should be renamed to ApiDataset
  private _dataset: ApiDataset;

  private _series: ChartistSeries[];

  private _idToIndex: number[];


  // Graph Data
  private _seriesLabels: string[];
  private _seriesData: any;

  // Graph Type
  private _lineData: any = [];
  private _frequencyData: any = [];

  public constructor(apiDataset: ApiDataset) {
    this._dataset = apiDataset;
    this._series = map(this._dataset.Series, s => new ChartistSeries(s));
    
    // TODO: Get rid of all of this.
    // This should be done with ChartistSeries
    this._idToIndex = [];
    each(apiDataset.Series, (s: Series, index: number) => {
      this._idToIndex[s.Id] = index;
    });

    this._seriesLabels = map(apiDataset.Records, r => r.DateTime.toString());
    this._seriesData = this.generateData(this._dataset);

    each(apiDataset.Series, (s: Series, i: number) => {
      const index = this._idToIndex[s.Id];
      if (s.TypeId == SeriesType.Boolean) {
        this._frequencyData.push(this._seriesData[index]);
      } else {
        this._lineData.push(this._seriesData[index]);
      }
    });
  }

  private generateData = (dataset: ApiDataset) => {
    let series: any = [];
    times(dataset.Series.length, _ => series.push([]));

    map(dataset.Records, (r: Record, j: number) => {

      each(r.Properties, (p, i) => {
        const index = this._idToIndex[p.SeriesId];

        let value;
        switch (dataset.Series[index].TypeId) {
          case SeriesType.Decimal:
            value = Number.parseFloat(p.Value);
            break;
          case SeriesType.Integer:
            value = Number.parseInt(p.Value);
            break;
          case SeriesType.Boolean:
            // Display series top-down
            // TODO: Find a better way to do this
            value = -index;
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

  public HasNumericalData = (): boolean => {
    return this._lineData.length ? true : false;
  }

  public get NumericalSeries(): any {
    return filter(this._series, s => s.GraphFormat == GraphFormat.Numerical);
  }

  public get NumericalData(): any {
    return {
      labels: this._seriesLabels,
      series: this._lineData,
    }
  }

  public HasFrequencyData = (): boolean => {
    return this._frequencyData.length ? true : false;
  }

  public get FrequencySeries(): ChartistSeries[] {
    return filter(this._series, s => s.GraphFormat == GraphFormat.Frequency);
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