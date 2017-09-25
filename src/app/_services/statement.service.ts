import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { HttpHelper } from './http.helper';
import 'rxjs/add/operator/map';


import { Statement } from '../_models/statement.model';
import { environment } from '../../environments/environment';

const ROUTE = environment.api + 'statements';

@Injectable()
export class StatementService {

    private options = new RequestOptions({
        headers: new Headers({
            'Authorization': 'Bearer ' + 'token' // TODO: Change
        })
    });

    constructor(
        private http: Http,
        private httpHelper: HttpHelper
    ) { }

    getStatements(): Observable<Statement[]> {
        return this.http.get(ROUTE, this.options)
            .map(this.httpHelper.extractData)
            .catch(this.httpHelper.handleError);

    }

    getStatement(id: number): Observable<Statement> {
        return this.http.get(ROUTE + '/' + id, this.options)
            .map(this.httpHelper.extractData)
            .catch(this.httpHelper.handleError);
    }

    addStatement(text: string, ChapterId: number, profiles: any[]): Observable<Statement> {
        const body = {
            text: text,
            ChapterId: ChapterId,
            profiles: profiles
        };
        return this.http.post(ROUTE, body, this.options)
            .map(this.httpHelper.extractData)
            .catch(this.httpHelper.handleError);
    }

    editStatement(text: string, ChapterId: number, profiles: any[], id: number): Observable<Statement> {
        const body = {
            text: text,
            ChapterId: ChapterId,
            profiles: profiles
        };
        return this.http.put(ROUTE + '/' + id, body, this.options)
            .map(this.httpHelper.extractData)
            .catch(this.httpHelper.handleError);
    }

    
}
