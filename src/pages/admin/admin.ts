import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { MyApp } from '../../app/app.component';
import firebase from 'firebase';
import { DriverserviceProvider } from '../../providers/driverservice/driverservice';

/**
 * Generated class for the AdminPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
export interface request {
  first_name: string,
  last_name: string,
  car_num: string,
  identity_id: string,
  documents: any []
}
@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {
  private has_requests_html: boolean;
  private requests: request[] = [];
  private num_of_images: number = 2;
  private type:string = '.png';
  constructor(public navCtrl: NavController, public navParams: NavParams, private authData: AuthProvider, private menu: MenuController, private driver: DriverserviceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPage');
    debugger;
    this.getRequests();
    console.log(this.requests);
    
  }
  private checkHasRequsts(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      var request_database = firebase.database().ref('/' + this.driver.request_drivers_table);
      request_database.once('value', database => {
        if (database.hasChildren())
          resolve();
        reject();
      }, (error) => {
        console.log(error);
      })
    })
  }
  private getPrivateInfo(uid: string): string[] {
    var user_query = firebase.database().ref().child(this.authData.userstable).child(uid);
    var first_name;
    var last_name;
    user_query.on('value', (answer) => {
      first_name = answer.child('first_name').val();
      last_name = answer.child('last_name').val();
    })
    return [first_name, last_name];
  }
  private pushDocument(num_image:number,uid:string,pictures_uri:any[]):Promise<void>{
    var documents = firebase.storage().ref().child('Documents').child(uid);
    return new Promise((resolve,reject)=>{
      documents.child('Image' + '_' + num_image+this.type).getDownloadURL().then((uri) => {
        pictures_uri.push(uri);
        resolve();
    }).catch(()=>{
      reject();
    })
  })
}
  private getDocuments(uid, pictures_uri = [], mone = 0): any[] {
    if (pictures_uri.length == this.num_of_images)
      return pictures_uri
      this.pushDocument(++mone,uid,pictures_uri).then(()=>{
      this.getDocuments(uid, pictures_uri, mone);
      }).catch(()=>{
        console.log('failed');
      }
    )
  }
  private getRequests() {
    debugger;
    var request_database = firebase.database().ref().child(this.driver.request_drivers_table);
    var first_name:string;
    var last_name:string;
    var car_num:string;
    var identity_id:string;
    var files:any[]; 
    this.checkHasRequsts().then(() => {
      request_database.once('value', database => {
            database.forEach((child)=>{
            this.requests.push({
              
            })
            return false;
            })
        
      }).catch(() => {
        console.log('Has not requests');

      })
    })

    // {
    //   name: this.getPrivateInfo(child.key)[0],
    //   last_name: this.getPrivateInfo(child.key)[1],
    //   car_num: child.val().car_num,
    //   identity_id: child.val().identity_id,
    //  }

  }
  ionViewDidEnter() {
    this.menu.enable(false, MyApp.menu_flight_user);
    this.menu.enable(true, MyApp.menu_admin);
    this.menu.enable(false, MyApp.menu_driver_user);
    this.menu.enable(false, MyApp.menu_driver_admin);
    this.menu.enable(false, MyApp.menu_flight_admin);
  }


}
