import { FlightinfoPage } from './../flightinfo/flightinfo';
import { HttpClient } from '@angular/common/http';
import { AuthProvider } from './../../providers/auth/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
    console.log(firebase.auth().currentUser.uid,this.navParams.get('flightNum'),this.navParams.get('address'),this.navParams.get('numofp'));
    var order = {
      uid: firebase.auth().currentUser.uid
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad TimearrivalPage');
  }

}
