import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LalaMovePage } from './lala-move.page';

const routes: Routes = [
  {
    path: '',
    component: LalaMovePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LalaMovePageRoutingModule {}
