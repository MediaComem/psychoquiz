import { BrowserModule } from '@angular/platform-browser';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';

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
import { ProfileService } from './_services/profile.service';
import { StatementService } from './_services/statement.service';
import { ParticipationService } from './_services/participation.service';
import { TinderService } from './_services/tinder.service';



import { LoginComponent } from './admin/login/login.component';
import { OverviewComponent } from './admin/overview/overview.component';
import { ChaptersComponent } from './admin/chapters/chapters.component';
import { StatementsComponent } from './admin/statements/statements.component';
import { StatisticsComponent } from './admin/statistics/statistics.component';
import { ResultsComponent } from './results/results.component';
import { ProfilesComponent } from './admin/profiles/profiles.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ChapterComponent } from './chapter/chapter.component';
import { LinkProfilesComponent } from './admin/statements/link-profiles/link-profiles.component';



const appRoutes: Routes = [
  { path: '',   redirectTo: '/start', pathMatch: 'full' },
  {
    path: 'situation',
    component: ChapterComponent // single random chapter (intro)
  },
  {
    path: 'situation/tdr',
    component: QuestionComponent
  },
  {
    path: 'results',
    component: ResultsComponent
  },
  {
    path: 'start',
    component: WelcomeComponent
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
      { path: 'situations', component: ChaptersComponent },
      { path: 'profiles', component: ProfilesComponent },
      { path: 'statements', component: StatementsComponent },
      { path: 'statements/:id', component: LinkProfilesComponent},
      { path: 'statistics', component: StatisticsComponent}
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
    ProfilesComponent,
    WelcomeComponent,
    ChapterComponent,
    StatisticsComponent,
    LinkProfilesComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    SwingModule,
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ]),    
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    HttpHelper,
    ChapterService,
    ProfileService,
    StatementService,
    AuthService,
    ParticipationService,
    TinderService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
