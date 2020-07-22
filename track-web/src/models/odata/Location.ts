export class Location {

  public Id: number;

  public Latitude: number;
  public Longitude: number;

  public Accuracy: number;

  constructor(latitude?: number, longitude?: number) {
    this.Latitude = latitude;
    this.Longitude = longitude;
  }
}