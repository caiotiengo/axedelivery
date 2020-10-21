import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {HttpClientModule} from '@angular/common/http';


import { EntregarPageRoutingModule } from './entregar-routing.module';

import { EntregarPage } from './entregar.page';
import { HTTP } from '@ionic-native/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EntregarPageRoutingModule
  ],
  declarations: [EntregarPage]
})
export class EntregarPageModule {}
