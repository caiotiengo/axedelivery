import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterProdPageRoutingModule } from './register-prod-routing.module';

import { RegisterProdPage } from './register-prod.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterProdPageRoutingModule
  ],
  declarations: [RegisterProdPage]
})
export class RegisterProdPageModule {}
