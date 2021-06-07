import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaProdutosPage } from './lista-produtos.page';

const routes: Routes = [
  {
    path: '',
    component: ListaProdutosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaProdutosPageRoutingModule {}
