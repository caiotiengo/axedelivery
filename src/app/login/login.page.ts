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
            this.storage.set('usuario', event).then(() =>{
              this.showalert('Bem-vindo de volta!', 'Vamos macumbar!');
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
