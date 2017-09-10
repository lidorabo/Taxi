import { Component } from '@angular/core';
import { IonicPage,NavController, AlertController, Platform, ModalController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from "../login/login";
import { AutocompletePage } from "../autocomplete/autocomplete";
import { HttpClient } from "@angular/common/http";



@IonicPage()
@Component({
  selector: 'page-customer',
  templateUrl: 'customer.html',
})

export class CustomerPage {
  address;
  flightNum: any;
  authData:AuthProvider;
  confirmm:string= 'Do you want to logout?';
  constructor(public navCtrl: NavController, authdata:AuthProvider,
  platform: Platform,public alertCtrl: AlertController, private modalCtrl: ModalController, private http: HttpClient) {
    this.authData = authdata;
    this.address = {
      place: ''
    };
  }

  showAddressModal () {
    let modal = this.modalCtrl.create(AutocompletePage);
    let me = this;
    modal.onDidDismiss(data => {
      this.address.place = data;
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


  testFlight(){
     // Make the HTTP request:
     this.http.get('https://taxiserver.herokuapp.com/api/load/' + this.flightNum).subscribe(data => {
      // Read the result field from the JSON response.
      console.log(data);
    });
  }

}
