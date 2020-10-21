import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EntregarPage } from './entregar.page';

const routes: Routes = [
  {
    path: '',
    component: EntregarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntregarPageRoutingModule {}
