import moment from "moment";
import { SeriesType } from "../shared/enums";
import { ApiSeries } from "./ApiSeries";

// TODO: Does this need to be a class?
const ChartistRecord = (series: ApiSeries, timestamp: string, value?: string, index?: number) => {
  let parsed;
  switch (series.SeriesType) {
    case SeriesType.Decimal:
      parsed = Number.parseFloat(value);
      break;
    case SeriesType.Integer:
      parsed = Number.parseInt(value);
      break;
    case SeriesType.Boolean:
      // Descending order for chart
      parsed = value === 'true' ? -(index + 1) : null;
      break;
    default:
      parsed = null;
      break;
  }

  return !parsed ? null : {
    meta: `${series.Label} - ${value}`,
    x: moment(timestamp),
    y: parsed
  };
}

export default ChartistRecord;