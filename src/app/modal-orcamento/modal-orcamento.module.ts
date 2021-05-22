import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalOrcamentoPageRoutingModule } from './modal-orcamento-routing.module';

import { ModalOrcamentoPage } from './modal-orcamento.page';
import { BrMaskerModule } from 'br-mask';
import { NgxMaskModule, IConfig } from 'ngx-mask'
export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrMaskerModule,
    ModalOrcamentoPageRoutingModule,
    NgxMaskModule.forRoot()

  ],
  declarations: [ModalOrcamentoPage]
})
export class ModalOrcamentoPageModule {}
