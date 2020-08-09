import { map, each } from 'lodash';

import { ApiSeries } from '../api/ApiSeries';
import ChartistRecord from './ChartistRecord';
import moment from 'moment';
import { ApiDataset } from '../api';

export enum ChartistDataType {
  Numerical = 'numerical',
  Frequency = 'frequency',
}

export class ChartistData {

  public series: any[];

  constructor(dataset: ApiDataset, dataType: ChartistDataType) {

    const ids = dataset.SeriesIds;
    const labels = dataset.SeriesLabels;
    const series = dataType == ChartistDataType.Numerical ? dataset.NumericalSeries : dataset.FrequencySeries;

    // Create an array of "series"
    // Each "series" is an array of ChartistRecords
    this.series = map(series, (s: ApiSeries, i: number) => {
      return map(s.Data, (value: string, j: number) => ChartistRecord(s, ids[i], labels[j], value, i));
    })
  }
}