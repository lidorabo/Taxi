import { ValidatorProvider } from './../../providers/validator/validator';
import { AutocompletePage } from './../autocomplete/autocomplete';
import { TimearrivalPage } from './../timearrival/timearrival';
import { AuthProvider } from './../../providers/auth/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
declare var google:any;
/**
 * Generated class for the AddressPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
})
export class AddressPage {
  numberofpassengers:number;
  address = {
    place: '',
    latitude: '',
    longitude: '',
    city: '',
    fulladdress: ''
  };
  selectOptions={
    cssClass:'address'
  }
  AddressForm:FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams,private modalCtrl: ModalController, public formBuilder:FormBuilder,private authData:AuthProvider,validator:ValidatorProvider) {
    this.AddressForm = formBuilder.group({
      address: [[this.authData.emptystring],validator.addressValidator],
      numop:[[this.authData.emptystring],Validators.required]
      })
  }
  showAddressModal() {
    
    let modal = this.modalCtrl.create(AutocompletePage);
    let me = this;
    modal.onDidDismiss(data => {
      this.address.place = data;
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': this.address.place},(results, status)=> {
        if (status == google.maps.GeocoderStatus.OK) {
          this.address.city = results[0].formatted_address.split(',')[1];
          this.address.fulladdress = results[0].formatted_address;
          this.address.latitude = results[0].geometry.location.lat();
          this.address.longitude = results[0].geometry.location.lng();
        } 
  
        else {
          console.log("Geocode was not successful for the following reason: " + status);
        }
      });
    });
    modal.present();
    }
  goToArrivalTimePage()
  {
    this.navCtrl.push(TimearrivalPage,{
      flightNum:this.navParams.get('flightNum'),
      date:this.navParams.get('date'),
      lat:this.address.latitude,
      lng: this.address.longitude,
      numOfP: this.numberofpassengers,
      time: this.navParams.get('time'),
      city: this.address.city,
      fullAddress: this.address.fulladdress
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddressPage');
  }

}
