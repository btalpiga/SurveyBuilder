import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';


@Injectable({
  providedIn: 'root'
})

export class AnswerService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(
    private http: HttpClient,
    public router: Router,
    private route: ActivatedRoute
  ) {
  }

  // SAVE
  updateAccesCounter( currentConsumer, currentSurvey): Observable<any> {
    var pipe = new DatePipe('en-US'); // Use your own locale
    const now = Date.now();
    const myFormattedDate = pipe.transform(now, 'short');

    let api = `/api/answer/update-acces`;
    return this.http.post(api, {
      survey_id:currentSurvey,
      consumer_id: currentConsumer,
      updatedAt:myFormattedDate
    })
      .pipe(
        catchError(this.handleError)
      )
  }
    // LIST
    listBySurvey(surveyId): Observable<any> {
      let api = `/api/answer/find-by-survey`;
      return this.http.post(api,{survey_id:surveyId})
      .pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.handleError)
      )
    }

  // SAVE
  save(answer,progress,  currentConsumer, currentSurvey): Observable<any> {
    var pipe = new DatePipe('en-US'); // Use your own locale
    const now = Date.now();
    const myFormattedDate = pipe.transform(now, 'short');
// console.log('====progress====',progress+'');

    let api = `/api/answer/save`;
    return this.http.post(api, {
      survey_id:currentSurvey,
      consumer_id: currentConsumer,
      answer:JSON.stringify(answer),
      progress:progress+'',
      createdAt:myFormattedDate,
      updatedAt:myFormattedDate,
      flags:'1'
    })
      .pipe(
        catchError(this.handleError)
      )
  }

   // SAVE
   get(currentConsumer, currentSurvey): Observable<any> {
  
    let api = `/api/answer/get`;
    return this.http.post(api, {
      survey_id:currentSurvey+'',
      consumer_id: currentConsumer+'',
    })
    .pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.handleError)
    )
  }

  // SAVE
  getAccesTimes( currentSurvey): Observable<any> {
  
    let api = `/api/reports/accessed-times-count`;
    return this.http.post(api, {
      survey_id:currentSurvey+''
    })
    .pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.handleError)
    )
  }

  // update(survey: Survey, idSurvey): Observable<any> {      
  //   let api = `/api/survey/update`;
  //   console.log('survey service-UPDATE',api,{survey:survey, id: idSurvey});
  //   return this.http.post(api, {survey:survey, id: idSurvey})
  //     .pipe(
  //       catchError(this.handleError)
  //     )
  // }

  // // LIST
  // list(): Observable<any> {
  //   let api = `/api/survey/list`;
  //   return this.http.post(api,{})
  //   .pipe(
  //     map((res: Response) => {
  //       return res || {}
  //     }),
  //     catchError(this.handleError)
  //   )
  // }

  //   // SAVE
  //   get(id): Observable<any> {
  //     let api = `/api/survey/get`;
  //     return this.http.post(api,{id:id})
  //     .pipe(
  //       map((res: Response) => {
  //         return res || {}
  //       }),
  //       catchError(this.handleError)
  //     )
  //   }

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