import { Component, OnInit, NgZone} from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';
import {NotificationService} from "../services/notification.service";

declare var notifier: any;
declare var electron: any;



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  // hideVar:boolean
  entId;
   constructor(private httpClient:HttpClient,private router: Router,private zone: NgZone,
    private notificationService: NotificationService){}
   sessionStorage():any{

      //alert("asdadsaasdadasdasda");
      sessionStorage.removeItem("accessToken");
     }

  notify(){
    notifier.notify(
      {
        title: "Quiz Notification",
        message: "There is a quiz prepared and ready for you." +
          "Take 5 Minutes and complete the session." +
          "Do you want to take it now?",
        sound: true, // Only Notification Center or Windows Toasters
        wait: true, // Wait with callback, until user action is taken against notification
        actions: ["Start", "Later"]
      }
    );
  }


  ngOnInit() {
    this.entId = localStorage.getItem("Orgnisation_id");
    var quizData = electron.ipcRenderer.sendSync('check-quiz-exist', this.entId)
    console.log("data recieved ", quizData)
    if (quizData.body.data.length >0 )
    this.notify()
    
    

    notifier.on('start', () => {
      this.zone.run(() => {
        var tokenExists = localStorage.getItem("accessToken");
        if (tokenExists != null && tokenExists != undefined){
        electron.ipcRenderer.send('show-about-window-event')
        this.router.navigateByUrl('/quiz');
        }
      });
    });
    notifier.on('later', () => {
      var timer = electron.ipcRenderer.sendSync('notification-timer')
      var quizData = electron.ipcRenderer.sendSync('check-quiz-exist', this.entId)
      console.log("data recieved2 ", quizData)
      if (quizData.body.data.length > 0)
      this.notify()
    }); 
  }
    //console.log("app.component is calling");
    // this.hideVar = true;

  }
