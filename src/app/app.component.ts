import { Component, OnInit, NgZone} from '@angular/core';
import { HttpClient } from '@angular/common/http'
import {NotificationService} from "../services/notification.service";
import { Router } from '@angular/router';
import 'rxjs/add/observable/interval';
import { Observable } from 'rxjs/Observable';
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
    notifier.on('start', ()=> {
      this.zone.run(() => {    
        electron.ipcRenderer.send('show-about-window-event')
        this.router.navigateByUrl('/showQuiz');
      });
    }); 
    notifier.on('later', ()=> {
      setTimeout(()=>{
        electron.ipcRenderer.send('notifier')
      },3600000*4)
    }); 
  }


  ngOnInit() {
    this.notify();
  }
    //console.log("app.component is calling");
    // this.hideVar = true;

  }
