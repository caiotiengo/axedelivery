import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GanhosPage } from './ganhos.page';

const routes: Routes = [
  {
    path: '',
    component: GanhosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GanhosPageRoutingModule {}
