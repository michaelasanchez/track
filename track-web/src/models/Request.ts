import { Dataset } from "./Dataset";
import { Series } from "./Series";
import { Record } from "./Record";
import { Property } from "./Property";
import { Note } from "./Note";

class ApiRequest {

  private API_URL: string = 'https://localhost:44311/odata/';

  private DEF_PARAMS = {
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    // referrerPolicy: 'no-referrer', // no-referrer, *client
  };

  private entity: 'Datasets' | 'Series' | 'Records' | 'Notes' | 'Properties' | 'SeriesTypes';
  private id: number;
  private expands: string[];
  private filters: string[];

  constructor(entity: 'Datasets' | 'Series' | 'Records' | 'Notes' | 'Properties' | 'SeriesTypes', id: number = null) {
    this.entity = entity;
    if (id) this.id = id;
    this.expands = [];
    this.filters = [];
  }

  private buildUrlString(idOverride: number = null): string {
    var urlString = `${this.API_URL}${this.entity}${this.getIdArg(idOverride)}`;
    if (this.expands.length || this.filters.length)
      return `${urlString}?${this.getExpandArg()}${this.getFilterArg()}`;
    return urlString;
  }

  private getIdArg(idOverride: number = null): string {
    const id = idOverride || this.id;
    return id ? `(${id})` : '';
  }

  private getExpandArg(): string {
    return this.expands.length ? `$expand=${this.expands.join(',')}` : '';
  }

  private getFilterArg(): string { 
    return this.filters.length ? `$filter=${this.filters.join(',')}` : '';
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

  public Filter = (filter: string): ApiRequest => {
    this.filters.push(filter);
    return this;
  }

  public Expand = (expand: string) => {
    this.expands.push(expand);
    return this;
  }

  public Get = (token?: any) => {
    return this.execute(this.buildUrlString(),
    !token ? null : {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
  }

  public Post = (entity: Dataset | Record | Property | Note, token?: string) => {
    return this.execute(this.buildUrlString(),
    {
      method: 'POST',
      headers: {
        Authorization: token ? 'Bearer ' + token : null,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entity)
    } as RequestInit);
  }

  public Patch = (entity: Dataset | Series) => {
    // Entity id is used as fallback when id has been manually set
    // TODO: this is tied to caching. feels odd here
    return this.execute(this.buildUrlString(this.id || entity.Id),
      {
        ...this.DEF_PARAMS,
        method: 'PATCH',
        body: JSON.stringify(entity)
      } as RequestInit);
  }

  public Delete = (entity: Dataset) => {
    return this.execute(this.buildUrlString(this.id || entity.Id),
      {
        ...this.DEF_PARAMS,
        method: 'DELETE',
        body: JSON.stringify(entity)
      } as RequestInit,
      false);
  }
}

export default ApiRequest;