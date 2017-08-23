import { FormControl, FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import * as admin from 'firebase-admin';
@Injectable()
export class AuthProvider {
  public readonly webclientidprop: string = 'webClientId';
  public readonly clientidgoogle: string = '136238361915-pacoe7gvtqbsd6bvfpu7958nlckncjl7.apps.googleusercontent.com';
  public googlewebprovider: any = new firebase.auth.GoogleAuthProvider();
  public facebookwebprovider: any = new firebase.auth.FacebookAuthProvider();
  public status: string = 'offline';
  public emailprop: string = 'email';
  public emptystring: string = '';
  public userstable = 'users'
  user: Observable<firebase.User>;
  constructor(public afAuth: AngularFireAuth) {
    this.user = afAuth.authState;
  }

  loginUser(newEmail: string, newPassword: string): firebase.Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(newEmail, newPassword)
  }

  resetPassword(email: string): firebase.Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  signupUser(newEmail: string, newPassword: string): firebase.Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(newEmail,newPassword);
  }

  logoutUser(): firebase.Promise<any> {
    return this.afAuth.auth.signOut();
  }
  matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey];
      let passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true })
      }
    }
  }
  AddUserToFireBaseDatabse(email: string, firstname: string, lastname: string, driver: boolean): void {

    firebase.database().ref(this.userstable + '/' + firebase.auth().currentUser.uid).set({
      email: email,
      first_name: firstname,
      last_name: lastname,
      driver: driver
    });
    
  }
  public updatePhoneNumber(phonen:string):void{
    firebase.database().ref(this.userstable + '/' + firebase.auth().currentUser.uid).update({
      phone:phonen
    })
  }
  public getValueFromDatabase(path:string):any{
    var field:string;
    var query=firebase.database().ref('/'+this.userstable+ '/' +path);
    query.once('value',function(snapshot){
         field=snapshot.val();
    })
    return field;
  }
}