import { LoginPage } from './../login/login';
import { Component } from '@angular/core';
import { NavController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';
import firebase from 'firebase';
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  public signupForm:FormGroup;
  public loading:Loading;
  userInfo: {first_name:string, last_name: string, email: string, phone: string, pass: string, driver: boolean} = {first_name: '', last_name: '', email: '', phone: '', pass: '', driver: false};
  constructor(public nav: NavController, public authData: AuthProvider, 
    public formBuilder: FormBuilder, public fb: FormBuilder, public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController) {
    this.signupForm = formBuilder.group({
      first_name: ['', [Validators.required, Validators.minLength(2), this.nameValidator.bind(this)]],
      last_name : ['', [Validators.required, Validators.minLength(2), this.nameValidator.bind(this)]],
      phone: ['', this.phoneValidator.bind(this)],
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      confirmPassword: ['', ]
    }, {validator: this.matchingPasswords('password', 'confirmPassword')})
  }
  

  private phoneValidator(control: FormControl): {[s: string]: boolean} {
    if (control.value !== '') {
      if (!control.value.match('\\(?\\d{3}\\)?-? *\\d{3}-? *-?\\d{4}')) {
        return {invalidPhone: true};
      }
    }
  }

  private nameValidator(control: FormControl): {[s: string]: boolean} {
    if (!control.value.match("^[a-zA-Z ,.'-]+$")) {
      return {invalidName: true};
    }
  }

  private matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
  return (group: FormGroup) => {
    let passwordInput = group.controls[passwordKey];
    let passwordConfirmationInput = group.controls[passwordConfirmationKey];
    if (passwordInput.value !== passwordConfirmationInput.value) {
      return passwordConfirmationInput.setErrors({notEquivalent: true})
    }
  }
}


  /**
   * If the form is valid it will call the AuthData service to sign the user up password displaying a loading
   *  component while the user waits.
   *
   * If the form is invalid it will just log the form value, feel free to handle that as you like.
   */
  signupUser(){
      this.authData.signupUser(this.signupForm.value.email, this.signupForm.value.password)
      .then(() => {
        firebase.database().ref('users/' + firebase.auth().currentUser.uid).set({
        email: this.userInfo.email,
        first_name: this.userInfo.first_name,
        last_name : this.userInfo.last_name,
        phone: this.userInfo.phone,
        driver: this.userInfo.driver
      });
        this.nav.setRoot(LoginPage);
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