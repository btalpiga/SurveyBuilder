import { Component } from "@angular/core";
import { AnswerService } from '../../shared/services/answer.service';
import { Router, ActivatedRoute ,NavigationStart } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PagesEditor } from 'survey-creator';
// import { Page } from 'tns-core-modules/ui/page';


@Component({
  selector: "fill-builder",
  templateUrl: "./fill-survey.component.html",
  styleUrls: ["./fill-survey.component.css"]
})
export class FillSurveyComponent {

  constructor(
    public answerService: AnswerService,
    public router: Router,
    // private page: Page,
    private route: ActivatedRoute
  ) {
   
     this.totalNoQuestions = this.getTotalNoQuestion(JSON.parse(this.route.snapshot.data.userdata.form));
     this.totalNoPages = JSON.parse(this.route.snapshot.data.userdata.form).pages.length-1;

     console.log('--route param--',JSON.parse(this.route.snapshot.data.userdata.form)  );
     this.json=JSON.parse(this.route.snapshot.data.userdata.form);
 
     this.currentSurvey=this.route.snapshot.params.id;
     this.currentConsumer=this.route.snapshot.params.customerid;

     this.answerService.updateAccesCounter( this.currentConsumer, this.currentSurvey).subscribe((res) => {
      console.log(res);
     }) 
   }
 currentSurvey=0;
 currentConsumer=0;
 totalNoQuestions=0;
 totalNoPages=0;

 private routeSub:any; 

 getTotalNoQuestion(survey){
    var pages =survey.pages;
    console.log('---------- MAX PAGES NO -------- +++',pages);
    let qs=0;
    try{
        for(let idx=0; idx < pages.length ; idx++){
          qs+=pages[idx].elements.length;
        }
    }catch(ex){

    }
    return qs;
 }

  ngOnInit() {
    var that = this;
  
    // this.surveyService.get(this.route.snapshot.params.id)
    // .subscribe((res) => {
    //   console.log(res);
    //     this.json=JSON.parse(res.form);
    // }) 
    this.routeSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // save your data
        console.log("EXIT PAGE !!!!");
        alert("EXIT PAGEEE !!!");
      }
    });
    // this.page.on('navigatingTo', (data) => {
    //   // run init code
    //   // (note: this will run when you either move forward or back to this page)
    // })
  
    // this.page.on('navigatingFrom', (data) => {
    //   // run destroy code
    //   // (note: this will run when you either move forward to a new page or back to the previous page)
    // })
  }
  public ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
  json ={};//=JSON.parse(this.route.snapshot.data.userdata.form);


  sendData(result) {
    console.log(result.currentPageNo,result.data);
    this.answerService.save({
      currentPageNo:result.currentPageNo,
      data:result.data
    } , 
    // '50'
    // (Object.keys(result.data).length/this.totalNoQuestions)*100
    (result.currentPageNo+1)*100/this.totalNoPages
    ,
    this.currentConsumer, this.currentSurvey).subscribe((res) => {
   console.log(res);
  }) 
  }

  nextPageSurveyData(result) {
    // console.log(result.currentPageNo,result.data);
    // return;
    window.scrollTo(0, 0);
   if(Object.keys(result.data).length >0){
   this.answerService.save({
    currentPageNo:result.currentPageNo,
    data:result.data
   } ,  
  //  '50'
  //  (Object.keys(result.data).length/this.totalNoQuestions)*100
  (result.currentPageNo+1)*100/this.totalNoPages

   , this.currentConsumer, this.currentSurvey).subscribe((res) => {
    console.log(res);
   }) 
  }
  }
}
