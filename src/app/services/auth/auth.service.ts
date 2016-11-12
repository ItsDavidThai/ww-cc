import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { RedditAPIService } from '../redditAPIService/redditAPI.service';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AuthService {
  accessToken = new BehaviorSubject(null);
  constructor(private http: Http, private redditAPI: RedditAPIService) {}

  ngGetAccessToken(code){
    let that = this;
    let params: URLSearchParams = new URLSearchParams();
    params.set('code', code)
    return this.http.get('/services/getAccessToken', {search:params}).subscribe(function(res){
      let token = res.json().access_token;
      sessionStorage.setItem('access_token',token);
      that.redditAPI.accessToken = token;
      that.accessToken.next(token)
      console.log(that.redditAPI.accessToken, that.accessToken.getValue())
    })
  }

  ngGetToken(){
    return sessionStorage.getItem('access_token')
  }



}
