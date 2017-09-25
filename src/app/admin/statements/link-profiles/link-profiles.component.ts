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
  weightIfTrue: any = {};
  weightIfFalse: any = {};

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
          console.log(this.statement);
          // once we have the statement, we need to populate the weights.
          if (this.statement.Profiles && this.statement.Profiles.length > 0) {
            for (var index = 0; index < this.statement.Profiles.length; index++) {
              const profile = this.statement.Profiles[index];
              this.weightIfTrue[profile.id] = profile.Weight.weightIfTrue;
              this.weightIfFalse[profile.id] = profile.Weight.weightIfFalse;
            }
          }
        });

    });

    // Get all available profiles
    this._profileService.getProfiles()
      .subscribe(res => {
        this.profiles = res;
      });
  }

  editStatement() {
    const profiles = [];


    for (var index = 0; index < this.profiles.length; index++) {
      const id = this.profiles[index].id
      profiles.push({
        id: id,
        true: this.weightIfTrue[id],
        false: this.weightIfFalse[id],
      });
    }

    this._statementService.editStatement(this.statement.text, this.statement.ChapterId, profiles, this.statement.id)
      .subscribe(res => {
        this.success = true;        
        this.statement = res;
      });
    
  }

}
