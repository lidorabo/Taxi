import { PhonenumberPage } from './../phonenumber/phonenumber';
import { AuthProvider } from './../../providers/auth/auth';
import { LoginPage } from './../login/login';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { HomePage } from "../home/home";
import firebase from 'firebase';
@Component({
  selector: 'page-prepage',
  templateUrl: 'prepage.html',
})
//Class of loading screen.
export class PrepagePage {
  ms: number = 5000;
  num: string = null;
  phonefirebase: string = 'phone';
  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public authdata: AuthProvider) {
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

    firebase.auth().onAuthStateChanged((user) => {
      if (user == null) {
        this.navCtrl.setRoot(LoginPage);
      }
      else {
        var uid = firebase.auth().currentUser.uid;
        var database = firebase.database().ref();
        database.child(this.authdata.userstable).child(uid).on("value", data => {
          if (data.hasChild(this.phonefirebase)) {
            this.navCtrl.setRoot(HomePage)
          }
          else {
            this.navCtrl.setRoot(PhonenumberPage);
          }

        });
      }
    })
  }
}