import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { take, map } from 'rxjs/operators';

import { SurveyService } from '../../shared/services/survey.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FillResolverService implements Resolve <Observable<any>>{

  constructor(public surveyService: SurveyService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    console.log('--route param--',route.params.id);
   return this.surveyService.get(route.params.id)
   .pipe(
      take(1),
      map(userdata => userdata)
    )
  }
}