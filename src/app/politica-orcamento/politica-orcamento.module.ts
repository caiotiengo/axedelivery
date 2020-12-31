import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PoliticaOrcamentoPageRoutingModule } from './politica-orcamento-routing.module';

import { PoliticaOrcamentoPage } from './politica-orcamento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PoliticaOrcamentoPageRoutingModule
  ],
  declarations: [PoliticaOrcamentoPage]
})
export class PoliticaOrcamentoPageModule {}
