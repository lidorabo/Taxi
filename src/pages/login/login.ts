import { NavController, LoadingController, Loading, AlertController, Platform } from 'ionic-angular';
import { Component } from '@angular/core';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import firebase from 'firebase';
import { HomePage } from "../home/home";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';
import { ResetpasswordPage } from "../resetpassword/resetpassword";
import { SignupPage } from "../signup/signup";
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private mailf:string='email';
  public loginForm:FormGroup;
  private loading:Loading;
  private userInfo:any =null;
  private cordovaplat:string='cordova';
  private googlewebprovider:any=new firebase.auth.GoogleAuthProvider();
  private facebookwebprovider:any=new firebase.auth.FacebookAuthProvider();
  constructor(public navCtrl: NavController, private facebook: Facebook, private googlePlus: GooglePlus,
  private authData: AuthProvider, private formBuilder: FormBuilder, private alertCtrl: AlertController,
  private loadingCtrl: LoadingController, private platform:Platform) {
    this.loginForm = formBuilder.group({
    email: ['', Validators.compose([Validators.required, 
    EmailValidator.isValid])],
    password: ['', Validators.compose([Validators.minLength(6), 
    Validators.required])]
});
  }

  loginUser(){
  if (!this.loginForm.valid){
    console.log(this.loginForm.value);
  } else {
    this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password)
    .then( authData => {
      this.navCtrl.setRoot(HomePage); 
    }, error => {
      this.loading.dismiss().then( () => {
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

  goToResetPassword(){
    this.navCtrl.push(ResetpasswordPage);
  }

  createAccount(){  
    this.navCtrl.push(SignupPage);
  }




  facebookLogin(){
    if(this.platform.is('cordova'))
    {
      this.facebook.login(["email", "public_profile"]).then((loginResponse)=>{
        let credential = firebase.auth.FacebookAuthProvider.credential(loginResponse.authResponse.accessToken);
        this.facebook.api('me?fields=id,name,email,first_name,last_name',[]).then(profile =>{
          this.userInfo={email: profile['email'], first_name: profile['first_name'], last_name: profile['last_name'], driver: false, phone: -1}
        });
        firebase.auth().signInWithCredential(credential).then((info)=>{
          firebase.database().ref('users/' + firebase.auth().currentUser.uid).set({
          email: this.userInfo.email,
          first_name: this.userInfo.first_name,
          last_name : this.userInfo.last_name,
          phone: this.userInfo.phone,
          driver: this.userInfo.driver
        });
          this.navCtrl.setRoot(HomePage);
        })
      }) 
    }
    else{
      firebase.auth().signInWithPopup(this.facebookwebprovider).then((result) =>{
         this.navCtrl.setRoot(HomePage);
      }).catch(function(error) {
        // Handle Errors here.
        // ...
      });
    }
    
  }  

  loginGoogle(){
    if(this.platform.is(this.cordovaplat))
    {
      this.googlePlus.login({
        'webClientId': '136238361915-pacoe7gvtqbsd6bvfpu7958nlckncjl7.apps.googleusercontent.com',
        'offline': true
      }).then( res => {
        firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
          .then( success => {
              alert("Firebase success: " + JSON.stringify(success));
          })
          .catch( error => alert("Firebase failure: " + JSON.stringify(error)));
        }).catch(err => alert(err));
      }
      else{
        this.googlewebprovider.addScope(this.mailf);
        firebase.auth().signInWithPopup(this.googlewebprovider).then((result)=> {
          this.navCtrl.setRoot(HomePage)
        }).catch(function(error) {
          // Handle Errors here.
          // ...
        });
      }
    }
    
  
}


