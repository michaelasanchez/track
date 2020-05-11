export class Property {
  public Id: number;
  public RecordId: number;
  public SeriesId: number;
  public Label: string;
  public Value: string;

  constructor(seriesId: number, value: string = null) {
    this.SeriesId = seriesId;
    if (value != null) this.Value = value;
  }
}