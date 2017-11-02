import { Component, ViewEncapsulation, OnInit, } from '@angular/core';
import { Angulartics2GoogleAnalytics } from 'angulartics2';
import { FacebookService, InitParams, UIParams, UIResponse } from 'ngx-facebook';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Meta } from '@angular/platform-browser';

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
    private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private metaService: Meta
  ) {
    const initParams: InitParams = {
      appId: '1969313496672662',
      xfbml: true,
      version: 'v2.8'
    };

    fb.init(initParams);
  }

  ngOnInit() {

    this.metaService.addTags([
      { property: 'og:title', content: 'Ton père je suis' },
      { property: 'og:description', content: 'Lorem ipsum dolor set amet bla bla bla' },
      { property: 'og:image', content: 'http://jesuistonpere.comem.ch/assets/share/share_base.jpg' },
      { property: 'og:url', content: 'http://jesuistonpere.comem.ch' },
      { property: 'og:site_name', content: 'Ton Père Je suis' },
      { property: 'og:locale', content: 'fr_CH' },
      { property: 'og:type', content: 'feed' }
    ]);

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
  share() {
    const url = 'http://jesuistonpere.comem.ch';
    const params: UIParams = {
      method: 'feed',
      link: url,
      href: url,
      picture: url + '/assets/share/share_base.jpg',
      name: 'custom name',
      caption: 'custom caption',
      description: 'custom description',
      hashtag: '#tonperejesuis'
    };


    this.fb.ui(params)
      .then((res: UIResponse) => console.log(res))
      .catch((e: any) => console.error(e));

  }
}
