import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GanhosPageRoutingModule } from './ganhos-routing.module';

import { GanhosPage } from './ganhos.page';
import { BrMaskerModule } from 'br-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GanhosPageRoutingModule,
    BrMaskerModule
  ],
  declarations: [GanhosPage]
})
export class GanhosPageModule {}
