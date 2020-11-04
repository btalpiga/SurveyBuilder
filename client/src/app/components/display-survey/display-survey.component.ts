import { Component } from "@angular/core";
import { AnswerService } from '../../shared/services/answer.service';
import { Router, ActivatedRoute ,NavigationStart } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PagesEditor } from 'survey-creator';
// import { Page } from 'tns-core-modules/ui/page';


@Component({
  selector: "display-builder",
  templateUrl: "./display-survey.component.html",
  styleUrls: ["./display-survey.component.css"]
})
export class DisplaySurveyComponent {

  constructor(
    public answerService: AnswerService,
    public router: Router,
    // private page: Page,
    private route: ActivatedRoute
  ) {
   
   
     this.json=JSON.parse(this.route.snapshot.data.userdata.form);
 
     this.currentSurvey=this.route.snapshot.params.id;
     this.currentConsumer=this.route.snapshot.params.customerid;

   }
 currentSurvey=0;
 currentConsumer=0;
 private routeSub:any; 

  ngOnInit() {
    var that = this;

  }
  public ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
  json ={};

}
