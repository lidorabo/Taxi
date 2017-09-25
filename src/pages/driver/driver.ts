import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { AuthProvider } from '../../providers/auth/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidatorProvider } from '../../providers/validator/validator';
import { ProfilePage } from '../profile/profile';
import { DisconnectPage } from '../disconnect/disconnect';
import { FlightinfoPage } from '../flightinfo/flightinfo';
import { Page } from '../page/page';
import {MenuComponent} from '../../components/menu/menu'

/**
 * Generated class for the DriverPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-driver',
  templateUrl: 'driver.html',
})
export class DriverPage {
  private isDriverhtml:boolean = false;
  private driverRegisterForm:FormGroup;
  private car_id:string;
  private errormessage: string;  
  pages:Page[] = [new Page(FlightinfoPage,'הזמנת נסיעה'),new Page(ProfilePage,'עריכת פרטים אישיים'),new Page(DisconnectPage,'התנתק')];
  constructor(public navCtrl: NavController, public navParams: NavParams,private authData:AuthProvider,private formBuilder:FormBuilder,validator:ValidatorProvider) {
    this.driverRegisterForm = formBuilder.group({
      car_num: [this.authData.emptystring, [Validators.required]],
      car_num_image: [this.authData.emptystring, Validators.required],
      driver_license_image: [this.authData.emptystring,Validators.required],
      identity_id: [this.authData.emptystring,Validators.required]
    })
     var uid = firebase.auth().currentUser.uid;
     var database = firebase.database().ref();
     var driver = database.child(this.authData.userstable).child(uid).child('driver');
driver.on('value', ((snapshot)=> {
       //if(snapshot.val())
          this.isDriverhtml = true;
}));

  }
  sendRequest()
  {

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DriverPage');
  }

}
