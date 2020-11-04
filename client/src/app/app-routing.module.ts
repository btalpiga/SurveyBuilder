import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormBuilderComponent } from './components/form-builder/form-builder.component';
import { EditSurveyComponent } from './components/edit-survey/edit-survey.component';
import { ListSurveyModule } from './components/list-survey/list-survey.component';
import { FillSurveyComponent } from './components/fill-survey/fill-survey.component';
import { FillResolverService } from './components/fill-survey/fill-survey-resolve.service';
import { DisplaySurveyComponent } from './components/display-survey/display-survey.component';




import { AuthGuard } from "./shared/auth.guard";


const routes: Routes = [
  { path: '', redirectTo: '/log-in', pathMatch: 'full' },
  { path: 'log-in', component: SigninComponent },
  { path: 'sign-up', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'survey', component: FormBuilderComponent, canActivate: [AuthGuard] },
  { path: 'edit-survey/:id', component: EditSurveyComponent, canActivate: [AuthGuard] ,
  resolve: {
    userdata: FillResolverService
  }},
  { path: 'list-survey', component: ListSurveyModule, canActivate: [AuthGuard] },
  { path: 'fill-survey/:id/:customerid', component: FillSurveyComponent,
  resolve: {
    userdata: FillResolverService
  }},
  { path: 'display-survey/:id/:customerid', component: DisplaySurveyComponent,
  resolve: {
    userdata: FillResolverService
  }
}



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
