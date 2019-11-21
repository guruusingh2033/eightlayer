import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { RequestOptions } from '@angular/http'
import { HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/observable/throw";

@Injectable()
export class ForgotPasswordService {
    constructor(private http: HttpClient) {

    }

    postPasswordForget(entid,model) {

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
        };

        console.log("model",model); 
        return this.http.post("https://dn8vci2oq6.execute-api.us-east-1.amazonaws.com/dev/enterprises/"+entid+"/users/passwordforgot", model, options)
        .catch((error: Response) => {
            return Observable.throw(error)
        })


        
    }

    postPasswordReset(entid,model) {

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
        };

        return this.http.post("https://dn8vci2oq6.execute-api.us-east-1.amazonaws.com/dev/enterprises/"+entid+"/users/passwordreset", model, options)
        .catch((error: Response) => {
            return Observable.throw(error)
        })

    }
}
