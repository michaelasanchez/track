export class Note {

  public Id: number;
  public RecordId: number;
  public Text: string;

  constructor(recordId?: number, text?: string) {
    if (text) this.Text = text;
  }
  
}