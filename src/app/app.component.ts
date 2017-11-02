import { Component, ViewEncapsulation, OnInit, } from '@angular/core';
import { Angulartics2GoogleAnalytics } from 'angulartics2';
import { FacebookService, InitParams, UIParams, UIResponse } from 'ngx-facebook';
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
    private fb: FacebookService,
    private router: Router,
    private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics
  ) {
    const initParams: InitParams = {
      appId: '1969313496672662',
      xfbml: true,
      version: 'v2.3'
    };

    fb.init(initParams);
  }

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
  share(profile) {
    const url = 'http://jesuistonpere.comem.ch/api/shareHtml/' + profile;
    const params: UIParams = {
      method: 'share',
      href: url
    };


    this.fb.ui(params)
      .then((res: UIResponse) => console.log(res))
      .catch((e: any) => console.error(e));

  }
}
