import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from "../home/home";
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { IonDigitKeyboardCmp, IonDigitKeyboardOptions } from '../../components/ion-digit-keyboard';
import { validators } from './../../validators/validators';

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

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder, public navParams: NavParams, private authData: AuthProvider) {
    this.phoneForm = formBuilder.group({
      phone: [this.authData.emptystring, validators.phoneValidator]
    }, );
  }

  onKeyboardButtonClick(key: any) {
    // Log the pressed key
    if(key == "right")
      this.authData.updatePhoneNumber(this.userInfo.phone);
    if (key == "left")
      this.userInfo.phone = this.userInfo.phone.substr(0, this.userInfo.phone.length - 1);
    else
      this.userInfo.phone = this.userInfo.phone + key;
  }
}