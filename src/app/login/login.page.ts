import { Component, OnInit, } from '@angular/core';
import {NavController} from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import {AlertController} from '@ionic/angular';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ModalController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import {Storage} from '@ionic/storage';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email = '';
  password = '';
  paypalConfig
  valor = '';
  mainuser: AngularFirestoreDocument;
  userID
  sub;
  usuarior
  FCM
  constructor(public navCtrl: NavController, private storage: Storage,public loadingController: LoadingController,
              public router: Router, public alertCtrl: AlertController, public afAuth: AngularFireAuth,
              public services: ServiceService,private push:Push, public modalController: ModalController,public afStore: AngularFirestore) {
        const user = firebase.auth().currentUser;
    console.log(user);
    if (user) {
            this.mainuser = this.afStore.doc(`users/${user.uid}`);
            this.userID = user.uid
              this.showalert('Bem-vindo de volta!', 'Vamos macumbar!');
              this.mainuser.valueChanges().subscribe(event => {
                  console.log(event)
                  this.storage.set('usuario', event)

                })
              //this.navCtrl.navigateRoot('/tabs/tab1');
              //console.log(this.userID)
              //this.navCtrl.navigateRoot('/tabs/tab1')
      } else {
          console.log('No user')
      }

  } 


  ngOnInit(){
        this.iniciarPush();
            
  }
   
  private iniciarPush(){
    const options: PushOptions = {
     android: {
       senderID:'612729787094'
     },
     ios: {
      alert: 'true',
      badge: true,
      sound: 'true'
    }
  }

  const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));

    pushObject.on('registration').subscribe((registration: any) => {

    console.log('Device registered', registration.registrationId)
    this.FCM = registration.registrationId
        console.log('Device registered', registration)
  /*  this.afStore.collection('devices').add({
         idDevice: registration[0].registrationId,

      });
  */
  } );
  pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));



  }


async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Aguarde...',
      duration: 3000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }
 
  registrar() {

  	this.navCtrl.navigateForward('/register');
  	console.log('Fine');
   // saudade do meu amor
  }
  entrega(){
    this.navCtrl.navigateForward('/entregar')
  }
 async entrar() {
    const{email, password } = this;
      this.presentLoading() 

    try {
      const res = await this.afAuth.signInWithEmailAndPassword(email, password);
      if (res.user) {
         const user = firebase.auth().currentUser;
         this.mainuser = this.afStore.doc(`users/${user.uid}`);
         this.userID = user.uid

         this.mainuser.valueChanges().subscribe(event => {
            console.log(event)
            if(this.FCM === undefined){
              this.FCM === event.fcm
            }else{
              this.services.updateFCM(this.userID, this.FCM)

            }
            this.storage.set('usuario', event).then(() =>{
              this.showalert('Bem-vindo de volta!', 'Vamos as compras!?');
              this.navCtrl.navigateRoot('/list');
               
            })
                  
         })
             

      }

    } catch (err) {
      console.dir(err);
      if (err.code === 'auth/user-not-found') {
        console.log('password not match');
        const alert = await this.alertCtrl.create({
          header:'Opa!',
          message:'Parece que você ainda não é cadastrado, mas não tem problema! Clique em "Ok" para se cadastrar',
          buttons: [
             {
                text: 'Cancelar',
                role: 'cancelar',
                handler: () => {
                  console.log('sim clicked');

              }
          },
              {
                text: 'Ok',
                role: 'ok',
                handler: () => {
                this.navCtrl.navigateRoot('/register');
          }
          }]
        });
        await alert.present();


      }if (err.code === 'auth/wrong-password'){
          this.showalert('Hmmm...', 'Parece que você digitou a senha errada, tente novamente.');

      }
    }
  }

  async showalert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['Ok']
    });

    await alert.present();
  }


}
