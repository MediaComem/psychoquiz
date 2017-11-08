import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Angulartics2 } from 'angulartics2';

import { Observable } from 'rxjs';
import { HttpHelper } from './http.helper';
import 'rxjs/add/operator/map'


import { Statement } from '../_models/statement.model';
import { Chapter } from '../_models/chapter.model';

import { environment } from '../../environments/environment';

const ROUTE = environment.api + 'answers'
@Injectable()
export class TinderService {



    constructor(
        private http: Http,
        private httpHelper: HttpHelper,
        private angulartics2: Angulartics2
        
    ) { }


    postAnswer(answer: boolean, stid: number): Observable<any> {
        this.angulartics2.eventTrack.next({
            action: 'Swipe enregistré (' + answer + ')',
            properties: {
                category: 'Tinder'
            }
        });
        const body = { answer: answer, StatementId: stid };
        const ptok = localStorage.getItem('participation');

        return this.http.post(ROUTE + '?pt=' + ptok, body, new RequestOptions())
            .map(this.httpHelper.extractData)
            .catch(this.httpHelper.handleError);

    }

}
