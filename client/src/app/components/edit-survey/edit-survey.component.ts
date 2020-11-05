import { Component } from "@angular/core";
import { SurveyService } from '../../shared/services/survey.service';
import { Router, ActivatedRoute  } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: "edit-builder",
  templateUrl: "./edit-survey.component.html",
  styleUrls: ["./edit-survey.component.css"]
})
export class EditSurveyComponent {

  constructor(
    public surveyService: SurveyService,
    public router: Router,
    private route: ActivatedRoute
  ) {
    //  console.log('--route param--',this.route.snapshot.params.id);
    this.currentId = this.route.snapshot.params.id;
    this.json=JSON.parse(this.route.snapshot.data.userdata.form);
      // this.surveyService.get(this.route.snapshot.params.id)
      // .subscribe((res) => {
      //   console.log(res);
      //     this.json=JSON.parse(res.form);
      // }) 

  }
currentId=0;
  // ngOnInit() {
  //   this.surveyService.get(this.route.snapshot.params.id)
  //   .subscribe((res) => {
  //     console.log(res);
  //       this.json=JSON.parse(res.form);
  //   }) 
  // }
  // ======================================
  // todo = [
  //   'Input',
  //   'Checkbox',
  //   'Radio Group',
  //   'Rating',
  //   'Matrix'
  // ];

  // done = [
   
  // ];

  // drop(event: CdkDragDrop<string[]>) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(event.previousContainer.data,
  //                       event.container.data,
  //                       event.previousIndex,
  //                       event.currentIndex);
  //                       this.todo = [
  //                         'Input',
  //                         'Checkbox',
  //                         'Radio Group',
  //                         'Rating',
  //                         'Matrix'
  //                       ];
  //   }
  // }
  // ======================================
  // title = "Survey Builder";
  json = {};
  //   title: "Product Feedback Survey Example",
  //   showProgressBar: "top",
  //   pages: [
  //     {
  //       elements: [
  //         {
  //           type: "text",
  //           inputMask: "phone",
  //           popupdescription: "Some text"
  //         },
  //         {
  //           type: "barrating",
  //           name: "barrating",
  //           ratingTheme: "css-stars",
  //           choices: [1, 2, 3, 4, 5]
  //         },
  //         {
  //           type: "bootstrapslider",
  //           name: "bootstrapslider"
  //         },
  //         {
  //           type: "radiogroup",
  //           name: "prettycheckbox",
  //           renderAs: "prettycheckbox",
  //           choices: ["One", "Two", "Three"]
  //         },
  //         {
  //           type: "dropdown",
  //           renderAs: "select2",
  //           choicesByUrl: {
  //             url: "https://restcountries.eu/rest/v1/all"
  //           },
  //           name: "countries",
  //           title: "Please select the country you have arrived from:"
  //         },
  //         {
  //           type: "signaturepad",
  //           name: "sign",
  //           title: "Please enter your signature"
  //         },
  //         {
  //           type: "sortablelist",
  //           name: "lifepriopity",
  //           title: "Life Priorities ",
  //           isRequired: true,
  //           colCount: 0,
  //           choices: ["family", "work", "pets", "travels", "games"]
  //         },
  //         {
  //           name: "date",
  //           type: "datepicker",
  //           inputType: "date",
  //           title: "Your favorite date:",
  //           dateFormat: "mm/dd/yy",
  //           isRequired: true
  //         },
  //         {
  //           "type": "emotionsratings",
  //           "name": "emotionsratings-widget",
  //           "title": "Please rate the movie you've just watched",
  //           "choices": ["1", "2", "3", "4", "5"]
  //         }
  //       ]
  //     },
  //     {
  //       questions: [
  //         {
  //           type: "matrix",
  //           name: "Quality",
  //           title:
  //             "Please indicate if you agree or disagree with the following statements",
  //           columns: [
  //             {
  //               value: 1,
  //               text: "Strongly Disagree"
  //             },
  //             {
  //               value: 2,
  //               text: "Disagree"
  //             },
  //             {
  //               value: 3,
  //               text: "Neutral"
  //             },
  //             {
  //               value: 4,
  //               text: "Agree"
  //             },
  //             {
  //               value: 5,
  //               text: "Strongly Agree"
  //             }
  //           ],
  //           rows: [
  //             {
  //               value: "affordable",
  //               text: "Product is affordable"
  //             },
  //             {
  //               value: "does what it claims",
  //               text: "Product does what it claims"
  //             },
  //             {
  //               value: "better then others",
  //               text: "Product is better than other products on the market"
  //             },
  //             {
  //               value: "easy to use",
  //               text: "Product is easy to use"
  //             }
  //           ]
  //         },
  //         {
  //           type: "rating",
  //           name: "satisfaction",
  //           title: "How satisfied are you with the Product?",
  //           mininumRateDescription: "Not Satisfied",
  //           maximumRateDescription: "Completely satisfied"
  //         },
  //         {
  //           type: "rating",
  //           name: "recommend friends",
  //           visibleIf: "{satisfaction} > 3",
  //           title:
  //             "How likely are you to recommend the Product to a friend or co-worker?",
  //           mininumRateDescription: "Will not recommend",
  //           maximumRateDescription: "I will recommend"
  //         },
  //         {
  //           type: "comment",
  //           name: "suggestions",
  //           title: "What would make you more satisfied with the Product?"
  //         }
  //       ]
  //     },
  //     {
  //       questions: [
  //         {
  //           type: "radiogroup",
  //           name: "price to competitors",
  //           title: "Compared to our competitors, do you feel the Product is",
  //           choices: [
  //             "Less expensive",
  //             "Priced about the same",
  //             "More expensive",
  //             "Not sure"
  //           ]
  //         },
  //         {
  //           type: "radiogroup",
  //           name: "price",
  //           title: "Do you feel our current price is merited by our product?",
  //           choices: [
  //             "correct|Yes, the price is about right",
  //             "low|No, the price is too low for your product",
  //             "high|No, the price is too high for your product"
  //           ]
  //         },
  //         {
  //           type: "multipletext",
  //           name: "pricelimit",
  //           title: "What is the... ",
  //           items: [
  //             {
  //               name: "mostamount",
  //               title: "Most amount you would every pay for a product like ours"
  //             },
  //             {
  //               name: "leastamount",
  //               title: "The least amount you would feel comfortable paying"
  //             }
  //           ]
  //         }
  //       ]
  //     },
  //     {
  //       questions: [
  //         {
  //           type: "text",
  //           name: "email",
  //           title:
  //             'Thank you for taking our survey. Please enter your email address, then press the "Submit" button.'
  //         }
  //       ]
  //     }
  //   ]
  // };

