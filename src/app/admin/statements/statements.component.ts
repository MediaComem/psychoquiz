import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { ChapterService } from '../../_services/chapter.service';
import { StatementService } from '../../_services/statement.service';
import { Chapter } from '../../_models/chapter.model';
import { Statement } from '../../_models/statement.model';

@Component({
  selector: 'app-statements',
  templateUrl: './statements.component.html',
  styleUrls: ['./statements.component.scss']
})
export class StatementsComponent implements OnInit {

  @ViewChild('statementForm') statementForm;


  constructor(
    private _chapterService: ChapterService,
    private _statementService: StatementService,
  ) { }

  chapters: Chapter[] = [];
  statements: Statement[] = [];

  editingStatement: Statement;
  model: Statement;


  ngOnInit() {
    this._chapterService.getChapters()
      .subscribe(chapters => {
        this.chapters = chapters;
      });
    this._statementService.getStatements()
      .subscribe(statements => {
        this.statements = statements;
      });
  }

}
