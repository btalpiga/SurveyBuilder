import { Component, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';

import { SurveyService } from './../../shared/services/survey.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ExportToCsv } from 'export-to-csv';


interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

class CSVRecord {  
	public consumer_id: any;  
	   
} 

const STATUSES={
  1:'InProgress',
  2:'Active',
  3:'Closed'
};
let COUNTRIES= [
  // {
  //   name: 'Russia',
  //   flag: 'f/f3/Flag_of_Russia.svg',
  //   area: 17075200,
  //   population: 146989754
  // },
  // {
  //   name: 'Canada',
  //   flag: 'c/cf/Flag_of_Canada.svg',
  //   area: 9976140,
  //   population: 36624199
  // },
  // {
  //   name: 'United States',
  //   flag: 'a/a4/Flag_of_the_United_States.svg',
  //   area: 9629091,
  //   population: 324459463
  // },
  // {
  //   name: 'China',
  //   flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
  //   area: 9596960,
  //   population: 1409517397
  // }
];

function search(text: string, pipe: PipeTransform): Country[] {
  return COUNTRIES.filter(country => {
    const term = text.toLowerCase();
    return country
    // .survey_name.includes(term)
    //     || pipe.transform(country.surve_desc).includes(term)
        ;
  });
}

@Component({
  selector: 'ngbd-table-filtering',
  templateUrl: './list-survey.component.html',
  providers: [DecimalPipe]
})
export class ListSurveyModule {

  countries$: Country[];
  filter = new FormControl('');

  constructor(pipe: DecimalPipe,
     public surveyService: SurveyService,
    public router: Router
    ) {
      var that = this;

    this.surveyService.list().subscribe((res) => {
    // if (res.result) {
      console.log(res);
      COUNTRIES=res;
      that.countries$ =res;
      // that.filter.valueChanges.pipe(
      //   startWith(''),
      //   map(text => search(text, pipe))
      // );
    // }
  }) 
    
  }

  setStatus(status, surveyId){
    this.surveyService.update({
      status: status
  },surveyId ).subscribe((res) => {
    window.location.reload();
  }) 
  }
  isCSVFile(file: any) {

    return file.name.endsWith(".csv");
 
 }
 getHeaderArray(csvRecordsArr: any) 
{      
   let headers = csvRecordsArr[0].split(',');      
   let headerArray = [];            
     
   for (let j = 0; j < headers.length; j++) {        
               headerArray.push(headers[j]);      
   }        
  return headerArray; 
} 
getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) 
{     
          var dataArr = []    
          var idsString='';      

          for (let i = 1; i < csvRecordsArray.length; i++) {         
               let data = csvRecordsArray[i].split(',');         
               // FOR EACH ROW IN CSV FILE IF THE NUMBER OF COLUMNS         
               // ARE SAME AS NUMBER OF HEADER COLUMNS THEN PARSE THE DATA        
              
               if (data.length == headerLength) {            
                    var csvRecord: CSVRecord = new CSVRecord();                                           
                    csvRecord.consumer_id = data[0].trim();                       
                    // dataArr.push(csvRecord);  
                    idsString+=data[0].trim()+';' ;  
               }       
           }   
    return idsString; 
}

fileChangeListener($event: any,id): void {     
  var text = [];  
  this.currentSurveyId=id;
  console.log('fileChangeListener--',this.currentSurveyId);
  var files = $event.srcElement.files;          
   var csvRecords;
   var that=this;
  if (this.isCSVFile(files[0])) {         
     var input = $event.target;         
     var reader = new FileReader();          
     reader.readAsText(input.files[0]);         

     reader.onload = (data) => {            
          let csvData = reader.result as string;            
          let csvRecordsArray = csvData.split(/\r\n|\n/);             
          let headersRow = this.getHeaderArray(csvRecordsArray);             
          csvRecords = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);       
            console.log('csvRecords==',csvRecords);
            
                        
            that.surveyService.generate_links(that.currentSurveyId,csvRecords).subscribe((res) => {
                console.log(res);
                if(res.link ==''){
                  alert("Survey is not ACTIVE  !");
                }else{
                const options = { 
                  fieldSeparator: ',',
                  filename:'links',
                  quoteStrings: '"',
                  decimalSeparator: '.',
                  showLabels: true, 
                  showTitle: true,
                  title: 'Survey Links',
                  useTextFile: false,
                  useBom: true,
                  useKeysAsHeaders: true,
                  // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
                };
               
              const csvExporter = new ExportToCsv(options);               
              csvExporter.generateCsv(res);
                }
            }) ;
          }  
             reader.onerror = function() {            
                 alert('Unable to read ' + input.files[0]);          
             };      
    } else {          
           alert("Please import valid .csv file.");         
    } 
} 
currentSurveyId='0';

  // openFile(surveyId){
  //   console.log('open file-=-',surveyId);
  //   // return;
  //   if((this.countries$.length>1 && surveyId != this.countries$[0].id) ||
  //   this.countries$.length==1 ){
  //     this.currentSurveyId = surveyId+'';
  //     console.log('open file',this.currentSurveyId);
  //     document.getElementById('xtFileUpload').click();
  //   }else{}
  // }

  surveystatus(status){
      return STATUSES[status];
  }

  editForm(survey_id){
    // console.log(survey_id);
    this.router.navigate(['edit-survey/'+survey_id]);  }
}