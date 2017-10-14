import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthProvider } from './../../providers/auth/auth';
/**
 * Generated class for the OrdersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

export interface request {
    pickUp_time: string,
    arrival_time: string,
    price_tag: string
  }

@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})

export class OrdersPage {
  authData: any;
  private requests: request[] = [];
  ordersForm:FormGroup;
  builder:FormBuilder;
  constructor(public navCtrl: NavController, public navParams: NavParams, public HttpClient:HttpClient,
    authData:AuthProvider){
    this.ordersForm = this.builder.group({
      pickUp_time:['',Validators.required], 
      arrival_time:['',Validators.required], 
      price_tag: ['',Validators.required]
      })
  }
/*
  importOrders(){
    const url = 'https://taxiserver.herokuapp.com/api/orders'
    var order = {
      uid: firebase.auth().currentUser.uid,
  
      numOfPassengers: this.navParams.get('numOfP'),
      departureTime: this.navParams.get('time'),
      //arrivalRange: Number(this.arrivalwantedtime),
    }

    //let loader = this.loadingController.create({
    //  content: "מחשב מסלולים."
   // });  
    //loader.present();
    //this.http.post(url,order).subscribe(()=>{
    //  loader.dismiss();
    ///  this.navCtrl.push(OrdersPage);
    //});
  }
*/
  ionViewDidLoad() {
    console.log('ionViewDidLoad OrdersPage');
  }

}
