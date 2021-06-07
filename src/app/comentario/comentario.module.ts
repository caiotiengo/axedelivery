import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComentarioPageRoutingModule } from './comentario-routing.module';

import { ComentarioPage } from './comentario.page';
import { StarRatingModule } from 'ionic5-star-rating';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StarRatingModule,
    ComentarioPageRoutingModule
  ],
  declarations: [ComentarioPage]
})
export class ComentarioPageModule {}
