import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaOrcamentoPageRoutingModule } from './lista-orcamento-routing.module';

import { ListaOrcamentoPage } from './lista-orcamento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaOrcamentoPageRoutingModule
  ],
  declarations: [ListaOrcamentoPage]
})
export class ListaOrcamentoPageModule {}
