export class Note {

  public Id: number;
  public RecordId: number;
  public Text: string;

  constructor(text: string = null) {
    if (text) this.Text = text;
  }
  
}