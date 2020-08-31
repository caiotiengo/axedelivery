import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemViewPageRoutingModule } from './item-view-routing.module';

import { ItemViewPage } from './item-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemViewPageRoutingModule
  ],
  declarations: [ItemViewPage]
})
export class ItemViewPageModule {}
