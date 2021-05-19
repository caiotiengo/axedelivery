import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ErvasPageRoutingModule } from './ervas-routing.module';

import { ErvasPage } from './ervas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ErvasPageRoutingModule
  ],
  declarations: [ErvasPage]
})
export class ErvasPageModule {}
