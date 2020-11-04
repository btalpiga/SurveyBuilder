import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class ReportsService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(
    private http: HttpClient,
    public router: Router
  ) {
  }


  // LIST
  list(): Observable<any> {
    let api = `/api/reports/list`;
    return this.http.post(api,{})
    .pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.handleError)
    )
  }


    // GET BY SURVEY
    getBySurvey(id): Observable<any> {
      let api = `/api/reports/get`;
      return this.http.post(api,{survey_id:id})
      .pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.handleError)
      )
    }

  

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