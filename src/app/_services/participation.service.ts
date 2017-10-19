import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Angulartics2 } from 'angulartics2';

import { Observable } from 'rxjs';
import { HttpHelper } from './http.helper';
import 'rxjs/add/operator/map'


import { Participation } from '../_models/participation.model';
import { environment } from '../../environments/environment';

const ROUTE = environment.api + 'participations';

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
}
