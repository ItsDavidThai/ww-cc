import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { RedditAPIService } from '../services/redditAPIService/redditAPI.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
/*
  This is main component that holds the nav bar and thread feed
*/
@Component({
  selector: 'app-home-component',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  // oberservable to check initial url redirect for auth code
  private subscription: Subscription;
  // array to hold threads/posts
  private threadData: Array<Object>;
  // next page variable
  private after: String;
  // keep track of which feed the user is currently on
  private currentFeed: String;

  /*
    Service injection declarations
  */
  constructor(private authService: AuthService,
              private route: ActivatedRoute,
              private redditAPI: RedditAPIService) {}
  /*
    ngOnInit and ngOnDestroy are component lifecycle hooks
    ngOnInit runs when the component loads
    ngOndestroy runs when the component ends
  */
  ngOnInit() {
    // save this context
    let that = this;
    // subscribe to router event that checks when the redirect url comes back with auth code
    this.subscription = this.route.queryParams.subscribe(function(param) {
      if(param['code']){
        that.authService.ngGetAccessToken(param['code'])
      }
    })
    // after the user signs in checks to see if there was a access token change
    // if there is load the front page
    this.authService.accessToken.subscribe(function(result) {
      if(result) {
        that.loadFeed();
      }
    })
    // if the user refreshes the page but does not log back in
    // check to see if there is an access token already
    // if there is load the front page
    if(localStorage.getItem('access_token')) {
      that.loadFeed()
    }

  }
  // when component is destroyed remove subscriptions to prevent memory leaks
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.authService.accessToken.unsubscribe();
  }
  /*
    will populate the page with a different feed
    name - different feed types and subreddit names
    if no name is given will default to front page
  */
  loadFeed(name = "") {
    // save this context
    let that = this
    // use redditAPI service to grab the feed data
    this.redditAPI.fetchFeedJSON(name).subscribe(function(result) {
      // set threadData to the result
      that.threadData = result.data.children
      // set new after
      that.after = result.data.after
      // keep track of current feed
      that.currentFeed = name;
      // go through each item in threadData
      that.threadData.forEach(function(thread) {
        // set the comment link and the subreddit link to be used by child components
        thread.data.permalink = 'https://www.reddit.com' + thread.data.permalink
        thread.data.subreddit = 'r/' + thread.data.subreddit
      })
    })
  }
  /*
    when the end of the page is reached send, this function is called and the reddit api service sends a request for the next page
  */
  loadNextPage() {
    // save this context
    let that = this
    // this.currentFeed and this.after are saved when the feeds are loaded
    this.redditAPI.fetchNextPage(this.currentFeed, this.after).subscribe(function(result){
      // set new after
      that.after = result.data.after
      // go through each item in threadData
      result.data.children.forEach(function(thread){
        // set the comment link and the subreddit link to be used by child components
        thread.data.permalink = 'https://www.reddit.com' + thread.data.permalink
        thread.data.subreddit = 'r/' + thread.data.subreddit
      })
      // concat the old results with the new page threads
      that.threadData = that.threadData.concat(result.data.children)
    })
  }

}
