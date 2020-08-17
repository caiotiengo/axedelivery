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
    const chatId = this.route.snapshot.paramMap.get('id');
    //const sourceId = this.chatServices.getChatId(chatId)
    //console.log(sourceId)

    this.storage.get('usuario').then(data =>{
      this.usuario = data;
      console.log(this.usuario)
    })
    this.que = this.route.snapshot.paramMap.get('id');
    const user = firebase.auth().currentUser;
    console.log(user.uid);
    this.userUID = user.uid;
    console.log(this.que);
    console.log(this.userUID)
  	this.services.getStatusProd(this.que).subscribe(data => {
  		this.loja = data;
  		console.log(this.loja)
  	})
  }



  enviar(){
    if(!this.novaMsg){

    }
    this.services.updateChat(this.que,this.novaMsg)
    this.novaMsg = '';
  	// aqui eu farei o envio da mensagem, mas eu não consigo achar um PUSH para o firebase. só consigo atualizar um item
  }
 
}
