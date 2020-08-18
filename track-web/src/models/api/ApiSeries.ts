import { SeriesType } from '../../shared/enums';

export class ApiSeries {

  public Id: number;
  
  public Label: string;
  public Color: string;

  public SeriesType: SeriesType;

  public Order: number;
  
  public Data: string[];

  public Min: string;
  public Max: string;
  
}