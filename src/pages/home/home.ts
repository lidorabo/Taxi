import { Component } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from "../login/login";
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  authData:AuthProvider;
  confirmm:string= 'Do you want to logout?';
  constructor(public navCtrl: NavController, authdata:AuthProvider,
  platform: Platform,public alertCtrl: AlertController,) {
    this.authData = authdata;
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
}
