import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalCartaoPageRoutingModule } from './modal-cartao-routing.module';

import { ModalCartaoPage } from './modal-cartao.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalCartaoPageRoutingModule
  ],
  declarations: [ModalCartaoPage]
})
export class ModalCartaoPageModule {}
