import { Injectable } from "@angular/core";
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpHelper {
    /**
     * Get the data from the result map
     * @param res the response we want to extract
     */
    public extractData(res: Response) {
        if (res.json().status == 'success') {
            return res.json().data || {};
        }
        throw new Error(res.json().message || 'Error with API');
    }
    /**
     * Manage errors from the result map
     * @param error the error response
     */
    public handleError(error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
    
}
