import { Component, OnInit, NgModule, ViewChild, ElementRef } from '@angular/core'
import { Router } from '@angular/router';

import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private _authService: AuthService,
    private router: Router
  ) { }

  email: string;
  password: string;
  error: string;
  ngOnInit() {

  }

  @ViewChild('passwordInput') passwordInput: ElementRef;


  onSubmit() {
    let pw = this.password;
    this.password = '';
    this._authService.login(this.email, pw)
      .subscribe(res => {
        if (!res) {
          this.error = "Problème d'authentification. Veuillez saisir un nom d'utilisateur et un mot de passe correct.";
          this.passwordInput.nativeElement.focus();
        } else {
          this.error = '';
          this.router.navigate(['admin']);
        }
      })
  }

}
