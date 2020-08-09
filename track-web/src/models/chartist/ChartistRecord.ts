import moment from 'moment';

import { SeriesType } from '../../shared/enums';
import { ApiSeries } from '../api/ApiSeries';

export interface IChartistRecord {
  meta?: string;
  x: any;
  y: any;
}

// TODO: Relocate this?
const getRecordTooltip = (id: number, label: string, value: string) => `Id: ${id} ${label}: ${value}`;

// TODO: Does this need to be a class?
const ChartistRecord = (series: ApiSeries, id: number, timestamp: string, value?: string, index?: number): IChartistRecord => {
  
  let parsedValue;
  switch (series.SeriesType) {
    case SeriesType.Decimal:
      parsedValue = Number.parseFloat(value);
      break;
    case SeriesType.Integer:
      parsedValue = Number.parseInt(value);
      break;
    case SeriesType.Boolean:
      // Descending order for chart
      parsedValue = value === 'true' ? -(index + 1) : null;
      break;
    default:
      parsedValue = null;
      break;
  }

  return !parsedValue ? null : {
    meta: getRecordTooltip(id, series.Label, value),
    x: moment(timestamp),
    y: parsedValue
  };
}

export default ChartistRecord;