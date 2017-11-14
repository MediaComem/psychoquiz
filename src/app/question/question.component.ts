import { Component, ElementRef, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import * as Hammer from 'hammerjs';
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
  @ViewChild('chapterInfoTab') chapterInfoTab: ElementRef;
  @ViewChild('swSwing') swingStack: SwingStackComponent;
  @ViewChildren('questionCard') swingCards: QueryList<SwingCardComponent>;

  hammer: any;
  stackConfig: StackConfig;
  counter: number = 0;
  finished = false;
  accept: boolean;
  refuse: boolean;

  statements: Statement[];
  currentCardId: number;
  currentCardIndex: number;
  chapter: Chapter;
  opacity: number = 0;
  opacityLeft: number = 0;
  opacityRight: number = 0;
  showHelp = true;
  tabVisible = false;

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
        return Math.min(
          Math.max(
            Math.abs(offsetX) / (element.offsetWidth / 4.4),
            Math.abs(offsetY) / (element.offsetHeight / 3)),
        1);
      },
      throwOutDistance: (d) => {
        return 12000;
      }
    };
  }

  closeHelp() {
    this.showHelp = false;
    localStorage.setItem('hideHelp', 'true');
  }

  ngOnInit() {
    // Get statements from current chapter Observable

    if (!localStorage.getItem('hideHelp')) {
      this.showHelp = true;
    } else {
      this.showHelp = false;
    }


    this._chapterService.currentChapter.subscribe(res => {
      this.chapter = res;
      this.statements = res.Statements;
      if (!res || !res.Statements || res.Statements.length === 0) {
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

    this.hammer = new Hammer(this.chapterInfoTab.nativeElement, {
      preset: []
    });

    this.hammer.add(new Hammer.Swipe({
      event: 'swipedown',
      direction: Hammer.DIRECTION_DOWN,
      threshold: 5,
      velocity: 0.001
    }));

    this.hammer.add(new Hammer.Swipe({
      event: 'swipeup',
      direction: Hammer.DIRECTION_UP,
      threshold: 5,
      velocity: 0.001
    }));

    this.hammer.on('swipeup', event => {
      if (this.tabVisible) {
        this.tabVisible = false;
      }
    });

    this.hammer.on('swipedown', event => {
      if (!this.tabVisible) {
        this.tabVisible = true;
      }
    });

    this.swingStack.throwin.subscribe((event: ThrowEvent) => {
      this.opacityLeft = 0;
      this.opacityRight = 0;
    });

    this.swingStack.dragstart.subscribe((event: DragEvent) => {

      this.currentCardId = parseInt(event.target.id.split('-')[1], 10);
      this.currentCardIndex = parseInt(event.target.id.split('-')[2], 10);

    });

    this.swingStack.dragend.subscribe((event: DragEvent) => {
      for (let index = 0; index < this.statements.length; index++) {
        this.statements[index].accepting = false;
        this.statements[index].refusing = false;
      }
    });

    this.swingStack.dragmove.subscribe((event: DragEvent) => {
      //this.opacity = this.confidenceCalculator(event.throwOutConfidence, 30) * 0.7;

      //if (this.opacityLeft != this.opacity && this.opacityRight != this.opacity) {
      if (event.throwDirection.toString() === 'Symbol(RIGHT)' && event.throwOutConfidence === 1) {
        //this.opacityRight = Math.round(event.throwOutConfidence * precision) / precision * 0.7;
        this.opacityRight = 0.5
        this.opacityLeft = 0;
        // Add the classes only to the current card (element in list that is the currentCardId)
        this.statements[this.currentCardIndex].accepting = false;
        this.statements[this.currentCardIndex].refusing = true;

      } else if (event.throwDirection.toString() === 'Symbol(LEFT)' && event.throwOutConfidence === 1) {
        //this.opacityLeft = Math.round(event.throwOutConfidence * precision) / precision * 0.7;
        this.opacityLeft = 0.5;
        this.opacityRight = 0;
        // Add the classes only to the current card (element in list that is the currentCardId)
        this.statements[this.currentCardIndex].accepting = true;
        this.statements[this.currentCardIndex].refusing = false;

      } else {
        this.statements[this.currentCardIndex].accepting = false;
        this.statements[this.currentCardIndex].refusing = false;
        this.opacityLeft = 0;
        this.opacityRight = 0;
      }
      //}
    });
  }

  ngOnDestroy() {
    if (this.hammer) {
      this.hammer.destroy();
    }
  }

  confidenceCalculator(confidence, precision) {
    if (confidence >= 1) {
      return 1;
    }
    const v = confidence * precision;
    return ~~v / precision;
  }


  // Answer the statement and send answer to server
  onThrowOut(event: ThrowEvent) {
    /*if (navigator.vibrate) {
      navigator.vibrate(60);
    }*/
    const id = event.target.attributes.getNamedItem('id').textContent;
    const stid = id.split('-').length >= 2 ? parseInt(id.split('-')[1], 10) : 0;
    const answer = event.throwDirection.toString() === 'Symbol(LEFT)';
    this.opacityLeft = 0.7;
    this.opacityRight = 0.7;
    this._tinderService.postAnswer(answer, stid)
      .subscribe(res => {
        this.opacityLeft = 0;
        this.opacityRight = 0;
        this.counter++;
        if (this.counter === this.statements.length) {
          this._router.navigate(['/situation']);
        }
      });
  }

  selectedAnswer: string;

}
