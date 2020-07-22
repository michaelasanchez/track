import { ApiSeries } from './ApiSeries';

export class ApiDataset {

  public Id: number;
  
  public Label: string;

  public SeriesLabels: string[];
  
  public Span: string;
  public Ticks: number;

  public NumericalSeries: ApiSeries[];
  public FrequencySeries: ApiSeries[];

}