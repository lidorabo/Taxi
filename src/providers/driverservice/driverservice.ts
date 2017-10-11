import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthProvider } from '../auth/auth';
import firebase from 'firebase';
import {Permissions} from '../../enums';
import { AlertController } from 'ionic-angular';
/*
  Generated class for the DriverserviceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DriverserviceProvider {
   request_drivers_table: string = 'drivers'
  constructor(public http: Http,private authData:AuthProvider,private alertCtrl:AlertController) {
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
  showDriverAlert(uid,type){
    switch(type){

      case 'reject':
          this.alertCtrl.create({
            title:'הודעת מערכת',
            message: 'האם אתה בטוח כי ברצונך לדחות בקשה זו?',
            buttons: [{
              text: 'כן',
              handler: ()=>{this.rejectDriver(uid)}
            },{
              text: 'לא',
              role: 'cancel'
            }]
            
          }).present();
          break;
      default:
      this.alertCtrl.create({
        title: 'הודעת מערכת',
        message: 'האם אתה בטוח כי ברצונך לאשר בקשה זו?',
        buttons: [{
          text: "כן",
          handler: () => { this.acceptDriver(uid); }
        },{
          text: "לא",
          role: 'cancel'
        }]
      }).present();
      break;

    }
  
 
  }
  acceptDriver(uid){
    var query_user = firebase.database().ref().child(this.authData.userstable).child(uid);
    query_user.update({
        permission: Permissions.Driver
    }).then(()=>{
      var query_request = firebase.database().ref().child(this.request_drivers_table).child(uid)
      query_request.remove().then(()=>{
        
      })
    })
  }
  rejectDriver(uid){
    var query = firebase.database().ref().child(this.request_drivers_table).child(uid);
    query.remove().then(()=>{
    }).then(()=>{
      var storage = firebase.storage().ref().child('Documents').child(uid);
      storage.delete().then(()=>{
        console.log(uid+'is not driver');
      }).catch((error)=>{
        console.log(error);
        
      })
    }).catch((error)=>{
      console.log(error);
      
    })
  }
  
  isDriver():boolean {
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
