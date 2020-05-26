import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import 'path';
import {HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {
  messageText: any;
  private sub: any;
  chaptercode: any;
  rate = false;
  quizid: any;
  showSpinner: boolean = false;
  ratingClicked: any;
  userID: any;
  entId: any;
  rating: any;
  value: any;

  constructor(private route: ActivatedRoute,
              private httpClient: HttpClient,
              private router: Router)
  {

  }
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.chaptercode = params['chaptercode'];
      this.quizid = params['quizid'];
      console.log("chaptercode is", this.chaptercode);
      console.log("quizid is", this.quizid);
    });
  }

  onClick(value: any)
  {
    this.rating = this.value = value;
  }
  closeModel(){
    this.rate = false;
  }
  
  saveRating()
   {
    this.showSpinner = true;
    this.ratingClicked = this.rating;
    this.userID = localStorage.getItem("Updated_user_id");
    this.entId = localStorage.getItem("enterpriseId");
    let obj = {
      "user_quiz_accessed_id": this.quizid,
      "user_lesson_accessed_id": this.chaptercode,
      "entid": parseInt(this.entId),
      "userid": this.userID,
      "lesson_rating": this.rating,
      "comment": this.messageText
    };
    this.httpClient.post('https://gvb0azqv1e.execute-api.us-east-1.amazonaws.com/dev/rating', obj)
      .subscribe(data => {
        this.showSpinner = false;
        alert('Thank you for rating..'); 
        this.router.navigate(['quiz']);
      });
  }

  comments(event: any)
  {
    this.messageText = event.target.value;
  }
}
