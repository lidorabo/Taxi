import { NavController, LoadingController, Loading, AlertController, Platform } from 'ionic-angular';
import { Component, Injectable } from '@angular/core';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import firebase from 'firebase';
import { HomePage } from "../home/home";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { ResetpasswordPage } from "../resetpassword/resetpassword";
import { SignupPage } from "../signup/signup";
@Injectable()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public loginForm: FormGroup;
  private loading: Loading;
  private userInfo: any = null;
  private cordovaplat: string = 'cordova';
  constructor(public navCtrl: NavController, private facebook: Facebook, private googlePlus: GooglePlus,
    private authData: AuthProvider, private formBuilder: FormBuilder, private alertCtrl: AlertController,
    private loadingCtrl: LoadingController, private platform: Platform) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required,
      Validators.email])],
      password: ['', Validators.compose([Validators.minLength(6),
      Validators.required])]
    });
  }

  loginUser(): void {
    if (!this.loginForm.valid) {
      console.log(this.loginForm.value);
    } else {
      this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password)
        .then(authData => {
          this.navCtrl.setRoot(HomePage);
        }, error => {
          this.loading.dismiss().then(() => {
            let alert = this.alertCtrl.create({
              message: error.message,
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

  goToResetPassword(): void {
    this.navCtrl.push(ResetpasswordPage);
  }

  createAccount(): void {
    this.navCtrl.push(SignupPage);
  }




  facebookLogin(): void {
    if (this.platform.is(this.cordovaplat)) {
      this.facebook.login(["email", "public_profile"]).then((loginResponse) => {
        let credential = firebase.auth.FacebookAuthProvider.credential(loginResponse.authResponse.accessToken);
        firebase.auth().signInWithCredential(credential).then((info) => {
          if (this.authData.getValueFromDatabaseOnce(firebase.auth().currentUser.uid) == null)
            this.authData.AddUserToFireBaseDatabse(info.providerData[0].email, info.displayName.split(' ')[0], info.displayName.split(' ')[1], false);
        })
      })
    }
    else {
      firebase.auth().signInWithPopup(this.authData.facebookwebprovider).then((user) => {
        if (this.authData.getValueFromDatabaseOnce(firebase.auth().currentUser.uid) == null)
          this.authData.AddUserToFireBaseDatabse(user.additionalUserInfo.profile.email, user.additionalUserInfo.profile.first_name, user.additionalUserInfo.profile.last_name, false);
      }).catch(function (error) {
      });
    }

  }

  loginGoogle(): void {
    if (this.platform.is(this.cordovaplat)) {
      this.googlePlus.login({
        'webClientId': this.authData.clientidgoogle,
        'offline': true
      }).then(res => {
        firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
          .then(user => {
            if (this.authData.getValueFromDatabaseOnce(firebase.auth().currentUser.uid) == null)
              this.authData.AddUserToFireBaseDatabse(user.providerData[0].email, user.displayName.split(' ')[0], user.displayName.split(' ')[1], false);
            this.navCtrl.setRoot(HomePage);
          })
          .catch(error => alert("Firebase failure: " + JSON.stringify(error)));
      }).catch(err => alert(err));
    }
    else {
      this.authData.googlewebprovider.addScope(this.authData.emailprop);
      firebase.auth().signInWithPopup(this.authData.googlewebprovider).then((result) => {
        if (this.authData.getValueFromDatabaseOnce(firebase.auth().currentUser.uid) == null)
          this.authData.AddUserToFireBaseDatabse(result.additionalUserInfo.profile.email, result.additionalUserInfo.profile.given_name, result.additionalUserInfo.profile.family_name, false);
        this.navCtrl.setRoot(HomePage)
      }).catch(function (error) {

      });
    }


  }
}


