import { ValidatorProvider } from './../../providers/validator/validator';
import { Component } from '@angular/core';
import { NavController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import firebase from 'firebase';
import {Permissions} from '../../enums'
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})

export class SignupPage {
  public signupForm:FormGroup;
  public loading:Loading;
  userInfo: {first_name:string, last_name: string, email: string, phone: string, pass:string, permission: number} = {first_name: this.authData.emptystring, last_name: this.authData.emptystring, email: this.authData.emptystring, phone: this.authData.emptystring , pass:this.authData.emptystring, permission: Permissions.User}; 
  constructor(public nav: NavController, public authData: AuthProvider, 
    public formBuilder: FormBuilder, public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController, validator:ValidatorProvider) {
    this.signupForm = formBuilder.group({
      first_name: [this.authData.emptystring, [Validators.required, Validators.minLength(2)]],
      last_name : [this.authData.emptystring, [Validators.required, Validators.minLength(2),]],
      phone: [this.authData.emptystring],
      email: [this.authData.emptystring, Validators.compose([Validators.required,Validators.email])],
      password: [this.authData.emptystring, Validators.compose([Validators.minLength(6), Validators.required])],
      confirmPassword: [this.authData.emptystring, ]
    }, {validator: validator.matchingPasswords('password', 'confirmPassword')})

  }
   
  signupUser(){
      this.authData.signupUser(this.signupForm.value.email, this.signupForm.value.password)
      .then(() => {
        this.authData.afAuth.auth.signOut();
        this.authData.AddUserToFireBaseDatabse(this.userInfo.email,this.userInfo.first_name,this.userInfo.last_name,this.userInfo.permission);
        this.authData.updatePhoneNumber(this.userInfo.phone);
      }, (error) => {
        this.loading.dismiss().then( () => {
          var errorMessage: string = error.message;
            let alert = this.alertCtrl.create({
              message: errorMessage,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
          alert.present();
        });
      });

      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();
    }
}



