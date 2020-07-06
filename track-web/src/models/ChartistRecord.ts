import moment from "moment";
import { SeriesType } from "../shared/enums";
import { ApiSeries } from "./ApiSeries";

const ChartistRecord = (series: ApiSeries, dateTimeString: string, value?: string, index?: number) => {
  let parsed;
  switch (series.SeriesType) {
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
    meta: series.Label,
    x: moment(dateTimeString),
    y: parsed
  };
}

export default ChartistRecord;