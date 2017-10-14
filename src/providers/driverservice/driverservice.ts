import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthProvider } from '../auth/auth';
import firebase from 'firebase';
import { Permissions } from '../../enums';
import { AlertController } from 'ionic-angular';
import { request } from '../../pages/admin/admin';
/*
  Generated class for the DriverserviceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DriverserviceProvider {
  request_drivers_table: string = 'drivers'
  constructor(public http: Http, private authData: AuthProvider, private alertCtrl: AlertController) {
    console.log('Hello DriverserviceProvider Provider');
  }
  hasDataDriverRequest(): boolean {
    var request_sent;
    var database = firebase.database().ref();
    database.child(this.request_drivers_table).child(firebase.auth().currentUser.uid).on('value', ((data) => {
      if (data.val())
        request_sent = true;
      else
        request_sent = false;

    }))
    return request_sent;
  }
  showDriverAlert(uid, request: request, requests: request[], type: string = 'success') {
    return new Promise((resolve, reject) => {
      switch (type) {

        case 'reject':
          this.alertCtrl.create({
            title: 'הודעת מערכת',
            message: 'האם אתה בטוח כי ברצונך לדחות בקשה זו?',
            buttons: [{
              text: 'כן',
              handler: () => { this.rejectDriver(uid, request, requests).then(()=>{
                resolve();
              }) }
            }, {
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
              handler: () => { this.acceptDriver(uid, request, requests).then(()=>{
                resolve();
              }) }
            }, {
              text: "לא",
              role: 'cancel'
            }]
          }).present();
          break;

      }
    })



  }
  acceptDriver(uid, request: request, requests: request[]) {
    return new Promise((resolve, reject) => {
      var num_to_delete = 1;
      var query_user = firebase.database().ref().child(this.authData.userstable).child(uid);
      query_user.update({
        permission: Permissions.Driver
      }).then(() => {
        var query_request = firebase.database().ref().child(this.request_drivers_table).child(uid)
        query_request.remove().then(() => {
          var index = requests.indexOf(request);
          requests.splice(index, num_to_delete);
          resolve();
        })
      })
    })

  }
  private removeImagesFromFireBase(uid: string, folder:string):Promise<void>{
    return new Promise((resolve,reject)=>{
      var num_of_images: number = 2;
      var type: string = '.png';
      var storage = firebase.storage().ref().child(folder).child(uid);
      for(let i=0;i<num_of_images;i++)
        storage.child('Image_'+ Number(i+1)+type).delete();
      resolve();
    })
    
  }
  rejectDriver(uid, request, requests: request[]) {
    return new Promise((resolve,reject)=>{
      var num_to_delete = 1;
      var query = firebase.database().ref().child(this.request_drivers_table).child(uid);
      query.remove().then(() => {
        this.removeImagesFromFireBase(uid,'Documents').then(() => {
          var index = requests.indexOf(request);
          requests.splice(index, num_to_delete);
          resolve();
        }).catch((error) => {
          console.log(error);
  
        })
      }).catch((error) => {
        console.log(error);
  
      })
    })
  
  }

  isDriver(): boolean {
    var uid = firebase.auth().currentUser.uid;
    var database = firebase.database().ref();
    var driver = database.child(this.authData.userstable).child(uid).child('permission');
    var is_driver;
    driver.on('value', ((snapshot) => {
      if (snapshot.val() == Permissions.Driver || snapshot.val() == Permissions.Admin)
        is_driver = true;
      else
        is_driver = false;
    }))
    return is_driver;
  }

}
