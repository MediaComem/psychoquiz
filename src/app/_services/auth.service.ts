import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { HttpHelper } from './http.helper';

import { User } from '../_models/user.model';

import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';



import { environment } from '../../environments/environment';

const AUTHROUTE = environment.api + 'auth/';


@Injectable()
export class AuthService {
  public token: string;
  public currentUser: User;
  public router: Router;
  public userChecked: Date;

  private _userSource = new BehaviorSubject<User>(new User());
  user = this._userSource.asObservable();

  private _loggedInSource = new BehaviorSubject<boolean>(false);
  loggedIn = this._loggedInSource.asObservable();

  constructor(
    private http: Http,
    router: Router,
    private httpHelper: HttpHelper
  ) {
    if (localStorage.getItem('currentUser')) {
      let user = JSON.parse(localStorage.getItem('currentUser'));
      // set token if saved in local storage
      this.token = user && user.token;
    }
    this.router = router;

  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post(AUTHROUTE + 'login', { email: email, password: password })
      .map((response: Response) => {
        let token;
        let userId;
        // login successful if there's a jwt token in the response
        token = response.json().data && response.json().data.token;

        if (token) {
          // set token property
          this.token = token;
          // store email and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify({
            token: token
          }));

          // define new user
          let user = new User();
          user.email = email;

          // Check token to get user information (user name, email, roles, etc.)
          //this.checkToken();
          this._loggedInSource.next(true);
          this._userSource.next(user);


          // return true to indicate successful login

          return true;
        } else {
          // return false to indicate failed login
          console.warn(response.json());
          return false;
        }

      }).catch(this.httpHelper.handleError);

  }


  /**
   * Log out
   */

  logout(): void {
    // clear token remove user from local storage to log user out
    this.token = null;
    localStorage.removeItem('currentUser');
    this._loggedInSource.next(false);
    var emptyUser = new User();
    emptyUser.id = 0;
    this._userSource.next(emptyUser);
    this.router.navigate(['/admin/login']);
    //location.reload();

  }




  hasToken(): boolean {
    if (localStorage.getItem('currentUser')) {
      this._loggedInSource.next(true);
      return true;
    };
    this._loggedInSource.next(false);
    return false;
  }

  checkToken(): Observable<User> {
    if (!this.hasToken()) {
      console.log('should logout');
      this.logout();
      return Observable.empty<User>();
    }

    let now = new Date();
    let compareDate = new Date(now.getTime() - 300000); // 5 minutes

    // if the user hasn't been checked yet or or if the time has passed 5 minutes
    if (!this.userChecked || this.userChecked < compareDate) {

      let headers = new Headers({ 'Authorization': 'Bearer ' + this.token });
      let options = new RequestOptions({ headers: headers });

      // get user from api
      return this.http.get(AUTHROUTE + 'user', options)
        .map((response: Response) => {
          // GET OWN USER
          this.currentUser = response.json().user;
          this._loggedInSource.next(true);
          this._userSource.next(response.json().user);
          this.userChecked = new Date();

          return this.user;
        })
        .catch((error: Response) => {
          console.warn(error);
          this.logout();
          return error.json();
        });
    } else { // No need to check user
      this._loggedInSource.next(true);
      this._userSource.next(this.currentUser);
      return Observable.of(this.currentUser);
    }

  }

  checkTokenPromise(): Promise<User> {
    return this.checkToken().toPromise();
  }
}
