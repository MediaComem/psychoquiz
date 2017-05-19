import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SwingModule } from 'angular2-swing';

import { AppComponent } from './app.component';

import { QuestionComponent } from './question/question.component';

@NgModule({
  declarations: [
    AppComponent,
    QuestionComponent
  ],
  imports: [
    SwingModule,
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent, QuestionComponent]
})
export class AppModule { }
