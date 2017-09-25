import { FlightinfoPage } from './../../pages/flightinfo/flightinfo';
import { AddressPage } from './../../pages/address/address';
import { FormControl, FormGroup } from '@angular/forms';
import { Injectable, Injector } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ValidatorProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ValidatorProvider {
  constructor(public http: Http) {

  }
  nameValid(control: FormControl) {
    const regexname = /^[a-zA-Z ,.'-]+$/.test(control.value);
    if (regexname)
      return null;
    return { "invalidName": true };
  }
  phoneValidator(control: FormControl) {
    const regexphone = /^((\+972|972)|0)( |-)?([1-468-9]( |-)?\d{7}|(5|7)[0-9]( |-)?\d{7})$/.test(control.value);
    if (regexphone)
      return null;
    return { 'invalidPhone': true };
  }
  addressValidator(control: FormControl) {
    const regexaddress = /^([^.*]+[,][^.*]+[,][^.*]+)(([,][^.*]))?$/.test(control.value);
    if (regexaddress)
      return null;
    return { 'invalidAddress': true };
  }
  flightNumberValidator(control: FormControl) {
    const regexflightnum = /^[A-Z0-9]{1,4}[0-9]{2,5}$/.test(control.value);
    if (regexflightnum)
      return null;
    else
      return { 'invalidFlightNumber': true };
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


}

