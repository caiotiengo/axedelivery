import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalVendaPageRoutingModule } from './modal-venda-routing.module';

import { ModalVendaPage } from './modal-venda.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalVendaPageRoutingModule
  ],
  declarations: [ModalVendaPage]
})
export class ModalVendaPageModule {}
