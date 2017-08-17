import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { PrepagePage } from '../pages/prepage/prepage';
import { LoginPage } from '../pages/login/login';
import { Facebook } from '@ionic-native/facebook'
import { GooglePlus } from '@ionic-native/google-plus';
import { AuthProvider } from '../providers/auth/auth';
import { HomePage } from '../pages/home/home';
// Importing AF2 Module
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { SignupPage } from "../pages/signup/signup";
import { ResetpasswordPage } from "../pages/resetpassword/resetpassword";
import firebase from 'firebase';

// Initialize Firebase
  export const config = {
    apiKey: "AIzaSyCtY_BAKROjnZykQhdiUXb6q4uJnrxCrS8",
    authDomain: "mytaxi-4aa3b.firebaseapp.com",
    databaseURL: "https://mytaxi-4aa3b.firebaseio.com",
    projectId: "mytaxi-4aa3b",
    storageBucket: "mytaxi-4aa3b.appspot.com",
    messagingSenderId: "136238361915"
  };
  firebase.initializeApp(config);

@NgModule({
  declarations: [
    MyApp,
    PrepagePage,
    LoginPage,
    SignupPage,
    ResetpasswordPage,
    HomePage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PrepagePage,
    LoginPage,
    SignupPage,
    ResetpasswordPage,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Facebook, GooglePlus,
    AuthProvider
  ]
})
export class AppModule {}
