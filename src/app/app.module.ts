import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import firebaseConfig from './firebase';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import { ServiceService } from './service.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { IonicStorageModule } from '@ionic/storage';
import * as firebase from 'firebase';
import { ListPage } from './list/list.page';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import { NativeGeocoder,  NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import {HttpClientModule} from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { HaversineService } from "ng2-haversine";
import { BrMaskerModule, BrMaskDirective } from 'br-mask';
import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';
import {LOCALE_ID} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import {AngularFireStorageModule} from '@angular/fire/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Media } from '@ionic-native/media/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { File } from '@ionic-native/File/ngx';
import ptBr from '@angular/common/locales/pt';

import { Push } from '@ionic-native/push/ngx';
import { HTTP } from '@ionic-native/http/ngx';

registerLocaleData(ptBr)


firebase.initializeApp(firebaseConfig);
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
  AngularFireModule.initializeApp(firebaseConfig),
  AngularFireStorageModule,
  AngularFireAuthModule,
  HttpClientModule,
  HttpModule,
  BrowserModule,
  HttpClientModule,
  BrMaskerModule,
  IonicModule.forRoot(),
  IonicStorageModule.forRoot({
  name: '_myDb',
  driverOrder: ['sqlite', 'indexeddb', 'websql', 'localstorage']

  }),
  AppRoutingModule,
      FormsModule,ReactiveFormsModule

  ],
  providers: [
    StatusBar,
    HaversineService,
    Camera,
    NativeGeocoder,
    Geolocation,
    SplashScreen,
    ServiceService,
    AngularFirestore,
    HttpClientModule,
    Push,
    MediaCapture,
    File,
    HTTP,
    Media,
    BrMaskDirective,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
     {
      provide: LOCALE_ID,
      useValue: 'pt-BR'
    }
  ],
  bootstrap: [AppComponent],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

})
export class AppModule {}
