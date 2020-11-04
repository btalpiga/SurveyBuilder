import { Component, Input, Output, EventEmitter } from "@angular/core";
import * as SurveyKo from "survey-knockout";
import * as SurveyCreator from "survey-creator";
import * as widgets from "surveyjs-widgets";

import "inputmask/dist/inputmask/phone-codes/phone.js";
import { SurveyService } from '../../shared/services/survey.service';
import { environment } from '../../../environments/environment';



widgets.icheck(SurveyKo);
widgets.select2(SurveyKo); 
widgets.inputmask(SurveyKo);
// widgets.jquerybarrating(SurveyKo);
widgets.jqueryuidatepicker(SurveyKo);
// widgets.nouislider(SurveyKo);
// widgets.select2tagbox(SurveyKo);
// widgets.signaturepad(SurveyKo);
widgets.sortablejs(SurveyKo);
// widgets.ckeditor(SurveyKo);
widgets.autocomplete(SurveyKo);
// widgets.bootstrapslider(SurveyKo);
widgets.emotionsratings(SurveyKo);

SurveyCreator.StylesManager.applyTheme("default");

var CkEditor_ModalEditor = {
  afterRender: function(modalEditor, htmlElement) {
    var editor = window["CKEDITOR"].replace(htmlElement);
    editor.on("change", function() {
      modalEditor.editingValue = editor.getData();
    });
    editor.setData(modalEditor.editingValue);
  },
  destroy: function(modalEditor, htmlElement) {
    var instance = window["CKEDITOR"].instances[htmlElement.id];
    if (instance) {
      instance.removeAllListeners();
      window["CKEDITOR"].remove(instance);
    }
  }
};
SurveyCreator.SurveyPropertyModalEditor.registerCustomWidget(
  "html",
  CkEditor_ModalEditor
);

