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
  constructor(public navCtrl: NavController, public navParams: NavParams, public HttpClient:HttpClient,
    authData:AuthProvider){
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad OrdersPage');
  }

}
