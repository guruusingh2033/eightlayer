import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ObjNgFor } from '../client-enterprise/myPipe';
import {NgbDateStruct, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        day : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}

@Component({
  selector: 'app-site-admin-reports',
  templateUrl: './site-admin-reports.component.html',
  styleUrls: ['./site-admin-reports.component.css'],
  providers: [
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class SiteAdminReportsComponent implements OnInit {
  
  allUsersData:any;
  startDate: any; 
  fromDate:any;
  toDate:any;
  entId:any;
  errormsg:any;
  userType:any;
  userHead = "";
  public showSpinner:boolean = false;
  model: NgbDateStruct;
  constructor(private httpClient: HttpClient) {

    this.startDate = new Date('2005/02/02');

   }
/*date picker*/
   set humanDate(e){
    e = e.split('-');
    let d = new Date(Date.UTC(e[0], e[1]-1, e[2]));
    this.startDate.setFullYear(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1);
  }
  
  get humanDate(){
    return this.startDate.toISOString().substring(0, 10);
  }

//format date
formatDate(date: any, increment: any)
{

let monthZero = '';
let dayZero = '';
if(date.month < 10)
{
  monthZero = '0'
}
if(date.day < 10)
{
  dayZero = '0'
}

let dte = parseInt(date.day);
let finalData: number = dte + increment;
let finalDate = date.year + '-' + monthZero + date.month + '-' + dayZero + String(finalData);
return finalDate;
}

/*for complian Users*/

  compliantUser()
  {
    let fromDate = this.formatDate(this.fromDate, 0)
    let toDate = this.formatDate(this.toDate, 1)

    this.showSpinner = true
this.userHead = "Compliant"
if(this.fromDate && this.toDate){

  this.entId = localStorage.getItem("enterpriseId");
  console.log("from date ",this.fromDate, "to Date", this.toDate, "this.entId",this.entId);
 
  this.httpClient.get('https://2gs6fkutxh.execute-api.us-east-1.amazonaws.com/dev/reports/'+this.entId+'/users/quizreport?type=compliant&start_date='+fromDate+'&end_date='+toDate,
  {
    headers: new HttpHeaders().set('accesstoken', localStorage.getItem("accessToken"))
  }).subscribe((data: any) => {

    this.allUsersData = data
   console.log("this.compliantData", this.allUsersData);
   this.showSpinner = false
  }, (error: any) => {

    this.errormsg = error
    if(this.errormsg.status == "404"){
      this.showSpinner = false
      alert("Records not found");
      this.allUsersData = []
    }
   
  })


}else{
alert("Please enter date");
}

  }
  /*for non_complian Users*/
  nonCompliantUser()
  {
    let fromDate = this.formatDate(this.fromDate, 0)
    let toDate = this.formatDate(this.toDate, 1)
    this.showSpinner = true
    this.userHead = "Noncompliant"    
    if(this.fromDate && this.toDate){

      this.entId = localStorage.getItem("enterpriseId");
      console.log("from date ",fromDate, "to Date", toDate, "this.entId",this.entId);
      this.httpClient.get('https://2gs6fkutxh.execute-api.us-east-1.amazonaws.com/dev/reports/'+this.entId+'/users/quizreport?type=non_compliant&start_date='+fromDate+'&end_date='+toDate,
      {
        headers: new HttpHeaders().set('accesstoken', localStorage.getItem("accessToken"))
      }).subscribe((data: any) => {
    
        this.allUsersData = data
        this.showSpinner = false
      console.log("this.allUsersData.data.length", this.allUsersData.data.length)
      console.log("this.NoncompliantData",this.allUsersData);
    
      }, (error: any) => {
    
        this.errormsg = error
        if(this.errormsg.status == "404"){

          this.showSpinner = false
          alert("Records not found");
          this.allUsersData = []
        }
       
      })
    
    }else{
    alert("Please enter date");
    }
      }
  ngOnInit() {

   // alert("init call")
    this.allUsersData = []
  }

}
