import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddProcPageRoutingModule } from './add-proc-routing.module';

import { AddProcPage } from './add-proc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddProcPageRoutingModule
  ],
  declarations: [AddProcPage]
})
export class AddProcPageModule {}
