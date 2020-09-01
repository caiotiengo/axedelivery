import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,private push: Push
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.statusBar.overlaysWebView(false);
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
