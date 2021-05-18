import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalCartaoPage } from './modal-cartao.page';

const routes: Routes = [
  {
    path: '',
    component: ModalCartaoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalCartaoPageRoutingModule {}
