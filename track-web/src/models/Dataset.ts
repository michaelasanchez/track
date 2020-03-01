import { Record } from './Record';
import { Series } from './Series';

export class Dataset {
  public Id: number;
  public UserId: number;
  public Archived: boolean;
  public Label: string;
  public Span: string;

  // TODO: Make these private
  private records: Record[];
  public Series: Series[];

  public get Records() {
    return this.records;
  }

  public set Records(value: Record[]) {
    this.records = value;
  }
}