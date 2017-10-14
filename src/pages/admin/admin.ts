import { Component} from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { MyApp } from '../../app/app.component';
import firebase from 'firebase';
import { DriverserviceProvider } from '../../providers/driverservice/driverservice';
import { Slides } from 'ionic-angular';
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
  documents: any [],
  uid: string
}
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {

  private has_requests_html: boolean;
  private requests: request[] = [];
  private num_of_images: number = 2;
  private type:string = '.png';
  private SlideOptions = {
    pager:true
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private authData: AuthProvider, private menu: MenuController, private driver: DriverserviceProvider) {
    this.getRequests(()=>{
    });
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
  private getPrivateInfo(uid: string,callback){
    debugger;
    var user_query = firebase.database().ref().child(this.authData.userstable).child(uid);
    var first_name;
    var last_name;
    user_query.once('value', (answer) => {
      first_name = answer.child('first_name').val();
      last_name = answer.child('last_name').val();
    }).then(()=>{
        callback(first_name,last_name);
    })
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
  private getDocuments(uid,callback, pictures_uri = [], mone = 0): void {
    if (pictures_uri.length == this.num_of_images)
    {
      callback(pictures_uri,uid);
    }
    else
    {
      this.pushDocument(++mone,uid,pictures_uri).then(()=>{
        this.getDocuments(uid,callback, pictures_uri, mone);
      })
    }  
    
   
  }
  private pushRequests(children:any[],callback){
    if(children.length == 0)
          callback();
    else{
      var child = children.pop();
      this.getDocuments(child.key,(pictures,key)=>{
        this.getPrivateInfo(key,(first_name,last_name)=>{
             this.requests.push({
            first_name: first_name,
            last_name: last_name,
            car_num: child.val().car_num,
            identity_id: child.val().identity_id,
            documents: pictures,
            uid: child.key
          })
          this.pushRequests(children,callback);
        })   
      });
      
    }
   
  }
  private getRequests(callback) {
    var request_database = firebase.database().ref().child(this.driver.request_drivers_table);
    var first_name:string;
    var last_name:string;
    var car_num:string;
    var identity_id:string;
    var files:any[]; 
    var children:any[]=[];
    this.checkHasRequsts().then(() => {
      this.has_requests_html = true;
      request_database.once('value', database => {
            database.forEach((child)=>{
              children.push(child);
            return false;
            })         
      }).then(()=>{
          this.pushRequests(children,()=>{
            callback();
            
          })
      })

      }).catch(()=>{
           
            
      })
  }
  ionViewDidEnter() {
    this.menu.enable(false, MyApp.menu_flight_user);
    this.menu.enable(true, MyApp.menu_admin);
    this.menu.enable(false, MyApp.menu_driver_user);
    this.menu.enable(false, MyApp.menu_driver_admin);
    this.menu.enable(false, MyApp.menu_flight_admin);
  }


}