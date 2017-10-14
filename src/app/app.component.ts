import { Component, ViewChild } from '@angular/core';
import { Platform, LoadingController, NavController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PhonenumberPage } from './../pages/phonenumber/phonenumber';
import { OrdersPage } from './../pages/orders/orders';
import { DisconnectPage } from '../pages/disconnect/disconnect';
import { ProfilePage } from '../pages/profile/profile';
import { DriverPage } from '../pages/driver/driver';
import { FlightinfoPage } from './../pages/flightinfo/flightinfo';
import { Page } from '../pages/page/page';
import { AuthProvider } from '../providers/auth/auth';
import { LoginPage } from '../pages/login/login';
import { DriverserviceProvider } from '../providers/driverservice/driverservice';
import { AdminPage } from '../pages/admin/admin';
import firebase from "firebase";

export interface PageInterface {
  title: string,
  page: any
}
@Component({
  templateUrl: 'app.html'
})



export class MyApp {
  pages: PageInterface[] = [{ title: 'ניהול', page: AdminPage },
  { title: 'נהג', page: DriverPage },
  { title: 'הזמנת נסיעה', page: FlightinfoPage },
  { title: 'עריכת פרטים אישיים', page: ProfilePage },
  { title: 'התנתק', page: DisconnectPage }]
  @ViewChild('content') navCtrl: NavController;
  ms = 5000;
  phonefirebase: string = 'phone';
  public static menu_flight_admin = 'flight_admin';
  public static menu_admin = 'admin';
  public static menu_flight_user = 'flight_user';
  public static menu_driver_user = 'driver_user';
  public static menu_driver_admin = 'driver_admin';
  private confirmm:string = 'האם אתה בטוח כי ברצונך להתנתק?'
  public rootPage: any;
  

  

  constructor(private platform: Platform, public authdata: AuthProvider, public loadingCtrl: LoadingController, private splashScreen: SplashScreen, private statusBar: StatusBar, private alertCtrl: AlertController, private authData: AuthProvider, private driver: DriverserviceProvider) {
   this.RedirectUser().then((page)=>{
    this.rootPage = page;
   })
 
    platform.ready().then(() => {      
      //this.rootPage = PhonenumberPage;
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    })

  }

  RedirectUser() {
    return new Promise((resolve, reject)=>{
      const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        
        if (user == null) {
          resolve(LoginPage);
          unsubscribe();
        }
        else {
          this.havePhoneField(firebase.auth().currentUser.uid).then((op)=>{
            if(op)
            {
              resolve(FlightinfoPage);
              unsubscribe();
            }
            else
            {
              resolve(PhonenumberPage);
              unsubscribe();
            }
          });    
        }
      })
    });
  }

  havePhoneField(uid)
  {
    return new Promise((resolve, reject)=>{
      var field:string;
      var query=firebase.database().ref('/users' + '/' +uid + '/phone');
      query.once('value',function(snapshot){
           resolve(snapshot.val());
           
      })
    })    
  }

  checkPage(page) {
    switch (page) {
      case (DriverPage):

        if (this.driver.isDriver())
          this.navCtrl.setRoot(page);
        else {
          if (this.driver.hasDataDriverRequest()) {
            this.showNotDriverAlaert();
          }
          else {
            this.navCtrl.push(page);
          }
        }
        break;
      case (DisconnectPage):
        this.exit();
        break;
      case (AdminPage):
        this.navCtrl.setRoot(page);
        break;

      default:
        this.navCtrl.push(page);
        break;


    }

  }
  exit() {
    let alert = this.alertCtrl.create({
      title: 'התנתקות',
      message: this.confirmm,
      buttons: [{
        text: "כן",
        handler: () => { this.logout(); }
      }, {
        text: "לא",
        role: 'cancel'
      }]
    })
    alert.present();
  }
  logout() {
    this.authData.logoutUser();
    this.navCtrl.setRoot(LoginPage);
  }
  showNotDriverAlaert() {
    this.alertCtrl.create({
      title: 'הודעת מערכת',
      message: 'בקשתך נשלחה ונמצאת בבדיקה',
      buttons: [{
        text: "אישור",
        handler: () => { this.navCtrl.setRoot(FlightinfoPage) }
      }]
    })
      .present();
  }
}