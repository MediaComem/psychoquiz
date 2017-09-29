import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChapterService } from '../../_services/chapter.service';
import { Chapter } from '../../_models/chapter.model';


@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.component.html',
  styleUrls: ['./chapters.component.scss']
})
export class ChaptersComponent implements OnInit {

  @ViewChild('chapterForm') chapterForm;

  editing: boolean;
  model: Chapter = new Chapter();
  editingChapter: Chapter;
  linkingChapter: Chapter;

  chapters: Chapter[] = [];

  submitted = false;

  success: boolean | string = false;

  constructor(
    private _chapterService: ChapterService
  ) { }

  ngOnInit() {
    this._chapterService.getChapters()
      .subscribe(chapters => {
        this.chapters = chapters;
      })
  }


  onSubmit() {
    this.submitted = true;
    this._chapterService.addChapter(this.model.number, this.model.title, this.model.intro, this.model.imgUrl)
      .subscribe(res => {
        this.chapters.push(res);
        this.chapterForm.reset();
        this.model = new Chapter();
      });
  }

  setEdit(chapter: Chapter) {
    if (this.editing && this.editingChapter.id === chapter.id) {
      this.editing = false;
      this.editingChapter = new Chapter();
    } else {
      this.editing = true;
      this.editingChapter = JSON.parse(JSON.stringify(chapter));
    }
  }


  editChapter(id: number) {
    this._chapterService.editChapter(id, this.editingChapter)
      .subscribe(res => {
        this.success = 'Situation ' + id + ' sauvegardé avec succès.';
        this.setEdit(this.editingChapter);

        for (let index = 0; index < this.chapters.length; index++) {
          const c = this.chapters[index];
          if (c.id === id) {
            this.chapters[index] = res;
          }
          
        }
      })

  }
}
