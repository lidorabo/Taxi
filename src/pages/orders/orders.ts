import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthProvider } from './../../providers/auth/auth';
import firebase from "firebase";
import { TypePath, Order_states } from '../../enums';
import { FlightinfoPage } from '../flightinfo/flightinfo';
/**
 * Generated class for the OrdersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

export interface Order {
  pickUp_time: string,
  arrival_time: string,
  total_pessengers: number,
  type: string,
  cost: number,
  pathid: string
}
export interface Buttton {
  index: number,
  text: string,
  clicked: boolean
}

@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})

export class OrdersPage {
  private orders: Order[] = [];
  private paths: any[] = [];
  private buttons: Buttton[] = [];
  private has_cancel_button: boolean = false;
  private button_cancel_order = 'בטל בקשה';
  private accept_text: string = 'אשר נסיעה';
  private disaccept_text: string = 'בטל נסיעה';
  constructor(public navCtrl: NavController, public navParams: NavParams, public HttpClient: HttpClient,
    private authData: AuthProvider) {
    this.checkStatus();
    const url = 'https://taxiserver.herokuapp.com/api/getPaths/' + firebase.auth().currentUser.uid;
    this.HttpClient.get(url).subscribe((paths: any[]) => {
      this.paths = paths;
      this.getOrders(paths);
      this.pushBottons();
    })
  }
  private pushBottons() {
    var mone: number = 0;
    var current_user = firebase.auth().currentUser.uid;
    for (let path of this.paths) {
      var points: any[] = path.points;
      for (let point of points) {
        if (point.uid == current_user) {
          var status = point.status;
          if (status == Order_states.Acccept) {
            this.buttons.push({
              index: ++mone,
              text: this.disaccept_text,
              clicked: true
            })
          }
          else {
            this.buttons.push({
              index: ++mone,
              text: this.accept_text,
              clicked: false
            })
          }

        }
      }
    }
  }
  private checkStatus(){
    var current_user_uid = firebase.auth().currentUser.uid;
    var query_status = firebase.database().ref().child(this.authData.userstable).child(current_user_uid).child('status');
    query_status.once('value',(result)=>{
          if(result.val() == Order_states.Acccept){
             this.has_cancel_button = true;
          }  
    }).then(()=>{
      console.log(this.has_cancel_button);
    })
  }
  private cancelOrder(){
      var current_user_uid = firebase.auth().currentUser.uid;
      const url =  'https://taxiserver.herokuapp.com/api/cancelOrder/'+current_user_uid
      this.HttpClient.delete(url).subscribe(()=>{
          var query_uid = firebase.database().ref().child(this.authData.userstable).child(current_user_uid)
          query_uid.update({
            status: Order_states.DisAccept
          }).then(()=>{
            this.navCtrl.setRoot(FlightinfoPage);
          })
  })
}
  private getOrders(paths: any[]) {
    var current_user = firebase.auth().currentUser.uid;
    var type_drive: string;
    var pickup_time: string;
    var num_of_pessengers: number;
    var time_arrival: string;
    var cost_drive: number;
    for (let path of paths) {
      var points: any[] = path.points;
      for (let point of points) {
        if (point.uid == current_user) {
          if (points.indexOf(point) == points.length - 1) {
            type_drive = TypePath.Direct;
          }
          else {
            type_drive = TypePath.Reguarded;
          }
          if (points.length > 1) {
            pickup_time = this.getFormattedDate(point.pickUpDate);
            cost_drive = point.cost;
          }

        }
      }
      time_arrival = this.getFormattedDate(path.arrivalDate);
      num_of_pessengers = path.totalPassengers;
      if (points.length == 1) {
        pickup_time = this.getFormattedDate(path.leavingDate);
        cost_drive = path.cost;
      }
      this.orders.push({
        type: type_drive,
        cost: cost_drive,
        pickUp_time: pickup_time,
        total_pessengers: num_of_pessengers,
        arrival_time: time_arrival,
        pathid: path.name

      })
    }
  }
  private UpdateServer(path_drive: any, index: number) {
    var path_user;
    for (let button of this.buttons) {
      if (button.index == index) {
        button.clicked = !button.clicked;
        if (button.clicked)
          button.text = this.disaccept_text;
        else
          button.text = this.accept_text;

      }

    }
    for (let path of this.paths) {
      if (path.name == path_drive) {
        path_user = path;
        var current_user = firebase.auth().currentUser.uid;
        var points: any[] = path.points
        for (let point of points) {
          if (point.uid == current_user) {
            if (point.status == Order_states.Acccept)
              point.status = Order_states.DisAccept;
            else
              point.status = Order_states.Acccept;
          }
        }
      }
    }
    const url = 'https://taxiserver.herokuapp.com/api/stateChangePath/' + path_user.name;
    this.HttpClient.put(url, {
      points: path_user.points
    }).subscribe(() => {

    });
  }
  private getFormattedDate(date: string): string {
    var T_mark = 'T';
    var points = ':';
    var slash = '/';
    var minus = '-';
    var point = '.';
    var backspace = ' ';
    var parts_date = date.split(T_mark)[0];
    var day = parts_date.split(minus)[2];
    var month = parts_date.split(minus)[1];
    var year = parts_date.split(minus)[0];
    var format_date = day + slash + month + slash + year;
    var time = date.split(T_mark)[1].split(point)[0];
    var hour = time.split(points)[0];
    var minutes = time.split(points)[1];
    var time_clock = hour + points + minutes;
    return format_date + backspace + time_clock;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrdersPage');
  }

}
