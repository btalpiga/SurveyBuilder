import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import * as Survey from 'survey-angular';
import * as widgets from 'surveyjs-widgets';
import * as SurveyPDF from 'survey-pdf';
import 'inputmask/dist/inputmask/phone-codes/phone.js';

import { AnswerService } from '../../shared/services/answer.service';
import { SurveyService } from '../../shared/services/survey.service';
import { Router, ActivatedRoute ,NavigationStart } from '@angular/router';
import { environment } from '../../../environments/environment';
// import * as Showdown from 'showdown';


widgets.icheck(Survey);
widgets.select2(Survey);
widgets.inputmask(Survey);
widgets.jquerybarrating(Survey);
widgets.jqueryuidatepicker(Survey);
widgets.nouislider(Survey);
widgets.select2tagbox(Survey);
widgets.signaturepad(Survey);
widgets.sortablejs(Survey);
widgets.ckeditor(Survey);
widgets.autocomplete(Survey);
widgets.bootstrapslider(Survey);
widgets.prettycheckbox(Survey);
//widgets.emotionsratings(Survey);


//CSS CLASS 
var myCss = {
  root: "cotizador center-block aligncenter",
	header: "panel-heading",
	footer: "panel-footer",
  body:"panel-body",
  matrix: {
      root: "table table-striped kk"
  },
  navigationButton: "button btn-lg"
};

Survey.JsonObject.metaData.addProperty('questionbase', 'popupdescription:text');
Survey.JsonObject.metaData.addProperty('page', 'popupdescription:text');


// Survey.defaultBootstrapMaterialCss.body = "bodyImage";
// Survey.defaultBootstrapMaterialCss.navigationButton = "btn btn-green";
// Survey.defaultBootstrapMaterialCss.rating.item = "btn btn-default my-rating";

Survey.StylesManager.applyTheme("default");

@Component({
  // tslint:disable-next-line:component-selector
  styleUrls: ["./form-builder.component.css"],
  selector: 'survey',
  template: `<div class='survey-container contentcontainer codecontainer'><div id='surveyElement'></div></div>`
})
export class SurveyComponent implements OnInit {
  @Output() submitSurvey = new EventEmitter<any>();
  @Output() nextPageSurvey = new EventEmitter<any>();

  @Input()
  json: object;
  result: any;

  constructor(
    public answerService: AnswerService,
    public surveyService: SurveyService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  surveyId =0;
  consumerId=0;

  ngOnInit() {
    const surveyModel = new Survey.Model(this.json);
    let that = this;

    that.surveyId= this.route.snapshot.params.id;
    that.consumerId= this.route.snapshot.params.customerid;

    surveyModel.onAfterRenderQuestion.add((survey, options) => {
      if (!options.question.popupdescription) { return; }

      // Add a button;
      const btn = document.createElement('button');
      btn.className = 'btn btn-info btn-xs';
      btn.innerHTML = 'More Info';
      btn.onclick = function () {
        // showDescription(question);
        alert(options.question.popupdescription);
      };
      const header = options.htmlElement.querySelector('h5');
      const span = document.createElement('span');
      span.innerHTML = '  ';
      header.appendChild(span);
      header.appendChild(btn);
    });

    surveyModel
    .onUpdateQuestionCssClasses
    .add(function (survey, options) {
        var classes = options.cssClasses

        classes.root = "sq-root";
        classes.title = "sq-title"
        classes.item = "sq-item";
        classes.label = "sq-label";

        if (options.question.isRequired) {
            classes.title += " sq-title-required";
            classes.root += " sq-root-required";
        }

        if (options.question.getType() === "checkbox") {
            classes.root += " sq-root-cb";
        }
    });
    surveyModel.onComplete
      .add((result, options) => {

        this.submitSurvey.emit(result);
        this.result = result.data;
      }
      );

      // var converter = new Showdown.Converter();
      surveyModel
          .onTextMarkdown
          .add(function (survey, options) {
              //convert the mardown text to html
              console.log('onTextMarkdown--------',options.text);
              console.log('onTextMarkdown 222--------',options.text);

		    window.scrollTo(0, 0);
		window.scroll(0,0);

              // var str = converter.makeHtml(options.text);
              // //remove root paragraphs <p></p>
              // str = str.substring(3);
              // str = str.substring(0, str.length - 4);
              // //set html
              options.html = options.text;
          });

      // surveyModel
      // .onMatrixCellValueChanging.add(function(sender, options) {
      //   console.log(sender, options);
      //   // if(options.columnName !=="brand") return;
      //   // var choices = [];
      //   // var newValue = options.value ? options.value : [];
      //   // for(var i = 0; i < newValue.length; i ++) {
      //   //   choices.push(newValue[i]);
      //   // }
      //   // options.getCellQuestion("selectCars").choices = choices;
      // });
      surveyModel
      .onMatrixCellValueChanged.add(function(sender, options) {
        console.log(sender, options);
        if(options.columnName !=="brand") return;
        var choices = [];


        that.surveyService.listSku(options.value)
          .subscribe((result) => {
            var newValue =  result;
            for(var i = 0; i < newValue.length; i ++) {
              choices.push(newValue[i].Product);
            }
            options.getCellQuestion("skus").choices = choices;
          }) 

      
      });

      surveyModel
    .onCurrentPageChanged
      .add(function (result, options) {
          that.nextPageSurvey.emit(that.saveState(result));
          this.result = result.data;
    window.scrollTo(0, 0);

      });
      
    // surveyModel.onCurrentPageChanging
    // .add((result, options) => {
    //   that.nextPageSurvey.emit(result);
    //   that.result = result.data;
    // }
    // );
      that.loadState(surveyModel);
       
    Survey.SurveyNG.render('surveyElement', { model: surveyModel
      // ,	css: myCss 
    });
  }



  loadState(survey) {
    //Here should be the code to load the data from your database
    var storageSt = "";

    this.answerService.get(this.consumerId,this.surveyId)
    .subscribe((result) => {
      // console.log('-------AAAAAAAAAAAAAAAAAAAAAAAA---------',result);
      var res = {
        currentPageNo:0,
        data:{}
      };
      if (result) 
          res = JSON.parse(result.answer); //Create the survey state for the demo. This line should be deleted in the real app.
  
      
      //Set the loaded data into the survey.
      if (res.currentPageNo) 
          survey.currentPageNo = res.currentPageNo;
      if (res.data) 
          survey.data = res.data;
    }) 


    }

  saveState(survey) {
    var res = {
        currentPageNo: survey.currentPageNo,
        data: survey.data
    };
    return res;
    //Here should be the code to save the data into your database
    // window
    //     .localStorage
    //     .setItem(storageName, JSON.stringify(res));
}
  savePDF() {
    var options = {
      fontSize: 14,
      margins: {
        left: 10,
        right: 10,
        top: 10,
        bot: 10
      }
    };
    const surveyPDF = new SurveyPDF.SurveyPDF(this.json, options);
    console.log(this.result);
    surveyPDF.data = this.result;
    surveyPDF.save("survey PDF example");
  }
}