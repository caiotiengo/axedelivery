import { Component, OnInit, } from '@angular/core';
import {NavController} from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import {AlertController} from '@ionic/angular';
import { ServiceService } from '../service.service';
import { Observable } from 'rxjs';
import { Router,ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  usuario
  private que: string = null;
  procUser: any ;
  loja
  chat$:Observable<any>;
  novaMsg:string
  userUID
  chatou
  semChat
  constructor(public navCtrl: NavController, private storage: Storage,public loadingController: LoadingController,
              private route: ActivatedRoute, public alertCtrl: AlertController, public afAuth: AngularFireAuth,
              public services: ServiceService,  public modalController: ModalController,public afStore: AngularFirestore) { 


 

  }
  ionViewWillEnter(){
     this.loadAll();
  }

  ngOnInit() {
  
  }
  loadAll(){
    this.storage.get('idVenda').then(res =>{
      this.que = res;
      const user = firebase.auth().currentUser;
      console.log(user.uid);
      this.userUID = user.uid;
      console.log(this.que);
      console.log(this.userUID)
      this.services.getStatusProd(this.que).subscribe(data => {
        this.loja = data;
        this.services.getChat(this.loja.chat).subscribe(res =>{
          console.log(res)
          this.chatou = res
          this.semChat = this.chatou.mensagens.length;
          console.log(this.semChat)
        })
        console.log(this.loja)
      })
    })
  }



  enviar(){
    if(!this.novaMsg){

    }else{
      var message = this.novaMsg;
      var emailExp = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/img;
     // var linksExp = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm
      var phoneExp = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/img;
      console.log(message.replace(phoneExp, '************'))
      var messageE = message.replace(phoneExp,'***********').replace(emailExp,'**************')
      this.services.updateChat(this.loja.chat,messageE)
      this.novaMsg = '';
    }


  	// aqui eu farei o envio da mensagem, mas eu não consigo achar um PUSH para o firebase. só consigo atualizar um item
  }
 
}
