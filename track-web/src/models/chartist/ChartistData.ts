import { map, each } from 'lodash';

import { ApiSeries } from '../api/ApiSeries';
import ChartistRecord from './ChartistRecord';
import moment from 'moment';
import { ApiDataset } from '../api';
import { ChartistSeries } from './ChartistSeries';

export enum ChartistDataType {
  Numerical = 'numerical',
  Frequency = 'frequency',
}

export class ChartistData {

  public series: any;

  public min: number;
  public max: number;

  constructor(dataset: ApiDataset, dataType: ChartistDataType) {

    const ids = dataset.SeriesIds;
    const labels = dataset.SeriesLabels;
    const series = dataType == ChartistDataType.Numerical ? dataset.NumericalSeries : dataset.FrequencySeries;

    // Create an array of "series"
    // Each "series" is an array of ChartistRecords
    this.series = map(series, (s: ApiSeries, i: number) => {
      if (!this.min || (s.Min && parseFloat(s.Min) < this.min)) {
        this.min = parseFloat(s.Min);
      }
      if (!this.max || parseFloat(s.Max) > this.max) {
        this.max = parseFloat(s.Max);
      }
      return map(s.Data, (value: string, j: number) => new ChartistRecord(s, ids[i], labels[j], value, i));
    })
  }
}