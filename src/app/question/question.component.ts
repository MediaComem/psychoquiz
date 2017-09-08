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

  cards: Array<any>;
  stackConfig: StackConfig;
  counter: number = 0;
  finished = false;

  statements: Statement[];

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

    this.cards = [
      { name: 'clubs', symbol: '♣' },
      { name: 'diamonds', symbol: '♦' },
      { name: 'spades', symbol: '♠' }
    ];
  }
  
  ngOnInit() {
    // Get statements from current chapter Observable
    this._chapterService.currentChapter.subscribe(res => {
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

    //this.swingStack.dragstart.subscribe((event: DragEvent) => console.log(event));
    //this.swingStack.dragmove.subscribe((event: DragEvent) => console.log(event));
  }


  // Answer the statement and send answer to server
  onThrowOut(event: ThrowEvent) {
   
    const id = event.target.attributes.getNamedItem('id').textContent;
    const stid = id.split('-').length == 2 ? parseInt(id.split('-')[1], 10) : 0;
    const answer = event.throwDirection.toString() === 'Symbol(RIGHT)';
    this._tinderService.postAnswer(answer,stid)
      .subscribe(res => {
        this.counter ++;
        if (this.counter === this.statements.length) {
          this._router.navigate(['/situation']);
        }
      });
  }

  selectedAnswer: string;

}
