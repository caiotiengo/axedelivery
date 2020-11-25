import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProcurarPageRoutingModule } from './procurar-routing.module';

import { ProcurarPage } from './procurar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProcurarPageRoutingModule
  ],
  declarations: [ProcurarPage]
})
export class ProcurarPageModule {}
