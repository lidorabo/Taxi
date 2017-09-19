import { Component, OnInit } from '@angular/core';
import { IonicPage,NavController, AlertController, Platform, ModalController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from "../login/login";
import { AutocompletePage } from "../autocomplete/autocomplete";
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators, NgControl } from '@angular/forms';
declare var google:any;

@IonicPage()
@Component({
  selector: 'page-customer',
  templateUrl: 'customer.html',
})

export class CustomerPage implements OnInit {
  ngOnInit(): void {
    
  }
  address;
  flightInfo: string;
  authData:AuthProvider;
  numberofpassengers:number;
  confirmm:string= '?האם אתה בטוח כי אתה רוצה להתנתק';
  arrivalwantedtime:number;
  orderForm:FormGroup;
  valid:false;
  constructor(public navCtrl: NavController, authdata:AuthProvider,
  platform: Platform,public alertCtrl: AlertController,private formBuilder: FormBuilder, private modalCtrl: ModalController, private http: HttpClient) {
    this.authData = authdata;
    this.address = {
      place: '',
      latitude: '',
      longitude: ''
    };
    this.orderForm = formBuilder.group({
     // address: [[this.authData.emptystring],validators.addressValidator],
     // flightnumber : [this.authData.emptystring, [Validators.required, validators.flightNumberValidator]],
      numop:[this.authData.emptystring],
      arrivalt:[this.authData.emptystring]
      })
      this.orderForm.controls.address.valueChanges.subscribe((val)=>{
        if(this.orderForm.controls.address.invalid)
          this.orderForm.controls['address'].setErrors({'invalidAddress':true});
         
      });
  }
  showAddressModal () {
    
    let modal = this.modalCtrl.create(AutocompletePage);
    let me = this;
    modal.onDidDismiss(data => {
      this.address.place = data;
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': this.address.place}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          this.address = {
            place: data,
            latitude: results[0].geometry.location.lat(),
            longitude: results[0].geometry.location.lng()
          };
        console.log("Latitude: "+ this.address.latitude);
        console.log("Longitude: "+ this.address.longitude);
        } 
  
        else {
          console.log("Geocode was not successful for the following reason: " + status);
        }
      });
    });
    modal.present();
    this.orderForm.controls.address.enable;
    }
  
  exit(){
      let alert = this.alertCtrl.create({
        title: 'Confirm',
        message:this.confirmm,
        buttons: [{
          text: "Agree",
          handler: () => {this.logout();}
        }, {
          text: "Disagree",
          role: 'cancel'
        }]
      })
      alert.present();
      this.orderForm.controls.address.enable;
  }
  
  logout(){
      this.authData.logoutUser();
      this.navCtrl.setRoot(LoginPage);
  }


  /*sendOrder(){
     // Make the HTTP request:
     this.http.get('https://taxiserver.herokuapp.com/api/load/' + this.flightNum).subscribe(data => {
      // Read the result field from the JSON response.
      this.flightInfo = "טיסה מספר: " + this.flightNum + " ממריאה בתאריך: " + data["date"] + " בשעה: " + data["time"];
      console.log(data);
      console.log(this.flightInfo,this.numberofpassengers);
    });
  }
  */

}
