import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemVendaPage } from './item-venda.page';

const routes: Routes = [
  {
    path: '',
    component: ItemVendaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemVendaPageRoutingModule {}
