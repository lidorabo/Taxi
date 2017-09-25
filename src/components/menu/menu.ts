import { Component, Input } from '@angular/core';
import { DriverPage } from '../../pages/driver/driver';
import { ProfilePage } from '../../pages/profile/profile';
import { DisconnectPage } from '../../pages/disconnect/disconnect';
import { NavController, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from '../../pages/login/login';

/**
 * Generated class for the MenuComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'menu',
  templateUrl: 'menu.html',
  inputs:[ 'pages' ]
})
export class MenuComponent {
  confirmm:string= 'האם אתה בטוח כי אתה רוצה להתנתק?';
  @Input() title;
  constructor(public navCtrl:NavController,private authData:AuthProvider,private alertCtrl:AlertController) {
  }
  checkPage(page) {
    switch(page){
      case(DriverPage):
        this.navCtrl.setRoot(page);
         break;
      case(DisconnectPage):
         this.exit();
         break;
     default:
       this.navCtrl.push(page);
      
 
    }
     
   }
   exit(){
    let alert = this.alertCtrl.create({
      title: 'התנתקות',
      message:this.confirmm,
      buttons: [{
        text: "כן",
        handler: () => {this.logout();}
      }, {
        text: "לא",
        role: 'cancel'
      }]
    })
    alert.present();
}
logout(){
  this.authData.logoutUser();
  this.navCtrl.setRoot(LoginPage);
}
}
