import { FlightinfoPage } from './../flightinfo/flightinfo';
import { HttpClient } from '@angular/common/http';
import { AuthProvider } from './../../providers/auth/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
/**
 * Generated class for the TimearrivalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-timearrival',
  templateUrl: 'timearrival.html',
})
export class TimearrivalPage {
  arrivaltimeForm:FormGroup;
  arrivalwantedtime:string;
  selectOptions={
    cssClass:'arrivaltime'
  }
  constructor(public navCtrl: NavController, public navParams: NavParams,public formBuilder:FormBuilder,private authData:AuthProvider,private http: HttpClient) {
    this.arrivaltimeForm = formBuilder.group({
       arrivalt:[this.authData.emptystring,Validators.required]
       })
  }
  sendOrder()
  {

    const url = 'https://taxiserver.herokuapp.com/api/orders'
    var order = {
      uid: firebase.auth().currentUser.uid,
      flightNo: this.navParams.get('flightNum'),
      dDate: this.navParams.get('date'),
      lat: this.navParams.get('lat'),
      lng: this.navParams.get('lng'),
      numOfPassengers: this.navParams.get('numOfP'),
      departureTime: this.navParams.get('time'),
      arrivalRange: Number(this.arrivalwantedtime),
      city: this.navParams.get('city'),
      fullAddress: this.navParams.get('fullAddress')
    }
    this.http.post(url,order).subscribe(()=>{
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad TimearrivalPage');
  }

}
