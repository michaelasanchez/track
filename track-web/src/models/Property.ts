export class Property {
  public Id: number;
  public RecordId: number;
  public SeriesId: number;
  Value: string;

  constructor(seriesId: number, value: string = null) {
    this.SeriesId = seriesId;
    if (value) this.Value = value;
  }
}