import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { AuthService } from './services/auth/auth.service';
import { RedditAPIService } from './services/redditAPIService/redditAPI.service'
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HomeService } from './home/home.service';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { ThreadComponent } from './home/thread/thread.component';
import { TopMenuComponent } from './home/top-menu/top-menu.component';
/*
  Services, Modules, and Entry Point are declared here
*/
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ThreadComponent,
    TopMenuComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([{path:'', component: HomeComponent}]),
    InfiniteScrollModule
  ],
  providers: [AuthService, RedditAPIService, HomeService],
  bootstrap: [AppComponent]
})
export class AppModule {}
