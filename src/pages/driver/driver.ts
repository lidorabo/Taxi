import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidatorProvider } from '../../providers/validator/validator';
import { ProfilePage } from '../profile/profile';
import { DriverserviceProvider } from '../../providers/driverservice/driverservice';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import firebase from 'firebase';
import { FlightinfoPage } from '../flightinfo/flightinfo';
import { MyApp } from '../../app/app.component';
/**
 * Generated class for the DriverPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-driver',
  templateUrl: 'driver.html',
})
export class DriverPage {
  private isDriverhtml: boolean;
  private driverRegisterForm: FormGroup;
  private car_id: string;
  private errormessage: string;
  private identity_id_num: string;
  private num_of_images: string = 'לא נבחרו קבצים';
  private uri_64base_images: any = [];
  private image_type:string = 'png';
  private code_networkerror = 'storage/retry-limit-exceeded'
  constructor(public navCtrl: NavController, private authData: AuthProvider, private formBuilder: FormBuilder, private menu: MenuController, private driver: DriverserviceProvider, validator: ValidatorProvider, private imagePicker: ImagePicker, private alertCtrl: AlertController) {
    this.isDriverhtml = driver.isDriver();
    this.driverRegisterForm = formBuilder.group({
      car_num: [this.authData.emptystring, [Validators.required, validator.carId_NumValidator]],
      identity_id: [this.authData.emptystring, [Validators.required, validator.identityId_Validator]]
    })

  }
  uploadPicturesToFirebase(documents, success, fail, mone = 0) {
    if (documents.length == 0) {
      success();
    }
    var storageRef = firebase.storage().ref();
    var reference_document_by_uid = storageRef.child('Documents').child(firebase.auth().currentUser.uid).child('Image' + '_' + ++mone + '.'+this.image_type);
    var picture:string = documents.pop();   
    reference_document_by_uid.putString(picture, 'base64', { contentType: 'image/'+this.image_type }).then(() => {
      this.uploadPicturesToFirebase(documents, success, fail, mone)
    }).catch((error: Error) => {
      if(error['code'] == this.code_networkerror)
        fail();
      else
        this.uploadPicturesToFirebase(documents, success, fail, mone)
      
    })
  }
  uploadDocumentsToFirebase(documents) {
    return new Promise((resolve, reject) => {
      this.uploadPicturesToFirebase(documents, () => {
        firebase.database().ref(this.driver.request_drivers_table + '/' + firebase.auth().currentUser.uid).set({
          car_num: this.car_id,
          identity_id: this.identity_id_num
        }).then(() => {
          resolve();
        }).catch((error) => {
          console.log(error);
          reject();
        })
      }, () => {
        reject();
      })

    });
  }


  sendRequestDriver() {
    var copy = this.uri_64base_images.slice();
    this.uploadDocumentsToFirebase(copy).then(() => {
      this.showMessage('success');
    }).catch(() => {
      this.showMessage('error');
    })
  }
  ionViewDidEnter() {
    if(!this.authData.is_Admin){
      this.menu.enable(false,MyApp.menu_flight_user);
      this.menu.enable(false,MyApp.menu_admin);
      this.menu.enable(true,MyApp.menu_driver_user);
      this.menu.enable(false,MyApp.menu_driver_admin);
      this.menu.enable(false,MyApp.menu_flight_admin);
    }
    else{
      this.menu.enable(false,MyApp.menu_flight_user);
      this.menu.enable(false,MyApp.menu_admin);
      this.menu.enable(false,MyApp.menu_driver_user);
      this.menu.enable(true,MyApp.menu_driver_admin);
      this.menu.enable(false,MyApp.menu_flight_admin);
    }
      }

  showMessage(type: string) {
    switch (type) {
      case 'error':
        const alert_error = this.alertCtrl.create({
          title: 'שגיאת מערכת',
          message: 'אירעה שגיאה בעת העלאת המידע למערכת, אנא בדוק את חיבורך לרשת ונסה שנית',
          buttons: [{
            text: "אישור",
            role: 'cancel'
          }]
        })
        alert_error.present();
        break;
      default:
        const alert_success = this.alertCtrl.create({
          title: 'הודעת מערכת',
          message: 'בקשתך נשלחה ונמצאת בטיפול, הנך מועבר להזמנת נסיעות',
          buttons: [{
            text: "אישור",
            handler: () => { this.navCtrl.setRoot(FlightinfoPage) }
          }]
        })
        alert_success.present();
        break;

    }
  }
  choosePictures() {
    this.uri_64base_images = [];
    this.imagePicker.getPictures({
      width: 1200,
      height: 800,
      maximumImagesCount: 2
    }).then((results) => {
      if (results.length > 0) {
        this.num_of_images = 'נבחרו'.concat(' ').concat(results.length.toString()).concat(' ').concat('קבצים');
        this.pushImagesToArray(results, () => {
        })

      }

    })
  }




  pushImagesToArray(uri_array:string[], callback) {

    if (uri_array.length == 0) {
      callback(); 
    }

    else {
      var uri = uri_array.pop();  
      this.convertImgToBase64URL(uri, (uri64baseurl) => {
        this.uri_64base_images.push(uri64baseurl.split(',')[1]);
      })
      this.pushImagesToArray(uri_array, callback);
    }
  }

  checkNotValid() {
    if (!this.driverRegisterForm.valid || this.num_of_images == 'לא נבחר קובץ')
      return true;
    return false;
  }
  ionViewDidLoad() {

  }
  convertImgToBase64URL(url, callback) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
      var canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d'), dataURL;
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      dataURL = canvas.toDataURL();
      callback(dataURL);
      canvas = null;
    };
    img.src = url;
  }
}
