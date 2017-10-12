import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ParticipationService } from '../_services/participation.service';
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

  constructor(
    private _participationService: ParticipationService,
    private _router: Router
  ) { }


  ngOnInit() {
    this._participationService.getResults()
      .subscribe(res => {
        this.results = res;
        let max = {
          localPercent: 0
        };

        for (let i = 0; i < res.length; i++) {
          var element = res[i];
          if (res[i].localPercent >= max.localPercent) {
            max = res[i];
          }
        }
        this.selectedProfile = max;
        console.log(this.selectedProfile);
      });
  }

  startNew() {
    this._participationService.newParticipation()
      .subscribe(res => {
        this._router.navigateByUrl('/situation');
      });
  }

}
