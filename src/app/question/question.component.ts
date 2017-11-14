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
  @ViewChild('yesArea') yesAreaElement: ElementRef;
  @ViewChild('noArea') noAreaElement: ElementRef;
  @ViewChild('swingViewport') viewportElement: ElementRef;
  @ViewChild('swingStack') swingStack: SwingStackComponent;
  @ViewChild('swingStack', { read: ElementRef }) stackElement: ElementRef;

  hammer: any;
  stackConfig: StackConfig;
  counter: number = 0;
  finished = false;
  accept: boolean;
  refuse: boolean;

  statements: Statement[];
  currentCardIndex: number;
  chapter: Chapter;
  opacity: number = 0;
  opacityLeft: number = 0;
  opacityRight: number = 0;
  showHelp = true;
  tabVisible = false;
  selectedAnswer: string;

  private viewportClick: MouseEvent;

  constructor(
    private _tinderService: TinderService,
    private _chapterService: ChapterService,
    private _router: Router
  ) {

    this.stackConfig = {
      allowedDirections: [ Direction.LEFT, Direction.RIGHT ],
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

    if (!localStorage.getItem('hideHelp')) {
      this.showHelp = true;
    } else {
      this.showHelp = false;
    }

    // Get statements from current chapter Observable
    this._chapterService.currentChapter.subscribe(res => {

      this.chapter = res;

      if (res.Statements) {
        // Reverse the statements because the cards appear in reverse order
        this.statements = res.Statements.reverse();
        this.currentCardIndex = this.statements.length - 1;
      }

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

    this.hammer = new Hammer(this.chapterInfoTab.nativeElement, {});

    this.hammer.get('swipe').set({
      direction: Hammer.DIRECTION_ALL
    });

    this.hammer.on('swipe', event => {
      event.preventDefault();
      if (event.deltaY > 0 && !this.tabVisible) {
        // Swipe down (deltaY positive)
        this.tabVisible = true;
      } else if (event.deltaY < 0 && this.tabVisible) {
        // Swipe up (deltaY negative)
        this.tabVisible = false;
      }
    });

    // Answer yes when clicking in the yes area
    this.yesAreaElement.nativeElement.addEventListener('click', event => {
      this.answerCurrentCard(true);
    });

    // Answer yes when clicking in the no area
    this.noAreaElement.nativeElement.addEventListener('click', event => {
      this.answerCurrentCard(false);
    });

    // Answer when clicking in the swing viewport in the yes or no area.
    //
    // In order to listen for click events in the swing viewport, we must first
    // keep track of mousedown events. This is because sometimes a click event is
    // triggered when it was in fact a drag of a card.
    //
    // We therefore keep the mousedown event in a variable, so that when we get
    // the mouseup event later, we can know whether it was a click (same event
    // coordinates) or a drag (differente event coordinates).
    this.viewportElement.nativeElement.addEventListener('mousedown', event => {
      this.viewportClick = event;
    });

    // Answer when clicking in the swing viewport in the yes or no area
    this.viewportElement.nativeElement.addEventListener('mouseup', event => {
      if (!this.viewportClick || event.x !== this.viewportClick.x || event.y !== this.viewportClick.y || this.isWithinElement(this.stackElement.nativeElement.getBoundingClientRect(), event)) {
        // Ignore drag events (coordinates have changed since the last mousedown event)
        // and clicks in the card area
      } else if (this.isWithinElement(this.yesAreaElement.nativeElement.getBoundingClientRect(), event)) {
        this.answerCurrentCard(true);
      } else if (this.isWithinElement(this.noAreaElement.nativeElement.getBoundingClientRect(), event)) {
        this.answerCurrentCard(false);
      }

      this.viewportClick = undefined;
    });

    this.swingStack.throwin.subscribe((event: ThrowEvent) => {
      this.opacityLeft = 0;
      this.opacityRight = 0;
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
      if (event.throwDirection === Direction.RIGHT && event.throwOutConfidence === 1) {
        //this.opacityRight = Math.round(event.throwOutConfidence * precision) / precision * 0.7;
        this.opacityRight = 0.5
        this.opacityLeft = 0;
        // Add the classes only to the current card (element in list that is the currentCardIndex)
        this.statements[this.currentCardIndex].accepting = false;
        this.statements[this.currentCardIndex].refusing = true;

      } else if (event.throwDirection === Direction.LEFT && event.throwOutConfidence === 1) {
        //this.opacityLeft = Math.round(event.throwOutConfidence * precision) / precision * 0.7;
        this.opacityLeft = 0.5;
        this.opacityRight = 0;
        // Add the classes only to the current card (element in list that is the currentCardIndex)
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

    this.currentCardIndex--;

    const statementId = parseInt(event.target.getAttribute('card-statement'), 10);
    const answer = event.throwDirection === Direction.LEFT;
    this.opacityLeft = 0.7;
    this.opacityRight = 0.7;

    this.answer(answer, isNaN(statementId) ? 0 : statementId);
  }

  answer(value: boolean, statementId: number) {
    this._tinderService.postAnswer(value, statementId).subscribe(res => {
      this.opacityLeft = 0;
      this.opacityRight = 0;
      this.counter++;
      if (this.counter === this.statements.length) {
        this._router.navigate(['/situation']);
      }
    });
  }

  answerCurrentCard(value: boolean) {

    const card = this.swingStack.cards[this.currentCardIndex];
    const statementId = parseInt(card.getNativeElement().getAttribute('card-statement'), 10);

    card.destroyCard();
    card.getNativeElement().remove();
    this.currentCardIndex--;

    this.answer(value, isNaN(statementId) ? 0 : statementId);
  }

  isWithinElement(bounds: ClientRect, event: MouseEvent): boolean {
    return event.x >= bounds.left && event.x <= bounds.left + bounds.width && event.y >= bounds.top && event.y <= bounds.top + bounds.height;
  }
}
