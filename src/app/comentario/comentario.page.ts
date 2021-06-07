import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { ServiceService } from '../service.service';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-comentario',
  templateUrl: './comentario.page.html',
  styleUrls: ['./comentario.page.scss'],
})
export class ComentarioPage implements OnInit {

  venda
  comentario =''
  starRating2: 0;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
    private route: ActivatedRoute, private storage: Storage,
    public afStore: AngularFirestore,  public services: ServiceService,
    public modalController: ModalController) { 
      
    this.storage.get('comentario').then(res =>{
      this.venda = res;
    })
  }

  ngOnInit() {
  }

  criar(){
    console.log(this.starRating2)
    console.log(this.venda.id)
    if(this.comentario != ''){
      this.afStore.collection('comments').add({
        comments: this.comentario,
        loja: this.venda.nomeLoja,
        nomeComprador: this.venda.nomeComprador,
        lojaUID: this.venda.lojaUID,
        emailLoja: this.venda.emailLoja,
        emailComprador: this.venda.emailComprador,
        nPedido: Number(this.venda.nPedido),
        rating: this.starRating2
     }).then(data =>{
       var x = data.id
       this.services.updateVComentario(this.venda.id, x)
        this.dismiss()
      })
    }else{

    }

  }

  dismiss(){
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
