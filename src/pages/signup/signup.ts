import { validators } from './../../validators/validators';
import { LoginPage } from './../login/login';
import { Component } from '@angular/core';
import { NavController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import firebase from 'firebase';
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})

export class SignupPage {
  public signupForm:FormGroup;
  public loading:Loading;
  userInfo: {first_name:string, last_name: string, email: string, phone: string, pass:string, driver: boolean} = {first_name: this.authData.emptystring, last_name: this.authData.emptystring, email: this.authData.emptystring, phone: this.authData.emptystring , pass:this.authData.emptystring, driver: false}; 
  constructor(public nav: NavController, public authData: AuthProvider, 
    public formBuilder: FormBuilder, public fb: FormBuilder, public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController) {
    this.signupForm = formBuilder.group({
      first_name: [this.authData.emptystring, [Validators.required, Validators.minLength(2),validators.nameValid]],
      last_name : [this.authData.emptystring, [Validators.required, Validators.minLength(2), validators.nameValid]],
      phone: [this.authData.emptystring, validators.phoneValidator],
      email: [this.authData.emptystring, Validators.compose([Validators.required,Validators.email])],
      password: [this.authData.emptystring, Validators.compose([Validators.minLength(6), Validators.required])],
      confirmPassword: [this.authData.emptystring, ]
    }, {validator: this.authData.matchingPasswords('password', 'confirmPassword')})

  }
   
  signupUser(){
      this.authData.signupUser(this.signupForm.value.email, this.signupForm.value.password)
      .then(() => {
        this.authData.afAuth.auth.signOut();
        this.authData.AddUserToFireBaseDatabse(this.userInfo.email,this.userInfo.first_name,this.userInfo.last_name,this.userInfo.phone,this.userInfo.driver);
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



