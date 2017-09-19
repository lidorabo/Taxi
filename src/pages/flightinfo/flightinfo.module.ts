import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FlightinfoPage } from './flightinfo';

@NgModule({
  declarations: [
    FlightinfoPage,
  ],
  imports: [
    IonicPageModule.forChild(FlightinfoPage),
  ],
})
export class FlightinfoPageModule {}
