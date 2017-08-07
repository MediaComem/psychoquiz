import { Component, OnInit } from '@angular/core';
import { Chapter } from '../../_models/chapter.model';
@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.component.html',
  styleUrls: ['./chapters.component.scss']
})
export class ChaptersComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  model: Chapter = new Chapter();

  submitted = false;

  onSubmit() { this.submitted = true; }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }

}
 