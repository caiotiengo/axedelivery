import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PoliticaPageRoutingModule } from './politica-routing.module';

import { PoliticaPage } from './politica.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PoliticaPageRoutingModule
  ],
  declarations: [PoliticaPage]
})
export class PoliticaPageModule {}
