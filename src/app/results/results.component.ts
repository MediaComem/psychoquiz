import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ParticipationService } from '../_services/participation.service';


@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  constructor(
    private _participationService: ParticipationService,
    private _router: Router
  ) { }

  ngOnInit() {
  }

  startNew() {
    this._participationService.newParticipation()
      .subscribe(res => {
        this._router.navigateByUrl('/situation');
      });
  }

}
