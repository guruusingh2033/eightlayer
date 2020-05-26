import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-quiz-result',
  templateUrl: './quiz-result.component.html',
  styleUrls: ['./quiz-result.component.css']
})
export class QuizResultComponent implements OnInit {
  private sub: any;
  score: any;
  quizid: any;
  showSpinner: boolean = false;
  chaptercode: any;
  userID: any;
  resultData: any;
  avgScore: any;
  highestScore: any;

  constructor(private httpClient: HttpClient,
              private route: ActivatedRoute,
              private router: Router
    ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.score = params['score'];
      this.quizid = params['quizid'];
      this.chaptercode = params['chaptercode'];
      this.userID = localStorage.getItem("Updated_user_id");
    });

    this.getResultData();
  }

  //getting data to show on result component
  getResultData()
  {
    this.showSpinner = true;
    return this.httpClient.get("https://gvb0azqv1e.execute-api.us-east-1.amazonaws.com/dev/quizeschedule?user_id=" + this.userID + "&quize_schedule_id=" + this.quizid).subscribe((res)=>{
      console.log("getResultData new lambda", res);
      this.resultData = res;
      var resultArray = this.resultData.body.data;
      this.highestScore = Math.max.apply(Math, resultArray.map(function(o: any) { return o.quiz_score; }));
      this.avgScore = this.averageScore(resultArray);
      this.showSpinner = false;
    })
  }

  //take a survey button click
  takeASurvey()
  {
    this.router.navigate(['rating', this.quizid, this.chaptercode]);
  }

  //average score calculation
  averageScore(resultArray: any)
  {    
          var sum = resultArray.filter((item) =>item.quiz_score)
          .map((item) => +item.quiz_score)
          .reduce((sum, current) => sum + current, 0);           
          var count = this.resultData.body.data.length;
          return (sum / count);          
  }
}
