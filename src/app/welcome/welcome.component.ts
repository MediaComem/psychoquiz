import { Component, OnInit } from '@angular/core';
import { Participation } from '../_models/participation.model';
import { ParticipationService } from '../_services/participation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  oldPlayer = false;
  oldPlayerFinished = false;
  participation: Participation;

  constructor(
    private _participationService: ParticipationService,
    private _router: Router
  ) { }

  ngOnInit() {
    this._participationService.getParticipation()
      .subscribe(res => {
        this.oldPlayerFinished = res ? res.finished: false;
        if (res && res.token) {
          this.oldPlayer = true;
        } else {
          this.oldPlayer = false;
        }
      })
  }

  startNew() {
    this._participationService.newParticipation()
      .subscribe(res => {
        this._router.navigateByUrl('/situation');
      });
  }
}
