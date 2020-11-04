import { Injectable } from '@angular/core';
import { User } from './user';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(
    private http: HttpClient,
    public router: Router
  ) {
  }

  // Sign-up
  signUp(user: User): Observable<any> {
    let api = `/api/signup`;
    return this.http.post(api, user)
      .pipe(
        catchError(this.handleError)
      )
  }

  // Sign-in
  signIn(user: User) {
    console.log(user,this.headers);
    return this.http.post(`/api/signin`, user)
      .subscribe((res: any) => {
        console.log(res);
        localStorage.setItem('access_token', res.token);
        localStorage.setItem('current_username', user.username+'');
        localStorage.setItem('orrHash', res.orr);
        if(res.orr==1){
          this.router.navigate(['survey']);
        }else  if(res.orr==2){
          this.router.navigate(['dashboard']);
        }
        // this.getUserProfile(res._id).subscribe((res) => {
        //   this.currentUser = res;
         
        // })
      })
  }

   isAdmin() {
   var role=  localStorage.getItem('orrHash');
   return role=='1';
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }

  doLogout() {
    let removeToken = localStorage.removeItem('access_token');
    localStorage.removeItem('current_username');
    localStorage.removeItem('orrHash');
    if (removeToken == null) {
      this.router.navigate(['log-in']);
    }
  }

  // User profile
  // getUserProfile(id): Observable<any> {
  //   let api = `/api/user-profile/${id}`;
  //   return this.http.get(api, { headers: this.headers }).pipe(
  //     map((res: Response) => {
  //       return res || {}
  //     }),
  //     catchError(this.handleError)
  //   )
  // }

  // Error 
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}