import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from './../_models/index';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  login(user: User) {
    if (user.username !== '' && user.password !== '' ) {

      return this.http.post<any>('/api/login', { username: user.username, password: user.password })
      .map(res => {
          // login successful if there's a jwt token in the response
          if (res && res.token) {
              this.loggedIn.next(true);
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              localStorage.setItem('currentUser', JSON.stringify(res));
          }

          return user;
      });
    }
  }

  logout() {
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
}
