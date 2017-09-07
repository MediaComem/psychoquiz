import { Component, OnInit } from '@angular/core';
import { ChapterService } from '../_services/chapter.service';
import { Chapter } from '../_models/chapter.model';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.css']
})
export class ChapterComponent implements OnInit {

  chapter: Chapter;
  token: string;

  constructor(
    private _chapterService: ChapterService
  ) { }




  ngOnInit() {

    this.token = localStorage.getItem('participation');
    this._chapterService.getRandomChapter(this.token)
      .subscribe(res => {
        this.chapter = res;
      })

  }

}
