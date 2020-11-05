import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SurveyComponent } from './components/form-builder/survey.component';
import { SurveyCreatorComponent } from './components/form-builder/survey-creator.component';
import { FormBuilderComponent } from './components/form-builder/form-builder.component';
import { ListSurveyModule } from './components/list-survey/list-survey.component';
import { EditSurveyComponent } from './components/edit-survey/edit-survey.component';
import { FillSurveyComponent } from './components/fill-survey/fill-survey.component';
import { DisplaySurveyComponent } from './components/display-survey/display-survey.component';

import { DonutChartComponent } from './components/donut-chart/donut-chart.component';


import {DragDropModule } from '@angular/cdk/drag-drop';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbPaginationModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';



 


import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/authconfig.interceptor';
// import { ShowdownModule } from 'ngx-showdown';


@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    DashboardComponent,
    FormBuilderComponent,
    ListSurveyModule,
    SurveyComponent,
    EditSurveyComponent,
    FillSurveyComponent,
    DisplaySurveyComponent,
    SurveyCreatorComponent,
    DonutChartComponent
  ],
  imports: [
    NgbModule,NgbPaginationModule, NgbAlertModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    DragDropModule,
    // ShowdownModule 
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
