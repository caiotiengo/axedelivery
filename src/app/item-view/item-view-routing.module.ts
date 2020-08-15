import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemViewPage } from './item-view.page';

const routes: Routes = [
  {
    path: '',
    component: ItemViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemViewPageRoutingModule {}
