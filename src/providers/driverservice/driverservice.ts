import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthProvider } from '../auth/auth';
import firebase from 'firebase';
import {Permissions} from '../../enums';
/*
  Generated class for the DriverserviceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DriverserviceProvider {
   request_drivers_table: string = 'drivers'
  constructor(public http: Http,private authData:AuthProvider) {
    console.log('Hello DriverserviceProvider Provider');
  }
  hasDataDriverRequest():boolean{
    var request_sent;
    var database = firebase.database().ref();
    database.child(this.request_drivers_table).child(firebase.auth().currentUser.uid).on('value',((data)=>{
        if(data.val())
          request_sent = true;
        else
          request_sent = false;
         
    }))
    return request_sent;
  }
  isDriver():boolean {
    debugger;
    var uid = firebase.auth().currentUser.uid;
    var database = firebase.database().ref();
    var driver = database.child(this.authData.userstable).child(uid).child('permission');
    var is_driver;
    driver.on('value', ((snapshot) => {
      if (snapshot.val()==Permissions.Driver || snapshot.val() == Permissions.Admin)
        is_driver = true;
      else 
        is_driver = false;
    }))
    return is_driver;
  }

}
