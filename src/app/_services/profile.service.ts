import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { HttpHelper } from './http.helper';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import 'rxjs/add/operator/toPromise';

import { Profile } from '../_models/profile.model';
import { environment } from '../../environments/environment';

const ROUTE = environment.api + 'profiles';



@Injectable()
export class ProfileService {


    private options = new RequestOptions({
        headers: new Headers({
            'Authorization': 'Bearer ' + 'token' // TODO: Change
        })
    });
    constructor(
        private http: Http,
        private httpHelper: HttpHelper
    ) { }

    getProfiles(): Observable<Profile[]> {
        return this.http.get(ROUTE, this.options)
            .map(this.httpHelper.extractData)
            .catch(this.httpHelper.handleError);

    }

    addProfile(name: string, description: string, body: string): Observable<Profile> {
        const data = {
            name: name,
            description: description,
            body: body,
        };

        return this.http.post(ROUTE, data, this.options)
            .map(this.httpHelper.extractData)
            .catch(this.httpHelper.handleError);
    }
}
