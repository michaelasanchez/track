import { Dataset } from "./Dataset";
import { Series } from "./Series";
import { Record } from "./Record";

import { DOMAIN } from "../config";

class ApiRequest {

  private ODATA_URL: string = `${DOMAIN}odata/`;
  protected API_URL: string = `${DOMAIN}api/`;

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

  private id: number;
  private _url: 'ApiDatasets' | 'Datasets' | 'Series' | 'Records';
  private _token: string;

  private expands: string[];
  private filters: string[];

  constructor(url?: 'ApiDatasets' | 'Datasets' | 'Series' | 'Records', token?: string) {
    this._url = url;
    this._token = token;

    this.expands = [];
    this.filters = [];
  }

  private buildApiUrlString(idOverride: number = null): string {

    // {API_PATH} / {ENTITY_TYPE} / {ID}
    return `${this.API_URL}${this._url}/${idOverride || this.id}`;
  }

  private buildOdataUrlString(idOverride: number = null): string {

    //
    var urlString = `${this.ODATA_URL}${this._url}${this.getIdArg(idOverride)}`;
    if (this.expands.length || this.filters.length)
      return `${urlString}?${this.getExpandArg()}${this.getFilterArg()}`;
    return urlString;
  }

  private buildAuthHeader = (token: string) => {
    return {
      Authorization: `Bearer ${token}`
    };
  }

  // TODO: Currently only works for odata endpoints
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
      .then(result => (result.ok && result.status != 204 && toJson) ? result.json() : result);
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

  // GET ApiDataset
  public GetApiDataset = () => {
    const params = !this._token ? null : {
      headers: this.buildAuthHeader(this._token)
    };
    return this.execute(this.buildApiUrlString(), params);
  }
  
  // DELETE ApiDataset
  public ArchiveDataset = (idOverride: number) => {
    const params = !this._token ? null : {
      headers: {
        ...(this.buildAuthHeader(this._token))
      }
    };
    return this.execute(this.buildApiUrlString(idOverride), params);
  }

  public Get = () => {
    const params = !this._token ? null : {
      headers: this.buildAuthHeader(this._token)
    };
    return this.execute(this.buildOdataUrlString(), params);
  }

  public Post = (entity: Dataset | Series | Record) => {
    return this.execute(this.buildOdataUrlString(),
    {
      method: 'POST',
      headers: {
        Authorization: this._token ? 'Bearer ' + this._token : null,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entity)
    } as RequestInit);
  }

  public Put = (entity: Dataset | Series) => {
    return this.execute(this.buildOdataUrlString(entity?.Id), {
      method: 'PUT',
      headers: {
        Authorization: this._token ? 'Bearer ' + this._token : null,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entity)
    } as RequestInit);
  }

  public Patch = (entity: Dataset | Series) => {
    // Entity id is used as fallback when id has been manually set
    // TODO: this is tied to caching. feels odd here
    return this.execute(this.buildOdataUrlString(this.id || entity.Id),
      {
        ...this.DEF_PARAMS,
        method: 'PATCH',
        body: JSON.stringify(entity)
      } as RequestInit);
  }

  public Delete = (entity: Dataset) => {
    return this.execute(this.buildOdataUrlString(this.id || entity.Id),
      {
        ...this.DEF_PARAMS,
        method: 'DELETE',
        body: JSON.stringify(entity)
      } as RequestInit,
      false);
  }
}

export default ApiRequest;