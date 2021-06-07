import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalVendaPage } from './modal-venda.page';

const routes: Routes = [
  {
    path: '',
    component: ModalVendaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalVendaPageRoutingModule {}
