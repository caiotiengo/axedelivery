import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PoliticaOrcamentoPage } from './politica-orcamento.page';

const routes: Routes = [
  {
    path: '',
    component: PoliticaOrcamentoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoliticaOrcamentoPageRoutingModule {}
