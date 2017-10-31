import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Profile } from '../../_models/profile.model';
import { ProfileService } from '../../_services/profile.service';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss']
})
export class ProfilesComponent implements OnInit {
  @ViewChild('profileForm') profileForm;

  editing: boolean;
  model: Profile = new Profile();
  editingProfile: Profile;
  linkingProfile: Profile;

  submitted = false;


  profiles: Profile[] = [];
  constructor(
    private _profileService: ProfileService
  ) { }

  ngOnInit() {
    this._profileService.getProfiles()
      .subscribe(res => {
        this.profiles = res;
      });
  }


  onSubmit() {
    this.submitted = true;
    this._profileService.addProfile(this.model.name, this.model.description, this.model.body)
      .subscribe(res => {
        this.profiles.push(res);
        this.profileForm.reset();
        this.model = new Profile();
      });
  }

}
