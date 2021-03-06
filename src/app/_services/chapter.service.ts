import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Angulartics2 } from 'angulartics2';

import { Observable } from 'rxjs';
import { HttpHelper } from './http.helper';
import 'rxjs/add/operator/map'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import 'rxjs/add/operator/toPromise';

import { Chapter } from '../_models/chapter.model';
import { environment } from '../../environments/environment';

const ROUTE = environment.api + 'chapters';



@Injectable()
export class ChapterService {


    private _chapterSource = new BehaviorSubject<Chapter>(new Chapter());
    currentChapter = this._chapterSource.asObservable();

    private options = new RequestOptions({
        headers: new Headers({
            'Authorization': 'Bearer ' + 'token' // TODO: Change
        })
    });
    constructor(
        private http: Http,
        private httpHelper: HttpHelper,
        private angulartics2: Angulartics2        
    ) { }


    getRandomChapter(token: string): Observable<Chapter> {
        return this.http.get(ROUTE + '/random?pt=' + token + '&ts=' + new Date().getTime())
            .map(res => {
                if (res.json().status == 'success') {
                    // Set current chapter as observable
                    let data = res.json().data;

                    this.angulartics2.eventTrack.next({
                        action: 'Situation au hasard: ' + data.number + ' - ' + data.intro,
                        properties: {
                            category: 'Situation'
                        }
                    });



                    
                    this._chapterSource.next(data);
                    return data || {};
                }
                throw new Error(res.json().message || 'Error with API');
            })
            .catch(this.httpHelper.handleError);
    }

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

    

    editChapter(id: number, body: Chapter): Observable<Chapter> {
        return this.http.put(ROUTE + '/' + id, body, this.options)
            .map(this.httpHelper.extractData)
            .catch(this.httpHelper.handleError);
    }
}
