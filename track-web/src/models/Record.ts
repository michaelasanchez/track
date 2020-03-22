import { Property } from "./Property";
import { Note } from "./Note";

export class Record {
  public Id: number;
  public DatasetId: number; // Not sure if we need this
  public DateTime: Date;


  // This should probably be private
  private properties: Property[];
  private notes: Note[];

  constructor(datasetId: number, dateTime: Date = null) {
    this.DatasetId = datasetId;
    if (dateTime) this.DateTime = dateTime;
    this.properties = [];
    this.notes = [];
  }

  public get Properties() {
    return this.properties;
  }

  public set Properties(value: Property[]) {
    this.properties = value;
  }

  public get Notes() {
    return this.notes;
  }

  public set Notes(value: Note[]) {
    this.notes = value;
  }
}