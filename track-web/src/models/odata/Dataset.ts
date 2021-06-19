import { Record } from './Record';
import { Series } from './Series';
import { Category } from '.';

export class Dataset {
  public Id: number;
  public UserId: number;
  public Private: boolean;
  public Archived: boolean;
  public Label: string;

  public CategoryId?: number;
  public Category: Category;

  public Span: string;

  private records: Record[];
  private series: Series[];

  constructor(userId?: number) {
    this.UserId = userId;
    this.Private = true;

    this.Label = '';
    this.records = [];
    this.series = [];

    this.series.push(Series.Default());
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