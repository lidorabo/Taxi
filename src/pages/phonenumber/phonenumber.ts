import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from "../home/home";

/**
 * Generated class for the PhonenumberPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-phonenumber',
  templateUrl: 'phonenumber.html',
})
export class PhonenumberPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private authData: AuthProvider) {
  }

  openFilters() {
    this.authData.updatePhoneNumber('0545719050');
    
  }

}