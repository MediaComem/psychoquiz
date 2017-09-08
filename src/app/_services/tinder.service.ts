import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { Observable } from 'rxjs';
import { HttpHelper } from './http.helper';
import 'rxjs/add/operator/map'


import { Statement } from '../_models/statement.model';
import { Chapter } from '../_models/chapter.model';

import { environment } from '../../environments/environment';

const ROUTE  = environment.api + 'answers'
@Injectable()
export class TinderService {



    constructor(
        private http: Http,
        private httpHelper: HttpHelper
    ) { }


    postAnswer(answer:boolean, stid: number): Observable<any> {
        let body = {answer:answer, StatementId: stid};
        let ptok = localStorage.getItem('participation');

        return this.http.post(ROUTE + '?pt=' + ptok, body, new RequestOptions())
            .map(this.httpHelper.extractData)
            .catch(this.httpHelper.handleError);

    }

}
