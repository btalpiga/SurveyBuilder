import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class SurveyService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(
    private http: HttpClient,
    public router: Router
  ) {
  }

  // SAVE
  save(survey): Observable<any> {
    let api = `/api/survey/save`;
    console.log('survey service-SAVE',api,survey);
    return this.http.post(api, survey)
      .pipe(
        catchError(this.handleError)
      )
  }

  update(survey, idSurvey): Observable<any> {
    let api = `/api/survey/update`;
    console.log('survey service-UPDATE',api,{survey:survey, id: idSurvey});
    return this.http.post(api, {survey:survey, id: idSurvey})
      .pipe(
        catchError(this.handleError)
      )
  }

  // LIST
  list(): Observable<any> {
    let api = `/api/survey/list`;
    return this.http.post(api,{})
    .pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.handleError)
    )
  }



   // LIST Brands
   listBrands(): Observable<any> {
    let api = `/api/data/brands`;
    return this.http.post(api,{})
    .pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.handleError)
    )
  }

  // LIST Sku
  listSku(brand): Observable<any> {
    let api = `/api/data/sku`;
    return this.http.post(api,{brand:brand})
    .pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.handleError)
    )
  }

    // SAVE
    get(id): Observable<any> {
      let api = `/api/survey/get`;
      return this.http.post(api,{id:id})
      .pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.handleError)
      )
    }

     // GENERATE LINKS
     generate_links(id,consumer_ids): Observable<any> {
      let api = `/api/survey/generate-link-bulk`;
      return this.http.post(api,{id:id,
      consumer_ids:consumer_ids
    })
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