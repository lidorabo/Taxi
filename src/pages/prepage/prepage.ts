import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { LoginPage } from "../login/login";
import { HomePage } from "../home/home";
import firebase from 'firebase';
@Component({
  selector: 'page-prepage',
  templateUrl: 'prepage.html',
})
//Class of loading screen.
export class PrepagePage {
  ms: number = 5000;
  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController) {
    this.redirectLoginPage();
  }
  //This function waiting according to milliseconds.
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  //This function redirect to login screen.
  async redirectLoginPage() {
    await this.sleep(this.ms);
    this.RedirectUser();

  }
  RedirectUser() {
    var user = firebase.auth().currentUser;
    //If user logged in.
    if (user) {
      this.navCtrl.setRoot(HomePage);
    }
    //If user logged out.
    else {
      this.navCtrl.setRoot(LoginPage);
    }
  }
}