  onSurveySaved(survey) {
    this.json = survey;
    console.log('onSurveySaved');
    // try{  
      var pipe = new DatePipe('en-US'); // Use your own locale
      const now = Date.now();
      const myFormattedDate = pipe.transform(now, 'short');
    //   console.log('onSurveySaved ',{
    //     survey_name: this.json['title'],
    //     survey_desc: this.json['description'],
    //     form: JSON.stringify(this.json),
    //     start_date: this.json['Date Start']?this.json['Date Start']:'',
    //     end_date:  this.json['Date End']? this.json['Date End']:'',
    //     createdAt: myFormattedDate,
    //     updatedAt: myFormattedDate,
    //     updatedBy:  localStorage.getItem('current_username'),//de schimbat cu ID
    //     flags: '1'
    // });
      // console.log( this.json);
      // console.log( this.json['Date Start']);
      // console.log( this.json['Date End']);

      this.surveyService.update({
          survey_name: this.json['title'],
          survey_desc: this.json['description'],
          form: JSON.stringify(this.json),
          start_date: this.json['Date Start']?this.json['Date Start']:null,
          end_date:  this.json['Date End']? this.json['Date End']:null,
          createdAt: myFormattedDate,
          updatedAt: myFormattedDate,
          updatedBy:  localStorage.getItem('current_username'),//de schimbat cu ID
          flags: '1'
      },this.currentId ).subscribe((res) => {
        // if (res) {
        //   console.log(res);
          this.router.navigate(['list-survey']);
        // }
      }) 
      // }catch(err){
      //   console.log('Exception --',err);
      // }
  }

  // sendData(result) {
  //   //TODO update with your own behavior  
  //   try{  
  //   // console.log(result);
  //   this.formJSONObject = JSON.parse(result);
  //   console.log(this.formJSONObject);
  //   }catch(err){
  //     console.log('Exception --',err);
  //   }
  // }
}