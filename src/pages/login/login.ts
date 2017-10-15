import { FlightinfoPage } from './../flightinfo/flightinfo';
import { AddressPage } from './../address/address';
import { NavController, LoadingController, Loading, AlertController, Platform } from 'ionic-angular';
import { Component, Injectable } from '@angular/core';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import firebase from 'firebase';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { ResetpasswordPage } from "../resetpassword/resetpassword";
import { SignupPage } from "../signup/signup";
import {Permissions} from '../../enums'
import { PhonenumberPage } from '../phonenumber/phonenumber';
<<<<<<< HEAD
import { OrdersPage } from '../orders/orders';
=======
>>>>>>> 177aaa4f022156dba1edf846a8c132ba21376c0d
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
    } else {
      this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password)
        .then(authData => {
          this.navCtrl.setRoot(FlightinfoPage);
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
<<<<<<< HEAD
            this.userInfoDB(firebase.auth().currentUser.uid).then((op)=>{
              if(!op)
              {
                this.authData.AddUserToFireBaseDatabse(info.providerData[0].email, info.displayName.split(' ')[0], info.displayName.split(' ')[1],Permissions.User);
                this.navCtrl.setRoot(PhonenumberPage);
              }
              else
              {
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
=======
            this.havePhoneField(firebase.auth().currentUser.uid).then((op)=>{
              if(op)
              {
                this.navCtrl.setRoot(FlightinfoPage);
              }
              else
              {
                this.authData.AddUserToFireBaseDatabse(info.providerData[0].email, info.displayName.split(' ')[0], info.displayName.split(' ')[1],Permissions.User);
                this.navCtrl.setRoot(PhonenumberPage);
>>>>>>> 177aaa4f022156dba1edf846a8c132ba21376c0d
              }
            });
        })
      })
    }
    else {
      firebase.auth().signInWithPopup(this.authData.facebookwebprovider).then((user) => {
<<<<<<< HEAD
        this.userInfoDB(firebase.auth().currentUser.uid).then((op)=>{

          if(!op)
          {
            this.authData.AddUserToFireBaseDatabse(user.additionalUserInfo.profile.email, user.additionalUserInfo.profile.first_name, user.additionalUserInfo.profile.last_name, Permissions.User);
            this.navCtrl.setRoot(PhonenumberPage);
          }
          else
          {
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
          }

=======
        this.havePhoneField(firebase.auth().currentUser.uid).then((op)=>{
          if(op)
          {
            this.navCtrl.setRoot(FlightinfoPage);
          }
          else
          {
            this.authData.AddUserToFireBaseDatabse(user.additionalUserInfo.profile.email, user.additionalUserInfo.profile.first_name, user.additionalUserInfo.profile.last_name, Permissions.User);
            this.navCtrl.setRoot(PhonenumberPage);
          }
>>>>>>> 177aaa4f022156dba1edf846a8c132ba21376c0d
        });
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
<<<<<<< HEAD
            this.userInfoDB(firebase.auth().currentUser.uid).then((op)=>{
=======
            this.havePhoneField(firebase.auth().currentUser.uid).then((op)=>{
>>>>>>> 177aaa4f022156dba1edf846a8c132ba21376c0d
              if(op)
              {
                this.navCtrl.setRoot(FlightinfoPage);
              }
              else
              {
<<<<<<< HEAD
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
=======
                this.authData.AddUserToFireBaseDatabse(user.providerData[0].email, user.displayName.split(' ')[0], user.displayName.split(' ')[1], Permissions.User);
                this.navCtrl.setRoot(PhonenumberPage);
>>>>>>> 177aaa4f022156dba1edf846a8c132ba21376c0d
              }
            });
          })
          .catch(error => alert("Firebase failure: " + JSON.stringify(error)));
      }).catch(err => alert(err));
    }
    else {
      this.authData.googlewebprovider.addScope(this.authData.emailprop);
      firebase.auth().signInWithPopup(this.authData.googlewebprovider).then((result) => {
<<<<<<< HEAD
        this.userInfoDB(firebase.auth().currentUser.uid).then((op)=>{
          if(!op)
          {
            this.authData.AddUserToFireBaseDatabse(result.additionalUserInfo.profile.email, result.additionalUserInfo.profile.given_name, result.additionalUserInfo.profile.family_name, Permissions.User);
            this.navCtrl.setRoot(PhonenumberPage);
          }
          else
          {
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
=======
        this.havePhoneField(firebase.auth().currentUser.uid).then((op)=>{
          if(op)
          {
            this.navCtrl.setRoot(FlightinfoPage);
          }
          else
          {
            this.authData.AddUserToFireBaseDatabse(result.additionalUserInfo.profile.email, result.additionalUserInfo.profile.given_name, result.additionalUserInfo.profile.family_name, Permissions.User);
            this.navCtrl.setRoot(PhonenumberPage);
>>>>>>> 177aaa4f022156dba1edf846a8c132ba21376c0d
          }
        });
      }).catch(function (error) {

      });
    }


  }

<<<<<<< HEAD
  userInfoDB(uid)
  {
    return new Promise((resolve, reject)=>{
      var field:string;
      var query=firebase.database().ref('/users' + '/' +uid);
=======
  havePhoneField(uid)
  {
    return new Promise((resolve, reject)=>{
      var field:string;
      var query=firebase.database().ref('/users' + '/' +uid + '/phone');
>>>>>>> 177aaa4f022156dba1edf846a8c132ba21376c0d
      query.once('value',function(snapshot){
           resolve(snapshot.val());
           
      })
    })    
  }
}


