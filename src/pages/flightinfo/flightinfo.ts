import { PhonenumberPage } from './../phonenumber/phonenumber';
import { ValidatorProvider } from './../../providers/validator/validator';
import { HttpClient } from '@angular/common/http';
import { AddressPage } from './../address/address';
import { AuthProvider } from './../../providers/auth/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, Injectable } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { IMyDpOptions, IMyInputFieldChanged } from "mydatepicker";
/**
 * Generated class for the FlightinfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Injectable()
@IonicPage()
@Component({
  selector: 'page-flightinfo',
  templateUrl: 'flightinfo.html',

})
export class FlightinfoPage {
  flightNum: string;
  flightNumForm: FormGroup;
  checkexist: boolean = true;
  errormessage: string;
  moment = require('moment');
  time_zone = require('moment-timezone');
  now: string = this.moment(this.time_zone().tz("Asia/Jerusalem").format('DD/MM/YYYY HH:mm'), "DD/MM/YYYY HH:mm");
  // readonly complement_to_24_h = 12;
  // readonly midnight = '00:00';
  // readonly minutes_per_hour = 60;
  // readonly hours_per_day = 24;
  // readonly hours_to_israel_timezone = 3;
  readonly placeholder: string = 'בחר תאריך טיסה';
  public flightPickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    disableUntil: { year: this.now['_a'][0], month: this.now['_a'][1] + 1, day: this.now['_a'][2] }
  };
  private date: string = this.placeholder;
  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, private authData: AuthProvider, private http: HttpClient, validator: ValidatorProvider) {
    this.flightNumForm = formBuilder.group({
      flightnumber: [this.authData.emptystring, [Validators.required, validator.flightNumberValidator]],
      flight_date: [this.authData.emptystring, Validators.required]
    })

  }

  disableErrors() {
    this.checkexist = true;
  }
  return_Day() {
    console.log('ggg'+this.flightNumForm.controls['flight_date'].value.date.year);
    // var day = this.moment(this.flightNumForm.controls['flight_date'].value.date.month + '/' + this.flightNumForm.controls['flight_date'].value.date.day + '/' + this.flightNumForm.controls['flight_date'].value.year).day();
    // switch (day) {
    //   case (1):
    //     return 'יום ראשון';
    //   case (2):
    //     return 'יום שני';
    //   case (3):
    //     return 'יום שלישי';
    //   case (4):
    //     return 'יום רביעי';
    //   case (5):
    //     return 'יום חמישי';
    //   case (6):
    //     return 'יום שישי';
    //   case (7):
    //     return 'יום שבת';
    // }
  }
  checkDate(data) {
    var flight_time = this.moment(data.date + ' ' + data.time, "DD/MM/YYYY HH:mm");

    var duration = flight_time.diff(this.now, 'hours');
    if (duration >= 24)
      return true;
    else
      return false;

  }
  checkFlight(info) {
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
    this.return_Day();
    this.flightStatus().then((data) => {
      if (data.hasOwnProperty('error')) {
        this.checkexist = false;
        this.errormessage = 'מספר הטיסה שהוזן אינו קיים במערכת';
      }

      else {
        this.checkFlight(data);

      }
      if (this.checkexist)
        this.navCtrl.push(AddressPage, { flightNum: this.flightNum });
    });;

  }

  flightStatus() {
    return new Promise((resolve, reject) => {
      var flightnumberaddress = 'https://taxiserver.herokuapp.com/api/load/' + this.flightNum;
      this.http.get(flightnumberaddress).subscribe(data => {
        resolve(data);
      });

    });


  }
} 