import { Component} from '@angular/core';
import { Platform, LoadingController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PrepagePage } from '../pages/prepage/prepage';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  ms = 5000;
  public rootPage:any=PrepagePage;
  constructor(private platform: Platform,public loadingCtrl: LoadingController, private splashScreen: SplashScreen,private statusBar: StatusBar) {
    platform.ready().then(() => {
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

  }

}