import { FlightinfoPage } from './../flightinfo/flightinfo';
import { OrdersPage } from './../orders/orders';
import { ValidatorProvider } from './../../providers/validator/validator';
import { Component} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { FormBuilder, FormGroup } from '@angular/forms';
import {IonDigitKeyboardOptions } from '../../components/ion-digit-keyboard';
import { AdminPage } from '../admin/admin';

/**
 * Generated class for the PhonenumberPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-phonenumber',
  templateUrl: 'phonenumber.html',
})
export class PhonenumberPage {
  message: string ="מספר הטלפון שהוזן אינו תקין"
  displayerror:boolean = true;
  userInfo: { phone: string } = { phone: "" };
  icon: string = 'ios-close-circle-outline';
  public phoneForm: FormGroup;
  public keyboardSettings: IonDigitKeyboardOptions = {
    align: 'center',
    //width: '85%',
    visible: false,
    leftActionOptions: {
      iconName: 'ios-backspace-outline',
      fontSize: '1.4em'
    },
    rightActionOptions: {
      iconName: this.icon,
      fontSize: '1.3em',
      hidden: false
    },
    roundButtons: false,
    showLetters: false,
    swipeToHide: true,
    theme: 'ionic'
  }

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder, public navParams: NavParams, private authData: AuthProvider,validator:ValidatorProvider) {
    this.phoneForm = formBuilder.group({
      phone: [this.authData.emptystring, validator.phoneValidator]
    });
  }

  onKeyboardButtonClick(key: any) {
    // Log the pressed key
    if(key == "right")
    {
      this.message = '';      
      this.authData.updatePhoneNumber(this.userInfo.phone);
      //this.navCtrl.setRoot(LoginPage);
      this.navCtrl.setRoot(FlightinfoPage);
      this.userInfoDB(firebase.auth().currentUser.uid).then((op)=>{
        if(op['status'] == 0)
        {
          this.navCtrl.setRoot(FlightinfoPage);
        }
        else if(op['status'] == 1)
        {
          this.navCtrl.setRoot(OrdersPage);
        }
        else
        {
          console.log("not good");
          console.log(JSON.stringify(op));
          this.navCtrl.setRoot(FlightinfoPage);
        }
      });  
      
    } 
    else if (key == "left")
      this.userInfo.phone = this.userInfo.phone.substr(0, this.userInfo.phone.length - 1);
    else
      {
      this.userInfo.phone = this.userInfo.phone + key;
      
      }
<<<<<<< HEAD
  }

  userInfoDB(uid)
  {
    return new Promise((resolve, reject)=>{
      var field:string;
      var query=firebase.database().ref('/users' + '/' +uid);
      query.once('value',function(snapshot){
           resolve(snapshot.val());
           
      })
    })    
=======
>>>>>>> 177aaa4f022156dba1edf846a8c132ba21376c0d
  }
}
