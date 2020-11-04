import { Component, OnInit,ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { SurveyService } from './../../shared/services/survey.service';
import { ReportsService } from './../../shared/services/reports.service';
import { AnswerService } from './../../shared/services/answer.service';

import { ViewChild } from '@angular/core';
import { DonutChartComponent } from './../donut-chart/donut-chart.component';
import { Router } from '@angular/router';

import { Input, EventEmitter, Output } from "@angular/core";
import * as Survey from "survey-angular";
import * as SurveyAnalytics from "survey-analytics";

import { DynamicScriptLoaderService } from '../../shared/services/script-loader.service';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  currentUser: Object = {};
  countries$: [{id:0,form:'{}'}];
  @ViewChild('ordersByStatusChart', { static: true }) chart: DonutChartComponent;


  chartData: number[] = [];
  showConsumers:boolean=false;
//   HOBBITON={
//   "city": "shining-on-the-hill",
//   "orderStates": [
//     {
//       "state": "preparing",
//       "stateDisplayValue": "Preparing",
//       "count": 10
//     },
//     {
//       "state": "ready",
//       "stateDisplayValue": "Ready",
//       "count": 10
//     },
//     {
//       "state": "inTransit",
//       "stateDisplayValue": "Out for delivery",
//       "count": 10
//     },
//     {
//       "state": "delivered",
//       "stateDisplayValue": "Delivered",
//       "count": 10
//     }



//   ]
// }
// document;
// private loadScripts() {
//   // You can load multiple scripts by just providing the key as argument into load method of the service
//   this.dynamicScriptLoader.load('typedarray','knockout', 'Chart', 'd3','c3','plotly', 'wordcloud2','analytics', 'polyfill' )
//   .then(data => {
//     // Script Loaded Successfully
//   }).catch(error => console.log(error));
// }

  constructor(
    public surveyService: SurveyService,
    public answerService: AnswerService,
    public reportsService: ReportsService,
    public router: Router,
    // private dynamicScriptLoader: DynamicScriptLoaderService
    // @Inject(DOCUMENT) document
  ) {
    var that = this;
    // this.loadScripts();
    // that.document = document;
    that.countries$ =[{id:0,form:'{}'}];
  }

  ngOnInit() {
    
   }

  //  ngAfterContentInit() {

  //   var that =this;
  //   this.surveyService.list().subscribe((res) => {

  //       console.log(res);
  //       that.countries$ =res;

  //       console.log('ngAfterContentInit');
  //       this.generateData(this.countries$[0].id);
  //       this.chart.data = [...this.chartData];
       
  //   }) 
    
  // }
consumers=[]; 
responsesPerSurvey =[];
 orderStates = []; 
currentSurveySelected=0;
getSurveyResponses(dbAnswerList){
  let srvAnswers=[];
  for(let index=0;index<dbAnswerList.length;index++){
    let jsonO= JSON.parse(dbAnswerList[index].answer);
    srvAnswers.push(jsonO.data);
  }
  return srvAnswers;
}

  getConsumers(survey_id){
    var that = this;
    that.currentSurveySelected=survey_id;
    this.answerService.listBySurvey(survey_id).subscribe((res) => {
      that.responsesPerSurvey=res;
      that.consumers=res.map(user => user.consumer_id);
      that.showConsumers=true;
      that.getAnalytics(survey_id);
     
  }) 
  }

  goToSurvey(consumer_id){
    // console.log(consumer_id);
    this.router.navigate(['display-survey/'+this.currentSurveySelected+'/'+consumer_id]);
  }
  surveyAcces={m:0,me:0,ma:0};
  reportUpdated:Date;

  getQuestionsType(form){
    var pagesA=form.pages;
    let questionsTypes=[];
    // console.log('getQuestionsType',form);
    for(let idx=0;idx<pagesA.length;idx++){
      let elementsA=pagesA[idx].elements;
          // console.log('getQuestionsType 22',elementsA);
    if(elementsA && elementsA.length >0 ){
      for(let idxx=0;idxx<elementsA.length;idxx++){
        questionsTypes.push({
          name:elementsA[idxx].name,
          type:elementsA[idxx].type
        });
      }
    }
    }
    return questionsTypes;
  }
  getNewQs(qs,types){
    var newQA=[];
    for(let idx=0;idx<qs.length;idx++){
      if(types[idx].type=='matrixdropdown'){

      }else{
        newQA.push(qs[idx]);
      }
    }
    return newQA;
  }
  getAnalytics(surveyId){

    var surveyResultNode = document.getElementById("surveyResult");
    surveyResultNode.innerHTML = "";

    let srv = this.countries$.filter(function(itm){
      return itm.id ==surveyId;
    });
    var formObject =JSON.parse(srv[0].form);
    var questionTypes=this.getQuestionsType(formObject);
   var survey = new Survey.SurveyModel(formObject);
   var newData =[];
   for(var idx =0 ; idx< this.responsesPerSurvey.length;idx++){
     var jObj=JSON.parse(this.responsesPerSurvey[idx].answer);
     newData.push(jObj.data);
   }
   var data = this.getSurveyResponses( this.responsesPerSurvey);
  //  console.log('S URVEY MODEL -->', newData,questionTypes);

    // $.get("/api/MySurveys/getSurveyNPCResults/", function (data) {
        var normalizedData = newData
            // .Data
            .map(function (item) {
                // survey
                //     .getAllQuestions()
                questionTypes
                    .forEach(function (q) {
                      var sName ='';
                      try{
                        // sName=q.cellType;
                      }catch(ee){}
                      // console.log('--q--',q,q.type =='matrixdropdown');
                        if (item[q.name] === undefined || q.type =='matrixdropdown') {
                            item[q.name] = "";
                        }
                    });
                return item;
            });
            var newQs = this.getNewQs(survey.getAllQuestions(),questionTypes);
// console.log('HTML ELEMENT ==<><><>',surveyResultNode,normalizedData);
        var visPanel = new SurveyAnalytics.VisualizationPanel(surveyResultNode, 
         newQs,
           normalizedData);
        visPanel.render();
    // });
  }
   generateData(surveyId) {
     var that=this;

    
     this.getConsumers(surveyId); //o s ail scoatem cumva de aici 
     this.answerService.getAccesTimes(surveyId)
     .subscribe((accesses) => {
      // console.log('accesses==>',accesses);
      that.surveyAcces=accesses[0];
  }) 
      // console.log(this.countries$,surveyId);
    
     // EO survey results data object
 
    //  var normalizedData = data.map(function(item) {
    //    survey.getAllQuestions().forEach(function(q) {
    //      if (item[q.name] === undefined) {
    //        item[q.name] = "";
    //      }
    //    });
    //    return item;
    //  });
    //  console.log(survey.getAllQuestions(), data);
 
    //  var visPanel = new SurveyAnalytics.VisualizationPanel(
    //   this.surveyAnalyticsContainer.nativeElement.innerHTML,
    //    survey.getAllQuestions(),
    //    normalizedData
    //  );
    //  visPanel.render();
   


    //  ===============END ANALYTICS
    // let orderStates = [];
    var that =this;
    this.reportsService.getBySurvey(surveyId)
    .subscribe((report) => {
    //   console.log('---REPORTS---',report,report.generated_links,report.accessed_links);
      let generated = parseInt(report.generated_links);
      let accessed = parseInt(report.accessed_links);
      that.reportUpdated = report.updatedAt;

      that.chartData = [];

      const accessedObj ={
        state : 'accessed',
        stateDisplayValue : 'accessed',
        count :accessed
      };
      that.orderStates.push(accessedObj);
      that.chartData.push(accessedObj.count);


      const generatedObj ={
        state : 'Generated',
        stateDisplayValue : 'Generated',
        count :generated-accessed
      };
      that.orderStates.push(generatedObj);
      that.chartData.push(generatedObj.count);
   
  
    this.chart.data = [...this.chartData];
    this.chart.createChart(this.chartData);
    });
  }

  displayForm(survey_id,consumer_id){
    // console.log(survey_id);
    this.router.navigate(['display-survey/'+survey_id]);  }
   

  



  // =======================
  ngAfterContentInit() {
    var that =this;
      this.surveyService.list().subscribe((res) => {

          that.countries$ =res;
          this.initialize();
         
      }) 
  
  }
  initialize() {
  
    this.generateData(this.countries$[0].id);
    // this.chart.data = [...this.chartData];


  }

}