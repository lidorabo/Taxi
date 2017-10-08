import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { MyApp } from '../../app/app.component';

/**
 * Generated class for the AdminPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private authData:AuthProvider,private menu:MenuController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPage');
  }
  ionViewDidEnter() {
      this.menu.enable(false,MyApp.menu_flight_user);
      this.menu.enable(true,MyApp.menu_admin);
      this.menu.enable(false,MyApp.menu_driver_user);
      this.menu.enable(false,MyApp.menu_driver_admin);
      this.menu.enable(false,MyApp.menu_flight_admin);
    }
      

}
