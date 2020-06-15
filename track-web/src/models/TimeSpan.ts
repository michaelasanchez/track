export class TimeSpan {
  
  public days: number;
  public hours: number;
  public minutes: number;
  public seconds: number;

  constructor(ticks: number) {
    this.seconds = Math.round(ticks / 10000000);
    this.minutes = this.seconds / 60;
    this.hours = this.minutes / 60;
    this.days = this.hours / 24;
  }
}