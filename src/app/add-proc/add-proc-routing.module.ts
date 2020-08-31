import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddProcPage } from './add-proc.page';

const routes: Routes = [
  {
    path: '',
    component: AddProcPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddProcPageRoutingModule {}
