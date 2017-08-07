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
import { ChapterService } from './_services/chapter.service';
import { StatementService } from './_services/statement.service';
import { LoginComponent } from './admin/login/login.component';

import { OverviewComponent } from './admin/overview/overview.component';
import { ChaptersComponent } from './admin/chapters/chapters.component';
import { StatementsComponent } from './admin/statements/statements.component';
import { ResultsComponent } from './admin/results/results.component';
import { ProfilesComponent } from './admin/profiles/profiles.component';



const appRoutes: Routes = [
  {
    path: '',
    component: QuestionComponent
  },
  {
    path: 'admin/login',
    component: LoginComponent
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    component: AdminComponent,
     children: [
      { path: '', component: OverviewComponent },
      { path: 'chapters', component: ChaptersComponent },
      { path: 'profiles', component: ProfilesComponent },
      { path: 'statements', component: StatementsComponent },
      { path: 'results', component: ResultsComponent}
    ]
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
    LoginComponent,
    ChaptersComponent,
    StatementsComponent,
    ResultsComponent,
    OverviewComponent,
    ProfilesComponent
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
    ChapterService,
    StatementService,
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
