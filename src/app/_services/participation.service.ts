import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Angulartics2 } from 'angulartics2';

import { Observable } from 'rxjs';
import { HttpHelper } from './http.helper';
import 'rxjs/add/operator/map'


import { Participation } from '../_models/participation.model';
import { environment } from '../../environments/environment';

const ROUTE = environment.api + 'participations';
const SHARE_ROUTE = environment.api + 'share/';


@Injectable()
export class ParticipationService {
    constructor(
        private angulartics2: Angulartics2,
        private http: Http,
        private httpHelper: HttpHelper
    ) { }
    private options = new RequestOptions();

    getParticipation(): Observable<Participation> {
        let token = localStorage.getItem('participation');
        if (token) {
            return this.http.get(ROUTE + '/' + token, this.options)
                .map(res => {
                    if (res.json() && res.json().status === 'success') {
                        return res.json().data;
                    }
                })
                .catch(this.httpHelper.handleError);
        } else {
            return Observable.of(new Participation());
        }

    }



    newParticipation(): Observable<Participation> {
        this.angulartics2.eventTrack.next({
            action: 'Nouvelle Participation',
            properties: {
                category: 'Participation'
            }
        });


        return this.http.post(ROUTE, {}, this.options)
            .map(res => {
                if (res.json() && res.json().status === 'success') {
                    let token = res.json().data.token
                    localStorage.setItem('participation', token);
                    return res.json().data;
                }

            }).catch(this.httpHelper.handleError);
    }

    getResults(): Observable<any> {
        this.angulartics2.eventTrack.next({
            action: 'Obtention des résultats',
            properties: {
                category: 'Participation'
            }
        });
        const token = localStorage.getItem('participation');
        if (token) {
            return this.http.get(ROUTE + '/' + token + '/results')
                .map(res => {
                    if (res.json() && res.json().status === 'success') {
                        return res.json().data;
                    }
                })
                .catch(this.httpHelper.handleError);
        } else {
            return Observable.of(null);
        }

    }

    getResultsByCode(code): Observable<any> {

        this.angulartics2.eventTrack.next({
            action: 'Appel aux résultat partagé',
            properties: {
                category: 'Participation'
            }
        });

        return this.http.get(SHARE_ROUTE + code, this.options)
            .map(res => {
                if (res.json() && res.json().status === 'success') {
                    return res.json().data;
                }
            })
            .catch(this.httpHelper.handleError);
    }


    getShareLink(): Observable<string> {
        const token = localStorage.getItem('participation');
        if (token) {
            return this.http.get(ROUTE + '/' + token + '/share')
                .map(res => {
                    if (res.json() && res.json().status === 'success') {
                        console.log(res.json().data);
                        return res.json().data;
                    }
                })
                .catch(this.httpHelper.handleError);
        }

    }
}
