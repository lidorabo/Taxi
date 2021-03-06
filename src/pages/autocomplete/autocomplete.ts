import { ViewController } from 'ionic-angular';
import {Component, NgZone} from '@angular/core';


declare var google:any;

@Component({
  selector:'page-autocomplete',
  templateUrl: './autocomplete.html'
})

export class AutocompletePage {
  autocompleteItems;
  autocomplete;
  service = new google.maps.places.AutocompleteService();

  constructor (public viewCtrl: ViewController, private zone: NgZone) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  chooseItem(item: any) {
    this.viewCtrl.dismiss(item);
  }
  
  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let me = this;
    let config = { 
      types:  ['establishment','geocode'], 
      input: this.autocomplete.query, 
      componentRestrictions: { country: 'IL' } 
  }
    this.service.getPlacePredictions( config, function (predictions, status) {
      me.autocompleteItems = []; 
      me.zone.run(function () {
        if(predictions){
        predictions.forEach(function (prediction) {
          me.autocompleteItems.push(prediction.description);
        })};
      });
    });
  }
}