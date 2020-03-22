import { Dataset } from "./Dataset";
import { Series } from "./Series";

class Request {

  private API_URL: string = 'https://localhost:44311/odata/';

  private DEF_PATCH_PARAMS = {
    method: 'PATCH',
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *client
  };

  private entity: 'Datasets' | 'Series';
  private id: number;
  private expands: string[];

  private filterString: string;

  constructor(entity: 'Datasets' | 'Series', id: number = null) {
    this.entity = entity;
    if (id) this.id = id;
    this.expands = [];
    this.filterString = '';
  }

  private getUrl(idOverride: number = null): string {
    const id = idOverride || this.id;
    const idString = id ? `(${id})` : '';
    const expandString = this.expands.length ? `?$expand=${this.expands.join(',')}` : '';
    return `${this.API_URL}${this.entity}${idString}${expandString}`;
  }

  private async execute(url: string, params: RequestInit = {}, toJson: boolean = true) {
    return await fetch(url, params)
      .then(res => toJson ? res.json() : res)
      .then((result) => {
        return result;
      },
        (error) => {
          console.log('ERROR:', error);
        });
  }

  public Id = (id: number) => {
    this.id = id;
    return this;
  }

  public Filter = (filterString: string): Request => {
    this.filterString = filterString;
    return this;
  }

  public Expand = (expand: string) => {
    this.expands.push(expand);
    return this;
  }

  public Get = () => {
    return this.execute(this.getUrl());
  }

  public Patch = (entity: Dataset | Series) => {
    return this.execute(this.getUrl(this.id || entity.Id),
      {
        ...this.DEF_PATCH_PARAMS, body: JSON.stringify(entity)
      } as RequestInit);
  }
}

export default Request;