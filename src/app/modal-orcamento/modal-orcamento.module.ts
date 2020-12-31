import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalOrcamentoPageRoutingModule } from './modal-orcamento-routing.module';

import { ModalOrcamentoPage } from './modal-orcamento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalOrcamentoPageRoutingModule
  ],
  declarations: [ModalOrcamentoPage]
})
export class ModalOrcamentoPageModule {}
