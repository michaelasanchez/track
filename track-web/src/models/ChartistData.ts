import { times } from 'lodash';

export class ChartistData {

  public labels: any[];
  public series: [ChartistSeriesData[]];

  public constructor(numSeries: number = 1) {
    var tempSeries: any = [];
    times(numSeries, _ => tempSeries.push([]));
    this.series = tempSeries;
  }
}

export class ChartistSeriesData {
  public x: number | Date;
  public y: number;
}