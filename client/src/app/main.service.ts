import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import io from "socket.io-client";
import { BehaviorSubject } from 'Rxjs';

@Injectable()
export class MainService {
  
  currentUser = null;

  all_events: BehaviorSubject<any[]> = new BehaviorSubject([]);

  constructor(private _http: Http) {
    if (localStorage.currentUser !== undefined) {
      console.log(this.currentUser);
      this.currentUser = JSON.parse(localStorage.currentUser);
    }
  }

  getAllEvents(callback) {
    this._http.get("/allevents").subscribe((res) => {
      callback(res.json());
    }, (err) => {
      console.log("error 0 ");
    })
  }

  registerCap(data, callback) {
    this._http.post('/register', data).subscribe(
      (res) => {
        console.log("from service register: ", res.json());
        callback(res.json());
        if (res.json().success == 'success') {
          this.currentUser = res.json().currentUser;
          localStorage.currentUser = JSON.stringify(res.json().currentUser);
        }
      },
      (err) => {
        console.log(err);
      }
    )
  }

  registerStudent(data, callback) {
    this._http.post('/register', data).subscribe(
      (res) => {
        console.log("from service register: ", res.json());
        callback(res.json());
        if (res.json().success == 'success') {
          this.currentUser = res.json().currentUser;
          localStorage.currentUser = JSON.stringify(res.json().currentUser);
        }
      },
      (err) => {
        console.log(err);
      }
    )
  }




  createStudentEvent(event, callback) {
    this._http.post('/studentevents', { id: this.currentUser._id, event: event }).subscribe(
      (res) => {

        callback(res.json());
        let allEvents = res.json();
        this.updateAllEvents(allEvents);
      }, (err) => {
        console.log("error 1 ");
      }
    )
  };


 

  createCaptainEvent(event, callback) {
    this._http.post('/captainevents', { id: this.currentUser._id, event: event }).subscribe(
      (res) => {

        callback(res.json());
        let allEvents = res.json();
        this.updateAllEvents(allEvents);
      }, (err) => {
        console.log("error 2 ");
      }
    )
  };

  updateAllEvents(data) {
    this.all_events.next(data);
  }

  getPendingUser(token, callback) {
    this._http.get(`/activate_new/${token}`).subscribe((res) => {
      callback(res.json());
    }, (err) => {
      console.log("get pending user err: ", err);
    })
  }


  login(userdata, callback) {
    this._http.post("/login", userdata).subscribe(
      (res) => {
        callback(res.json());
        if (res.json().error == undefined) {
          this.currentUser = res.json();
          localStorage.currentUser = JSON.stringify(res.json());
          
        }
      },
      (err) => {
        console.log("error from login service: ", err);
      })
  }

}
  
