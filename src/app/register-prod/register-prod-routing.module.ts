import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterProdPage } from './register-prod.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterProdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterProdPageRoutingModule {}
