import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { ServiceService } from './service.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,private storage: Storage, 
    private statusBar: StatusBar,private push: Push, private services: ServiceService
    
  ) {
    this.initializeApp();
    
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.services.getLojasOnline().subscribe(data =>{
        this.storage.set('lojas', data).then(() =>{
          console.log('lojas carregadas')
        })
      })
      this.services.getProccessos().subscribe(data =>{
        this.storage.set('produtos', data).then(() =>{
          console.log('produtos carregados')
        })
      })
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.statusBar.overlaysWebView(true);
      this.statusBar.backgroundColorByHexString('#33000000');
      this.iniciarPush();
    });
  }

  

  private iniciarPush(){
    const options: PushOptions = {
     android: {
       senderID:'612729787094'
     }
  }

  const pushObject: PushObject = this.push.init(options);

  pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));

  pushObject.on('registration').subscribe((registration: any) => {
   console.log('Device registered', registration.registrationId)
        console.log('Device registered', registration)
  /*  this.afStore.collection('devices').add({
         idDevice: registration[0].registrationId,

      });
  */
  } );
  pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));



  }
}
