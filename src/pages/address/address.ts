import { ValidatorProvider } from './../../providers/validator/validator';
import { AutocompletePage } from './../autocomplete/autocomplete';
import { TimearrivalPage } from './../timearrival/timearrival';
import { AuthProvider } from './../../providers/auth/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
declare var google:any;
/**
 * Generated class for the AddressPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
})
export class AddressPage {
  numberofpassengers:number;
  address = {
    place: '',
    latitude: '',
    longitude: ''
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
          this.address.latitude = results[0].geometry.location.lat();
          this.address.longitude = results[0].geometry.location.lng();
        console.log("Latitude: "+results[0].geometry.location.lat());
        console.log("Longitude: "+results[0].geometry.location.lng());
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
      address:this.address,
      numofp: this.numberofpassengers
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddressPage');
  }

}
