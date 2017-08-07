import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { Observable } from 'rxjs';
import { HttpHelper } from './http.helper';
import 'rxjs/add/operator/map'


import { Chapter } from '../_models/chapter.model';
import { environment } from '../../environments/environment';

const ROUTE = environment.api + 'chapters';

@Injectable()
export class ChapterService {
    constructor(
        private http: Http,
        private httpHelper: HttpHelper
    ) { }
    private options = new RequestOptions({
        headers: new Headers({
            'Authorization': 'Bearer ' + 'token'
        })
    });

    getChapters(): Observable<Chapter[]> {
        return this.http.get(ROUTE, this.options)
            .map(this.httpHelper.extractData)
            .catch(this.httpHelper.handleError);

    }

    addChapter(number: number, title: string, intro: string, imgUrl: string): Observable<Chapter> {
        let body = {
            title: title,
            number: number,
            intro: intro,
            imgUrl: imgUrl
        }
        return this.http.post(ROUTE, body, this.options)
            .map(this.httpHelper.extractData)
            .catch(this.httpHelper.handleError);
    }
}
