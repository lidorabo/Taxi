import { ValidatorProvider } from './../../providers/validator/validator';
import { HttpClient } from '@angular/common/http';
import { AddressPage } from './../address/address';
import { AuthProvider } from './../../providers/auth/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, Injectable, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, MenuController, LoadingController} from 'ionic-angular';
import { IMyDpOptions, IMyInputFieldChanged } from "mydatepicker";
import { RequestOptions } from '@angular/http';
import { Page } from '../page/page';
import {MyApp} from '../../app/app.component'
/**
 * Generated class for the FlightinfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-flightinfo',
  templateUrl: 'flightinfo.html',
})
export class FlightinfoPage {

  ionViewDidLoad() {
    console.log('ionViewDidLoad FlightinfoPage');
  }
  flightNum: string;
  flightNumForm: FormGroup;
  checkexist: boolean = true;
  errormessage: string;
  moment = require('moment-timezone');

  now: string = this.moment().tz("Asia/Jerusalem").format('MM/DD/YYYY HH:mm');
  readonly placeholder: string = 'בחר תאריך טיסה';
  public flightPickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    disableUntil: { year: Number(this.now.substr(6, 4)), month: Number(this.now.substr(0, 2)), day: Number(this.now.substr(3, 2)) }
  };
  ionViewDidEnter(){
    if(!this.authData.is_Admin())
    {
      this.menu.enable(true,MyApp.menu_flight_user);
      this.menu.enable(false,MyApp.menu_admin);
      this.menu.enable(false,MyApp.menu_driver_user);
      this.menu.enable(false,MyApp.menu_driver_admin);
      this.menu.enable(false,MyApp.menu_flight_admin);
      
    }
    else{
      this.menu.enable(false,MyApp.menu_flight_user);
      this.menu.enable(false,MyApp.menu_admin);
      this.menu.enable(false,MyApp.menu_driver_user);
      this.menu.enable(false,MyApp.menu_driver_admin);
      this.menu.enable(true,MyApp.menu_flight_admin);
    }
      }
  private date: string = this.placeholder;
  constructor(public navCtrl: NavController, public loadingController: LoadingController, public navParams: NavParams, public formBuilder: FormBuilder, private authData: AuthProvider, private http: HttpClient, validator: ValidatorProvider,private menu:MenuController) {
    this.flightNumForm = formBuilder.group({
      flightnumber: [this.authData.emptystring, [Validators.required, validator.flightNumberValidator]],
      flight_date: [this.authData.emptystring, Validators.required]
    })

  }
  disableErrors() {
    this.flightNumForm.controls['flightnumber'].patchValue(this.flightNumForm.controls['flightnumber'].value.replace(/\s/g, ""));
    this.checkexist = true;
  }
  checkDate(data) {
    var flight_time = this.moment(data.date + ' ' + data.time, "DD/MM/YYYY HH:mm");
    var duration = flight_time.diff(this.now, 'hours');
    debugger;
    if (duration >= 30)
      return true;
    else
      return false;

  }
  checkFlight(info) {
    this.checkexist = true;
    var airport_name = 'נמל התעופה בן-גוריון';
    if (!this.checkDate(info)) {
      this.errormessage = 'מספר טיסתך אינו בתוקף';
      this.checkexist = false;
    }
    else if (info['airport'] != airport_name) {
      this.checkexist = false;
      this.errormessage = 'טיסה אינה משויכת לנמל התעופה של מדינתך';
    }

  }
  goToAddressPage() {
    this.flightStatus().then((data) => {
      if (data.hasOwnProperty('error')) {
        this.checkexist = false;
        this.errormessage = 'מספר הטיסה שהוזן אינו קיים בתאריך שהוזן';
      }

      else {
        this.checkFlight(data);

      }
      if (this.checkexist)
        this.navCtrl.push(AddressPage, { flightNum: data['flightNumber'], date: this.flightNumForm.controls['flight_date'].value.formatted, time: data['time'] });
    });;

  }

  flightStatus() {
    return new Promise((resolve, reject) => {
      var flightnumberaddress = 'https://taxiserver.herokuapp.com/api/load/' + this.flightNum + ' ' + this.flightNumForm.controls['flight_date'].value.formatted.split('/')[0] + '.' + this.flightNumForm.controls['flight_date'].value.formatted.split('/')[1] + '.' + this.flightNumForm.controls['flight_date'].value.formatted.split('/')[2];  
      let loader = this.loadingController.create({
        content: "מושך מידע רלוונטי אודות הטיסה."
      });  
      loader.present();
      this.http.get(flightnumberaddress).subscribe(data => {
        loader.dismiss();
        resolve(data);
      });

    });


  }

}
