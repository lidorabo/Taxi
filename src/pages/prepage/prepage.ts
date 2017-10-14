import { OrdersPage } from './../orders/orders';
import { PhonenumberPage } from './../phonenumber/phonenumber';
import { AuthProvider } from './../../providers/auth/auth';
import { LoginPage } from './../login/login';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';
import * as socketIo from 'socket.io-client';

@Component({
  selector: 'page-prepage',
  templateUrl: 'prepage.html',
})
//Class of loading screen.
export class PrepagePage {

  ms: number = 5000;
  num: string = null;
  phonefirebase: string = 'phone';
  constructor(public navCtrl: NavController, private splashScreen: SplashScreen, public platform: Platform,public loadingCtrl: LoadingController, public authdata: AuthProvider) {
    // const socket = socketIo('http://localhost:3000');
    // socket.on('hello', (data) => console.log(data));
      this.RedirectUser();
    
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
            this.navCtrl.setRoot(OrdersPage);
          }
          else {
            this.navCtrl.setRoot(PhonenumberPage);
          }

        });
      }
    })
  }
}