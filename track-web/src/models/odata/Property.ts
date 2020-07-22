export class Property {
  public Id: number;
  public RecordId: number;
  public SeriesId: number;
  public Label: string;
  public Value: string;

  constructor(seriesId: number, value?: string) {
    this.SeriesId = seriesId;
    if (!!value) this.Value = value;
  }
}