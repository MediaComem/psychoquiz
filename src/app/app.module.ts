import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SwingModule } from 'angular2-swing';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

import { QuestionComponent } from './question/question.component';
import { AdminComponent } from './admin/admin.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { AuthGuard } from './_guards/auth.guard';

import { HttpHelper } from './_services/http.helper';

import { AuthService } from './_services/auth.service';
import { QuestionService } from './_services/question.service';
import { LoginComponent } from './login/login.component';




const appRoutes: Routes = [
  {
    path: '',
    component: QuestionComponent
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    component: AdminComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];



@NgModule({
  declarations: [
    AppComponent,
    QuestionComponent,
    AdminComponent,
    PageNotFoundComponent,
    LoginComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    SwingModule,
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    HttpHelper,
    AuthService,
    AuthGuard,
    QuestionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
