import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import {
  StackConfig,
  Stack,
  Card,
  Direction,
  ThrowEvent,
  DragEvent,
  SwingStackComponent,
  SwingCardComponent
} from 'angular2-swing';

import { Statement } from '../_models/statement.model';
import { Chapter } from '../_models/chapter.model';
import { TinderService } from '../_services/tinder.service';
import { ChapterService } from '../_services/chapter.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})

export class QuestionComponent implements OnInit {
  @ViewChild('swSwing') swingStack: SwingStackComponent;
  @ViewChildren('questionCard') swingCards: QueryList<SwingCardComponent>;

  stackConfig: StackConfig;
  counter: number = 0;
  finished = false;

  statements: Statement[];
  chapter: Chapter;
  opacityLeft: number = 0;
  opacityRight: number = 0;

  constructor(
    private _tinderService: TinderService,
    private _chapterService: ChapterService,
    private _router: Router
  ) {

    this.stackConfig = {
      // Default setting only allows UP, LEFT and RIGHT so you can override this as below
      allowedDirections: [/*Direction.UP, Direction.DOWN, */Direction.LEFT, Direction.RIGHT],
      // Now need to send offsetX and offsetY with element instead of just offset
      throwOutConfidence: (offsetX, offsetY, element) => {
        return Math.min(Math.max(Math.abs(offsetX) / (element.offsetWidth / 1.7), Math.abs(offsetY) / (element.offsetHeight / 2)), 1);
      },
      throwOutDistance: (d) => {
        return 12000;
      }
    }
  }
  
  ngOnInit() {
    // Get statements from current chapter Observable
    this._chapterService.currentChapter.subscribe(res => {
      this.chapter = res;
      this.statements = res.Statements;
      if (!res || !res.Statements) {
        this._router.navigate(['situation']);
      }
    });
  }

  ngAfterViewInit() {
    // ViewChild & ViewChildren are only available
    // in this function

    //console.log(this.swingStack); // this is the stack
    //console.log(this.swingCards); // this is a list of cards

    // we can get the underlying stack
    // which has methods - createCard, destroyCard, getCard etc
    //console.log(this.swingStack.stack);

    // and the cards
    // every card has methods - destroy, throwIn, throwOut etc
    //this.swingCards.forEach((c) => console.log(c.getCard()));


    // this is how you can manually hook up to the
    // events instead of providing the event method in the template
    //this.swingStack.throwoutleft.subscribe(
    //  (event: ThrowEvent) => console.log('Manual hook: ', event));

    this.swingStack.throwin.subscribe((event:ThrowEvent) => {
      this.opacityLeft = 0;
      this.opacityRight = 0;
    });
    //this.swingStack.dragstart.subscribe((event: DragEvent) => console.log(event));


    this.swingStack.dragmove.subscribe((event: DragEvent) => {
      const precision = 20; // bigger is more precise
      if (event.throwDirection.toString() === 'Symbol(RIGHT)') {
        this.opacityRight = Math.round(event.throwOutConfidence * precision) / precision * 0.6;
        this.opacityLeft = 0;
      }
      if (event.throwDirection.toString() === 'Symbol(LEFT)') {
        this.opacityLeft = Math.round(event.throwOutConfidence * precision) / precision * 0.6;
        this.opacityRight = 0;
      }
      if (event.throwOutConfidence === 1) {
        if (navigator.vibrate) {
          navigator.vibrate(300);
        }
      }
    });
  }


  // Answer the statement and send answer to server
  onThrowOut(event: ThrowEvent) {
    if (navigator.vibrate) {
      navigator.vibrate(600);
    }
    const id = event.target.attributes.getNamedItem('id').textContent;
    const stid = id.split('-').length == 2 ? parseInt(id.split('-')[1], 10) : 0;
    const answer = event.throwDirection.toString() === 'Symbol(RIGHT)';
    this.opacityLeft = 0.7;
    this.opacityRight = 0.7;
    this._tinderService.postAnswer(answer,stid)
      .subscribe(res => {
        this.opacityLeft = 0;
        this.opacityRight = 0;
        this.counter ++;
        if (this.counter === this.statements.length) {
          this._router.navigate(['/situation']);
        }
      });
  }

  selectedAnswer: string;

}