@Component({
  selector: "survey-creator",
  template: `
    <div id="surveyCreatorContainer"></div>
  `
})
export class SurveyCreatorComponent {
  surveyCreator: SurveyCreator.SurveyCreator;
  @Input() json: any;
  @Output() surveySaved: EventEmitter<Object> = new EventEmitter();


  
  constructor(
    public surveyService: SurveyService
  ) {}

  
  ngOnInit() {
    SurveyKo.JsonObject.metaData.addProperty(
      "questionbase",
      "popupdescription:text"
    );

    // SurveyKo.Serializer.addProperty("survey", {
    //   name: "dateFormat",
    //   dependsOn: ["inputType"],
    //   visibleIf: function(obj) {
    //     return (
    //       obj.inputType == "date" ||
    //       obj.inputType == "datetime" ||
    //       obj.inputType == "datetime-local"
    //     );
    //   }
    // });
    SurveyKo.JsonObject.metaData.addProperty("page", "popupdescription:text");

    SurveyKo.JsonObject.metaData.addProperty("survey", {
      name:"Date Start:date", type: "date"
  });
    SurveyKo.JsonObject.metaData.addProperty("survey", "Date End:date");



    SurveyKo.JsonObject.metaData.addProperty("brands", "Date End:date");

  SurveyKo.JsonObject.metaData
    .addProperty("brand", {
      name: "region",
      choices: [
          "Africa", "Americas", "Asia", "Europe", "Oceania"
      ],
      category: "Geo Location",
      categoryIndex: 1
  });


    // Survey.Serializer.addProperty("text", {
    //   name: "dateFormat",
    //   category: "general",
    //   visibleIndex: 7,
    //   dependsOn: ["inputType"],
    //   visibleIf: function(obj) {
    //     return (
    //       obj.inputType == "date" ||
    //       obj.inputType == "datetime" ||
    //       obj.inputType == "datetime-local"
    //     );
    //   }
    // });


    // Survey.Serializer.addProperty( "survey", "description:html"))



    let options = { 
      showEmbededSurveyTab: false,
      haveCommercialLicense :true,
       generateValidJSON: true ,
       showJSONEditorTab: false,
       questionTypes: ["text","boolean", "checkbox","rating", "radiogroup", "dropdown","matrix","matrixdropdown"],	
      };
    this.surveyCreator = new SurveyCreator.SurveyCreator(
      "surveyCreatorContainer",
      options
    );
    
    this.surveyCreator
    .toolbox
    .addItem({
        name: "brands",
        isCopied: true,
        category:'',
        iconName: "icon-default",
        title: "All Brands",
        json: {
            "type": "matrixdropdown",
            optionsCaption: "Select ...",
            // choicesByUrl: {
            //     url: "https://restcountries.eu/rest/v2/all"
            // }
            "columns": [
              // {
              //     "name": "using",
              //     "title": "Do you use it?",
              //     "choices": [
              //         "Yes", "No"
              //     ],
              //     "cellType": "radiogroup"
              // },
               {
                  "name": "brand",
                  "title": "Select brand",
                  isRequired: true, 
                  choicesByUrl: {
                        url: '/api/data/brands'
                    }
                //   choices: function (obj, choicesCallback) {

                //     this.surveyService.listBrands()
                //     .subscribe((result) => {
                      
                //       var serverRes = JSON.parse(result);
                //       var res = [];
                //       res.push({value: null});
                //       for (var i = 0; i < serverRes.length; i++) {
                //           var item = serverRes[i];
                //           res.push({value: item, text: item});
                //       }
                //       //return the result into Survey Creator property editor
                //       choicesCallback(res);
                //     }) 
                //     //We are going to use choicesCallback here
                //     // var xhr = new XMLHttpRequest();
                //     // xhr.open("GET", "https://restcountries.eu/rest/v2/all");
                //     // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                //     // //on load event set results into array of ItemValue and tell the Survey Creator that choices are loaded.
                //     // xhr.onload = function () {
                //     //     if (xhr.status === 200) {
                //     //         var serverRes = JSON.parse(xhr.response);
                //     //         var res = [];
                //     //         //We will use ItemValue array here, since we want to have value different from display text
                //     //         //If your value equals to display text, then you may simply return the array of strings.
                //     //         res.push({value: null});
                //     //         for (var i = 0; i < serverRes.length; i++) {
                //     //             var item = serverRes[i];
                //     //             res.push({value: item.alpha2Code, text: item.name});
                //     //         }
                //     //         //return the result into Survey Creator property editor
                //     //         choicesCallback(res);
                //     //     }
                //     // };
                //     // xhr.send();
                // }
                  // "choices": [https://restcountries.eu/rest/v2/region/{region}
                  //     {
                  //         "value": 5,
                  //         "text": "3-5 years"
                  //     }, {
                  //         "value": 2,
                  //         "text": "1-2 years"
                  //     }, {
                  //         "value": 1,
                  //         "text": "less then a year"
                  //     }
                  // ]
              }, 
              {
                "name": "skus",
                "title": "Select SKU",
                isRequired: true, 
                "choices": []
              //   choicesByUrl: {
              //     url: "https://restcountries.eu/rest/v2/region/{brand}"
              // }
            },
              // {
              //     "name": "strength",
              //     "title": "What is main strength?",
              //     "choices": [
              //         "Easy", "Compact", "Fast", "Powerfull"
              //     ],
              //     "cellType": "checkbox"
              // }, {
              //     "name": "knowledge",
              //     "title": "Please describe your experience",
              //     "cellType": "text"
              // }, {
              //     "name": "rate",
              //     "title": "Please rate the framework itself"
              // }
          ],
          "rows": [
              {
                  "value": "brands",
                  "text": "brands"
              }, 
              // {
              //     "value": "angularv2",
              //     "text": "angularjs v2"
              // }, {
              //     "value": "knockoutjs"
              // }, {
              //     "value": "reactjs"
              // }
          ]
        }
    });

    this.surveyCreator.text = JSON.stringify(this.json);
    this.surveyCreator.saveSurveyFunc = this.saveMySurvey;
  }

  saveMySurvey = () => {
    console.log(JSON.stringify(this.surveyCreator.text));
    this.surveySaved.emit(JSON.parse(this.surveyCreator.text));
  };
}