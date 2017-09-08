import { Component, OnInit } from '@angular/core';
import { ChapterService } from '../_services/chapter.service';
import { TinderService } from '../_services/tinder.service';
import { Chapter } from '../_models/chapter.model';
import { Statement } from '../_models/statement.model';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.css']
})
export class ChapterComponent implements OnInit {

  chapter: Chapter;
  token: string;
  loading: boolean;

  constructor(
    private _chapterService: ChapterService
  ) { }




  ngOnInit() {
    this.loading = true;
    this.token = localStorage.getItem('participation');
    this._chapterService.getRandomChapter(this.token)
      .subscribe(res => {
        this.loading = false;
        this.chapter = res;
      });
  }

  test() {
    console.log(this._chapterService.currentChapter);
    this._chapterService.currentChapter.subscribe(res => {
      console.log(res);
    });
  }

}
