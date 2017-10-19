import { Component, ViewEncapsulation, OnInit, } from '@angular/core';
import { Angulartics2GoogleAnalytics } from 'angulartics2';

import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None

})

export class AppComponent implements OnInit {

  logoVisible = false;

  constructor(
    private router: Router,
    private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics
  ) { }

  ngOnInit() {
    this.router.events.subscribe(val => {
      if (val && val instanceof NavigationEnd) {
        if (val.url === '/' || val.url === '/start') {
          this.logoVisible = false;
        } else {
          this.logoVisible = true;
        }
      }
    });
  }
}
