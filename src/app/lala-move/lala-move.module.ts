import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LalaMovePageRoutingModule } from './lala-move-routing.module';

import { LalaMovePage } from './lala-move.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LalaMovePageRoutingModule
  ],
  declarations: [LalaMovePage]
})
export class LalaMovePageModule {}
