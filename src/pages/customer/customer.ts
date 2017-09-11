import { Component } from '@angular/core';
import { IonicPage,NavController, AlertController, Platform, ModalController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from "../login/login";
import { AutocompletePage } from "../autocomplete/autocomplete";
import { HttpClient } from "@angular/common/http";

declare var google:any;

@IonicPage()
@Component({
  selector: 'page-customer',
  templateUrl: 'customer.html',
})

export class CustomerPage {
  address;
  flightNum: any;
  flightInfo: string;
  authData:AuthProvider;
  confirmm:string= 'Do you want to logout?';
  constructor(public navCtrl: NavController, authdata:AuthProvider,
  platform: Platform,public alertCtrl: AlertController, private modalCtrl: ModalController, private http: HttpClient) {
    this.authData = authdata;
    this.address = {
      place: '',
      latitude: '',
      longitude: ''
    };
  }

  showAddressModal () {
    let modal = this.modalCtrl.create(AutocompletePage);
    let me = this;
    modal.onDidDismiss(data => {
      this.address.place = data;
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': this.address.place}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          let a,b;
          a = results[0].geometry.location.lat();
          b = results[0].geometry.location.lng();
          //this.address.latitude = results[0].geometry.location.lat();
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
  
  exit(){
      let alert = this.alertCtrl.create({
        title: 'Confirm',
        message:this.confirmm,
        buttons: [{
          text: "Agree",
          handler: () => {this.logout();}
        }, {
          text: "Disagree",
          role: 'cancel'
        }]
      })
      alert.present();
  }
  
  logout(){
      this.authData.logoutUser();
      this.navCtrl.setRoot(LoginPage);
  }


  getFlightInfo(){
     // Make the HTTP request:
     this.http.get('https://taxiserver.herokuapp.com/api/load/' + this.flightNum).subscribe(data => {
      // Read the result field from the JSON response.
      this.flightInfo = "טיסה מספר: " + this.flightNum + " ממריאה בתאריך: " + data["date"] + " בשעה: " + data["time"];
      console.log(data);
      console.log(this.flightInfo);
    });
  }

}
