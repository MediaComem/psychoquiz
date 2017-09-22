import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StatementService } from '../../../_services/statement.service';
import { ProfileService } from '../../../_services/profile.service';
import { Statement } from '../../../_models/statement.model';
import { Profile } from '../../../_models/profile.model';

@Component({
  selector: 'app-link-profiles',
  templateUrl: './link-profiles.component.html',
  styleUrls: ['./link-profiles.component.scss']
})
export class LinkProfilesComponent implements OnInit {

  success = false;
  statement: Statement;
  profiles: Profile[];

  constructor(
    private _route: ActivatedRoute,
    private _statementService: StatementService,
    private _profileService: ProfileService
  ) { }

  ngOnInit() {

    this._route.params.subscribe(params => {
      this._statementService.getStatement(params['id'])
        .subscribe(st => {
          this.statement = st;
        });

    });

    this._profileService.getProfiles()
      .subscribe(res => {
        this.profiles = res;
      });

  }

      
  editStatement() {
    
    console.log('test');
    this.success = true;
  }

}
