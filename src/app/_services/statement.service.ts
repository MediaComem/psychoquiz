import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { Observable } from 'rxjs';
import { HttpHelper } from './http.helper';
import 'rxjs/add/operator/map'


import { Statement } from '../_models/statement.model';
import { environment } from '../../environments/environment';

const ROUTE = environment.api + 'statements';

@Injectable()
export class StatementService {
    constructor(
        private http: Http,
        private httpHelper: HttpHelper
    ) { }
    private options = new RequestOptions({
        headers: new Headers({
            'Authorization': 'Bearer ' + 'token' // TODO: Change
        })
    });

    getStatements(): Observable<Statement[]> {
        return this.http.get(ROUTE, this.options)
            .map(this.httpHelper.extractData)
            .catch(this.httpHelper.handleError);

    }

    addStatement(text: string, ChapterId): Observable<Statement> {
        let body = {
            text: text,
            ChapterId: ChapterId
        }
        return this.http.post(ROUTE, body, this.options)
            .map(this.httpHelper.extractData)
            .catch(this.httpHelper.handleError);
    }
}
