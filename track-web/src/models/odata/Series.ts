export class Series {

  public Id: number;
  public DatasetId: number

  public TypeId: number;
  public Label: string;
  public Color: string;

  public Order: number;
  public Visible: boolean;

  public static Default = (id: number = 0): Series => {
    return {
      Id: id,
      Label: '',
      TypeId: 2,  // Decimal
      Visible: true,
      Order: id
    } as Series;
  }
}