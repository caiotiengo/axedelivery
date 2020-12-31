import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalOrcamentoPage } from './modal-orcamento.page';

const routes: Routes = [
  {
    path: '',
    component: ModalOrcamentoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalOrcamentoPageRoutingModule {}
