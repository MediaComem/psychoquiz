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

  chapters: Chapter[];
  statements: Statement[];

  @ViewChild('form') form;

  editingStatement: Statement;
  model: Statement = new Statement();

  submitted = false;
  editing: boolean;
  success: boolean | string = false;
  chapterIds: number[] = [];

  constructor(
    private _chapterService: ChapterService,
    private _statementService: StatementService,
  ) { }

  ngOnInit() {
    this._chapterService.getChapters()
      .subscribe(chapters => {
        this.chapters = chapters;
        for (var index = 0; index < chapters.length; index++) {
          this.chapterIds.push(chapters[index].id);
        }
      });
    this._statementService.getStatements()
      .subscribe(statements => {
        this.statements = statements;
      });
  }

  onSubmit() {
    this.submitted = true;

    this._statementService.addStatement(this.model.text, this.model.ChapterId, [])
      .subscribe(res => {
        this.statements.push(res);
        this.form.reset();
        this.model = new Statement();
      })
  }

  getEventOdd(ChapterId) {
    let nb;
    for (var index = 0; index < this.chapterIds.length; index++) {
      if (ChapterId === this.chapterIds[index]) {
        nb = index;
      }
    }
    if (nb % 2 === 0) {
      return 'even';
    };
    return 'odd';
  }

  setEdit(statement: Statement) {
    if (this.editing && this.editingStatement.id === statement.id) {
      this.editing = false;
      this.editingStatement = new Statement();
    } else {
      this.editing = true;
      this.editingStatement = JSON.parse(JSON.stringify(statement));
    }
  }


  editStatement(id: number) {
    this._statementService.editStatement(
      this.editingStatement.text,
      this.editingStatement.ChapterId,
      this.editingStatement.Profiles,
      id
    ).subscribe(res => {
      this.success = 'Affirmation ' + id + ' sauvegardé avec succès.';
      this.setEdit(this.editingStatement);

      for (let index = 0; index < this.statements.length; index++) {
        const c = this.statements[index];
        if (c.id === id) {
          this.statements[index] = res;
        }
      }
    })

  }

}
