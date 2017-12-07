import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpHelper } from './http.helper';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';
import { Config } from '../_models/config.model';

const AUTHROUTE = environment.api + 'config/';

@Injectable()
export class ConfigService {
  constructor(
    private http: Http,
    private httpHelper: HttpHelper
  ) {}

  getConfig(): Observable<Config> {
    return this.http.get(AUTHROUTE)
      .map((res: Response) => this.httpHelper.extractData(res))
      .catch(this.httpHelper.handleError);
  }
}
