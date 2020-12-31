import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaOrcamentoPage } from './lista-orcamento.page';

const routes: Routes = [
  {
    path: '',
    component: ListaOrcamentoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaOrcamentoPageRoutingModule {}
