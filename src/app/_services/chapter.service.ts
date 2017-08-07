import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { Observable } from 'rxjs';
import { HttpHelper } from './http.helper';
import 'rxjs/add/operator/map'


import { Chapter } from '../_models/chapter.model';
import { environment } from '../../environments/environment';

const ROUTE = environment.api + '/chapters';

@Injectable()
export class ChapterService {
    constructor(
        private http: Http,
        private httpHelper: HttpHelper
    ) { }
    private options = new RequestOptions({
        headers: new Headers({
            'Authorization': 'Bearer ' 
            + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHBxLmNoIiwiaWQiOjEsImlhdCI6MTUwMjEwODE1N30.08axoRHKuQqzNIa8HGy9Rpy6hqQvg3Pyi_mH4hkBcQg';
        })
    });

    getChapters(): Observable<Chapter[]> {
        return this.http.get(ROUTE, this.options)
            .map(this.httpHelper.extractData)
            .catch(this.httpHelper.handleError);

    }
}
