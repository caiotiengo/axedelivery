import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemVendaPageRoutingModule } from './item-venda-routing.module';

import { ItemVendaPage } from './item-venda.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemVendaPageRoutingModule
  ],
  declarations: [ItemVendaPage]
})
export class ItemVendaPageModule {}
