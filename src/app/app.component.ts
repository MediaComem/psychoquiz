import { Component, ViewEncapsulation, OnInit, } from '@angular/core';
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

  constructor(private router: Router) {

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
}
