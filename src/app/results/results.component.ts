import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ParticipationService } from '../_services/participation.service';
import { FacebookService, InitParams, UIParams, UIResponse } from 'ngx-facebook';

import { Profile } from '../_models/profile.model';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  results: any;
  visible = false;
  selectedProfile: any;
  loading = false;
  shared: boolean;
  shareLink: string;
  winner_machine: string;
  max: any;

  constructor(
    private fb: FacebookService,
    private _participationService: ParticipationService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {
    const initParams: InitParams = {
      appId: '1969313496672662',
      xfbml: true,
      version: 'v2.3'
    };

    fb.init(initParams);
  }


  ngOnInit() {
    this.loading = true;
    if (this._router.url.startsWith('/s/')) {
      this.shared = true;
      this._activatedRoute.params.subscribe(res => {
        this._participationService.getResultsByCode(res.code)
          .subscribe(resu => {
            this.setResults(resu);
          });
      });
    } else {
      this.shared = false;
      this._participationService.getResults()
        .subscribe(res => {
          this.setResults(res);
        });
    }
  }


  private setResults(res) {
    let max: any = {
      localPercent: 0
    };

    for (let i = 0; i < res.length; i++) {
      const element = res[i];
      res[i].accordeonOpen = false;
      if (res[i].localPercent >= max.localPercent) {
        max = res[i];
        this.max = res[i];
        setTimeout(() => {
          res[i].accordeonOpen = true;
        }, 1000);
      }
    }
    this.results = res;
    this.selectedProfile = max;
    this.winner_machine = max.name.replace(/\s+/g, '_').toLowerCase();
    this.loading = false;
  }
  public openAccordeon(profile) {
    for (let index = 0; index < this.results.length; index++) {
      const el = this.results[index];
      if (el.name === profile.name) { // close if open or open if closed
        el.accordeonOpen = !el.accordeonOpen;
      } else { // close all the others.
        el.accordeonOpen = false;
      }
    }
  }


  /* // legacy behaviour, not to use.
  share() {
    this._participationService.getShareLink()
      .subscribe(res => {
        this.shareLink = "http://"+window.location.hostname +'/s/' + res;
        console.log(this.shareLink);
      })
  }*/

  share() {
    const url = 'http://jesuistonpere.comem.ch/api/shareHtml/' + this.winner_machine;
    const params: UIParams = {
      method: 'share',
      href: url
    };


    this.fb.ui(params)
      .then((res: UIResponse) => console.log(res))
      .catch((e: any) => console.error(e));

  }

  startNew() {
    this._participationService.newParticipation()
      .subscribe(res => {
        this._router.navigateByUrl('/situation');
      });
  }

}
