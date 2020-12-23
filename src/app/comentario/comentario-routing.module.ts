import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComentarioPage } from './comentario.page';

const routes: Routes = [
  {
    path: '',
    component: ComentarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComentarioPageRoutingModule {}
