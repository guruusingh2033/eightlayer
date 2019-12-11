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

    electron.ipcRenderer.send('check-quiz-and-notify', this.entId)
    electron.ipcRenderer.send('schedule-notification', this.entId)
    
    electron.ipcRenderer.on('scheduled-notification-response', (event, data) => {
      localStorage.removeItem("scheduled_quiz_lesson");
      localStorage.setItem("scheduled_quiz_lesson", data[0]['lessons_included'][0]);
      this.notify();
    })

    notifier.on('start', () => {
      electron.ipcRenderer.send('show-about-window-event')
      this.zone.run(() => {
        var tokenExists = localStorage.getItem("accessToken");
        if (tokenExists != null && tokenExists != undefined){
        this.router.navigateByUrl('/quiz');
        }
      });
    });

    notifier.on('later', () => {
      electron.ipcRenderer.send('snooze-notification', this.entId)
    }); 
  }
    //console.log("app.component is calling");
    // this.hideVar = true;

  }
