import { Property } from "./Property";

export class Record {
  public Id: number;
  public DatasetId: number; // Not sure if we need this
  public DateTime: Date;

  // This should probably be private
  private properties: Property[];

  public get Properties() {
    return this.properties;
  }

  public set Properties(value: Property[]) {
    this.properties = value;
  }
}