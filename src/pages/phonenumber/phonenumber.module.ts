import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhonenumberPage } from './phonenumber';

@NgModule({
  declarations: [
    PhonenumberPage,
  ],
  imports: [
    IonicPageModule.forChild(PhonenumberPage),
  ],
})
export class PhonenumberPageModule {}
