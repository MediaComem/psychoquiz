import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
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

import { Question } from './question';


@Component({
  selector: 'question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})

export class QuestionComponent {
  @ViewChild('swSwing') swingStack: SwingStackComponent;
  @ViewChildren('questionCard') swingCards: QueryList<SwingCardComponent>;

  cards: Array<any>;
  stackConfig: StackConfig;

  constructor() {

    this.stackConfig = {
      // Default setting only allows UP, LEFT and RIGHT so you can override this as below
      allowedDirections: [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT],
      // Now need to send offsetX and offsetY with element instead of just offset
      throwOutConfidence: (offsetX, offsetY, element) => {
        return Math.min(Math.max(Math.abs(offsetX) / (element.offsetWidth / 1.7), Math.abs(offsetY) / (element.offsetHeight / 2)), 1);
      },
      throwOutDistance: (d) => {
        return 800;
      }
    }

    this.cards = [
      { name: 'clubs', symbol: '♣' },
      { name: 'diamonds', symbol: '♦' },
      { name: 'spades', symbol: '♠' }
    ];
  }

  ngAfterViewInit() {
    // ViewChild & ViewChildren are only available
    // in this function

    console.log(this.swingStack); // this is the stack
    console.log(this.swingCards); // this is a list of cards

    // we can get the underlying stack
    // which has methods - createCard, destroyCard, getCard etc
    console.log(this.swingStack.stack);

    // and the cards
    // every card has methods - destroy, throwIn, throwOut etc
    this.swingCards.forEach((c) => console.log(c.getCard()));

    // this is how you can manually hook up to the
    // events instead of providing the event method in the template
    this.swingStack.throwoutleft.subscribe(
      (event: ThrowEvent) => console.log('Manual hook: ', event));

    this.swingStack.dragstart.subscribe((event: DragEvent) => console.log(event));

    this.swingStack.dragmove.subscribe((event: DragEvent) => console.log(event));
  }

  // This method is called by hooking up the event
  // on the HTML element - see the template above
  onThrowOut(event: ThrowEvent) {
    console.log('Hook from the template', event.throwDirection);
  }

  question = new Question(
    1,
    'A quoi correspond cette image capturée ?',
    '... fatidique, à priori.',
    'https://static1.squarespace.com/static/51b3dc8ee4b051b96ceb10de/t/573c8d3037013b84828a35b5/1463586106534/is-han-solo-really-dead-harrison-ford-says-hes-just-resting',
    ['A la résurrection de Jon Snow', 'A la mort de Han Solo', 'Au solo de basse de Jason Newsted', 'La réponse D.'],
    0
  );

  imageUrl = this.question.imageUrl;

  selectedAnswer: string;



}
