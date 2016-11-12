import { Injectable, EventEmitter } from '@angular/core';
import { Http, URLSearchParams, Headers, RequestOptions } from '@angular/http'
import { Subscription } from 'rxjs';

@Injectable()
export class RedditAPIService {

  subscription: Subscription;

  constructor(private http: Http) {
  }

  fetchFrontPageJSON(){
    let headers = new Headers;
    headers.append('Authorization','BEARER ' + localStorage.getItem('access_token'))
    return this.http.get('https://oauth.reddit.com/.json', { headers: headers }).map(function(result){
      console.log(result)
       return result.json()
    })
  }


}