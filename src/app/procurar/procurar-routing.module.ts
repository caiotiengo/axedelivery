import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProcurarPage } from './procurar.page';

const routes: Routes = [
  {
    path: '',
    component: ProcurarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcurarPageRoutingModule {}
