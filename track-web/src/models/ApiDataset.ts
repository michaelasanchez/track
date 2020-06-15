import { ApiSeries } from "./ApiSeries";
import { filter } from "lodash";
import { SeriesType } from "../shared/enums";
import { Moment } from "moment";

export class ApiDataset {

  public Id: number;
  
  public Label: string;

  public SeriesLabels: string[];
  
  public Span: string;
  public Ticks: number;

  public NumericalSeries: ApiSeries[];
  public FrequencySeries: ApiSeries[];

}