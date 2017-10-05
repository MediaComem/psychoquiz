import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChapterService } from '../_services/chapter.service';
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
    private _chapterService: ChapterService,
    private _router: Router
  ) { }




  ngOnInit() {
    this.loading = true;
    this.token = localStorage.getItem('participation');
    // problem: need to disable cache
    this._chapterService.getRandomChapter(this.token)
      .subscribe(res => {
        
        if (res.finished) {
          this._router.navigate(['/results']);
        } else {
          this.loading = false;
          this.chapter = res;
        }

      });
  }

}
