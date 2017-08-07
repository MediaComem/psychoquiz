import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor() { }

  email: string;
  password: string;

  ngOnInit() {

  }

  onSubmit() {
    console.log("submitting: " + this.email + ':' + this.password);
  }

}
