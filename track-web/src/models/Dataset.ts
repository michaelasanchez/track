import { Record } from './Record';
import { Series } from './Series';

export class Dataset {
  public Id: number;
  public UserId: number;
  public Private: boolean;
  public Archived: boolean;
  public Label: string;
  public Span: string;

  // TODO: Make these private
  private records: Record[];
  private series: Series[];

  constructor() {
    this.records = [];
    this.series = [];
  }

  public get Records() {
    return this.records;
  }

  public set Records(value: Record[]) {
    this.records = value;
  }

  public get Series() {
    return this.series;
  }

  public set Series(value: Series[]) {
    this.series = value;
  }
}