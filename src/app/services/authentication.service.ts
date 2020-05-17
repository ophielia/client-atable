import {Inject, Injectable} from "@angular/core";
import {Headers, Response} from "@angular/http";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import {throwError} from "rxjs";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {APP_CONFIG, AppConfig} from "../app.config";
import {User} from "../model/user";
import MappingUtils from "../model/mapping-utils";

@Injectable()
export class AuthenticationService {
  private authUrl;
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private httpClient: HttpClient,@Inject(APP_CONFIG) private config: AppConfig) {
    this.authUrl = this.config.apiEndpoint + "auth";
  }

  login(username: string, password: string): Observable<boolean> {
    var httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'Location',
      })
    }
    return this.httpClient.post(this.authUrl, JSON.stringify({
      username: username,
      password: password
    }), httpOptions)
      .map((response: HttpResponse<any>) => {
        // login successful if there's a jwt token in the response
        let user = this.mapUser(response);
        let token = response["token"];
        if (user) {
          // store username and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));

          // return true to indicate successful login
          return true;
        } else {
          // return false to indicate failed login
          return false;
        }
      }).catch((error: any) => throwError(error.json().error || 'Server error'));
  }

  getToken(): String {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    var token = currentUser && currentUser.token;
    return token ? token : "";
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }

  // ...
  public isAuthenticated(): boolean {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    var token = currentUser && currentUser.token;
    // true or false
    //return !this.jwtHelper.isTokenExpired(token);
    return token != null

  }

  public isAdmin(): boolean {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
  return currentUser.roles.includes('ROLE_ADMIN');
}

private mapUser(object: Object): User {
    return MappingUtils.toUser(object);
  }

}
