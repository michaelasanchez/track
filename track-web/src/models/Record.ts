import { Property } from "./Property";
import { Note } from "./Note";
import { Dataset } from "./Dataset";
import { Series } from "./Series";
import { map } from "lodash";
import { Location } from './Location';

export class Record {
  public Id: number;
  public DatasetId: number; // Not sure if we need this

  public DateTime: Date;
  public Location: Location;

  // This should probably be private
  private properties: Property[];
  private notes: Note[];

  constructor(datasetId?: number, dateTime?: Date) {
    if (datasetId) this.DatasetId = datasetId;
    if (dateTime) this.DateTime = dateTime;
    this.properties = [];
    this.notes = [];
  }

  public static Default(series: Series[], location?: Location): Record {
    let record = {
      DateTime: new Date(),
      Properties: map(series, s => new Property(s.Id)),
      Notes: [],
    } as Record;
    if (location) record.Location = location;
    
    return record;
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