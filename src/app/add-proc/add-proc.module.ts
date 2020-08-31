import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddProcPageRoutingModule } from './add-proc-routing.module';

import { AddProcPage } from './add-proc.page';
import {NgxCurrencyModule} from 'ngx-currency';
import { BrMaskerModule } from 'br-mask';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AddProcPageRoutingModule,
        NgxCurrencyModule,
        BrMaskerModule,
        ReactiveFormsModule 
    ],
  declarations: [AddProcPage]
})
export class AddProcPageModule {}
