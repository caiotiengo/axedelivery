import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RootPage } from './root.page';

const routes: Routes = [
  {
    path: '',
    component: RootPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RootPageRoutingModule {}
