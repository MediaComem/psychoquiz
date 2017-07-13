import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None // Allows the scss to be applied globally

})
export class AppComponent {
  title = 'Maison d\'Ailleurs - Star Wars Quiz';
}
