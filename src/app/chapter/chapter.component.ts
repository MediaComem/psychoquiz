import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Angulartics2 } from 'angulartics2';
import { ChapterService } from '../_services/chapter.service';
import { ParticipationService } from '../_services/participation.service';
import { TinderService } from '../_services/tinder.service';
import { Chapter } from '../_models/chapter.model';
import { Statement } from '../_models/statement.model';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss']
})
export class ChapterComponent implements OnInit {

  chapter: Chapter;
  token: string;
  loading: boolean;

  constructor(
    private angulartics2: Angulartics2,
    private _chapterService: ChapterService,
    private _participationService: ParticipationService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.loading = true;
    this.token = localStorage.getItem('participation');
    // problem: need to disable cache
    this._chapterService.getRandomChapter(this.token)
      .subscribe(res => {
        if (res.finished) {
          this.finish();
        } else {
          this.loading = false;
          this.chapter = res;
        }

      });
  }

  start() {
    this._router.navigate(['situation/tdr']);
  }

  private finish() {
    this._participationService.getResults().subscribe(results => {

      let profile: any = {};

      for (let i = 0; i < results.length; i++) {
        const currentProfile = results[i];
        if (profile.localPercent === undefined || currentProfile.localPercent >= profile.localPercent) {
          profile = currentProfile;
        }
      }

      this.angulartics2.eventTrack.next({
        action: profile.name,
        properties: {
          category: 'Profil',
          value: Math.round(profile.localPercent * 100)
        }
      });

      this._router.navigate(['/results']);
    });
  }

}
