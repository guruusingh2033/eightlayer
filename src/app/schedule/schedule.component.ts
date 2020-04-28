import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {QuizService} from "../../services/quiz.service";
import {parseHttpResponse} from "selenium-webdriver/http";

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  showSpinner: boolean = false;
  chapterData = [];
  quizePopup = "none";
  selectedEntName;
  selectedchapterName;
  quizeData: any =[];
  chapterName:any =[];
  Entdatas: any =[];
  editLessonData: any =[];
  editQuizeData: any =[];
  entid;
  chapterid;
  onDownClick = false;
  currentent: any;
  currentChapter: any;
  date = new Date();
  deleteScheduleId: any;

  @ViewChild('scheduled_date') chapterScheduleDate;
  constructor(private httpClient: HttpClient,
              private lessonScheduleService: QuizService) { }

  ngOnInit() {
    this.getCurrectFormatedDate();
    this.showSpinner = true;
    this.httpClient.get<any>('https://g3052kpia0.execute-api.us-east-1.amazonaws.com/dev/enterprises/',
      {
        headers: new HttpHeaders().set('accesstoken', localStorage.getItem("accessToken"))
      })
      .subscribe(response => {
        this.Entdatas = response.data;
        this.showSpinner = false;
        }, (error: any) => {
        console.log("error = " + error);

      })

    this.httpClient.get<any>('https://g3052kpia0.execute-api.us-east-1.amazonaws.com/dev/chapters',
      {
        headers: new HttpHeaders().set('accesstoken', localStorage.getItem("accessToken"))
      })
      .subscribe(response => {
          this.chapterName = response.data;
          console.log('chapterName', this.chapterName);
          this.showSpinner = false;
        },
        (error: any) => {
          console.log("error of put" + error);
        })
  }

  //find quiz duration
  getDateRange(scheduled_date: any, duration: any)
  {
    var result = new Date(new Date(scheduled_date).setDate(new Date(scheduled_date).getDate() + parseInt(duration)));
    var finalDate = result.toISOString().substr(0, 10);
    return finalDate;
  }

  //delete
  deleteSchedule(deleteScheduleId: any)
  {
    this.deleteScheduleId = deleteScheduleId;
  }

  scheduleRemoveData() {
    console.log("entid: ",this.entid);
    console.log("this.deleteScheduleId", this.deleteScheduleId)
    this.showSpinner = true;
    this.httpClient.delete('https://o9dzztjg31.execute-api.us-east-1.amazonaws.com/dev/schedules/quizzes/' + this.entid + '/' + this.deleteScheduleId, {
      headers: new HttpHeaders().set('accesstoken', localStorage.getItem("accessToken"))
    }).subscribe(
      result => {
        alert("Deleted successfully");
        console.log(result)
        this.getQuizedata();
        this.showSpinner = false;

      },
      error => {console.log("error while deleting: ", error)}
    );

  }

  getCurrectFormatedDate()
  {
    var result = new Date();
    var finalDate = result.toISOString().substr(0, 10);
    return finalDate;
  }

  onEntChange(event) {
    this.entid = event;
    this.Entdatas.filter((x) => {
      if(x.entid === event) {
        this.currentent = x;
      }})
    console.log('entid', this.entid);
  }

  onChapterChange(event) {
    this.chapterid = event;
    this.chapterName.filter((x) => {
      if(x.chapter_code === event) {
        this.currentChapter = x;
      }
    });
    console.log('chapterid', this.chapterid);
    this.showSpinner = true;
    this.getQuizedata()
  }

  close(){
    this.quizePopup = 'none';
  }

  createQuizeSchedule() {
    this.quizePopup = 'block';
    this.editQuizeData = this.editLessonData;
    this.editQuizeData.chapters_name = this.currentChapter.chapters_name;
    this.editQuizeData.entname = this.currentent.entname;

  }

  submitQuizeSchedule(data,qDate,duration) {
    console.log('data', data);
    this.quizePopup = 'none';
    let quizeScheduleData =  {
      "entid": this.currentent.entid,
      "lessons_included": [
        this.chapterid
    ],
      "scheduled_date": qDate,
      "chapter_name": this.editQuizeData.chapters_name,
      "duration" : duration
    };
    this.lessonScheduleService.addQuizData(quizeScheduleData)
      .subscribe((response) => {
        console.log(response);
        this.getQuizedata();
        qDate ='';
        alert('Quize Schedule Successfully.');
      })
  }

  getQuizedata() {
    this.lessonScheduleService.getQuizData(this.entid,this.chapterid)
      .subscribe(response => {
        console.log('quizRecord', response);
        if (response.body.data.length > 0) {

          this.quizeData = response.body.data;
        } else {
          this.quizeData = [];
          alert('No Any Quize Schedule Created');
        }
        this.showSpinner = false;
      });
  }
}
