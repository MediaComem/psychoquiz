import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { ChapterService } from '../../_services/chapter.service';
import { Chapter } from '../../_models/chapter.model';


@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.component.html',
  styleUrls: ['./chapters.component.scss']
})
export class ChaptersComponent implements OnInit {

  @ViewChild('addStatementForm') addStatementForm;
  
  editing: boolean;
  model: Chapter = new Chapter();
  editingChapter: Chapter;
  linkingChapter: Chapter;

  chapters: Chapter[] = [];

  submitted = false;

  
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
        this.addStatementForm.reset();
        this.model = new Chapter();
      })
  }
  editChapter(id: number) {
    console.log('editing chapter #' + id)
  }
}
 