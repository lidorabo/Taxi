import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import {Permissions} from '../../enums'


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
  constructor(public afAuth: AngularFireAuth) {
  }

  loginUser(newEmail: string, newPassword: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(newEmail, newPassword)
  }

  resetPassword(email: string): Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  signupUser(newEmail: string, newPassword: string): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(newEmail,newPassword);
  }

  logoutUser(): Promise<any> {
    return this.afAuth.auth.signOut();
  }
  AddUserToFireBaseDatabse(email: string, firstname: string, lastname: string, permission: number): void {
    firebase.database().ref(this.userstable + '/' + firebase.auth().currentUser.uid).set({
      email: email,
      first_name: firstname,
      last_name: lastname,
      permission: Permissions.User
    });
    
  }
  public updatePhoneNumber(phonen:string):void{
    firebase.database().ref(this.userstable + '/' + firebase.auth().currentUser.uid).update({
      phone:phonen
    })
  }
  is_Admin(){
    var database = firebase.database().ref();
    var is_admin = false;
    database.child(this.userstable).child(firebase.auth().currentUser.uid).child('permission').on('value',((data)=>{
        if(data.val() == Permissions.Admin)
            is_admin = true;
    }))
    console.log(is_admin);
    return is_admin;
  }
  public getValueFromDatabaseOnce(path:string):any{
    var field:string;
    var query=firebase.database().ref('/'+this.userstable+ '/' +path);
    query.once('value',function(snapshot){
         field=snapshot.val();
    })
    return field;
  }
}