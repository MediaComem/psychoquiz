import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { Observable } from "rxjs/Rx";


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (!this.auth.hasToken()) {
      this.router.navigate(['admin/login']);

    }
    return Observable.of(this.auth.hasToken());
    /*return this.auth.checkTokenPromise().then((auth) => {
      if (auth) {
        return true;
      }
      this.router.navigate(['admin/login']);
      return false;
    })*/
  }
}