import { Component, OnInit, ViewChild, Input } from '@angular/core';
import {IonInfiniteScroll, NavController, Platform} from '@ionic/angular';
import { ServiceService, Processo } from '../service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import {AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import {AlertController} from '@ionic/angular';
import { HaversineService, GeoCoord } from "ng2-haversine";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ModalOrcamentoPage } from '../modal-orcamento/modal-orcamento.page';


@Component({
  selector: 'app-lista-orcamento',
  templateUrl: './lista-orcamento.page.html',
  styleUrls: ['./lista-orcamento.page.scss'],
})
export class ListaOrcamentoPage implements OnInit {

  listaOrcamento
  userId
  constructor(public navCtrl: NavController,    private platform: Platform,    public alertCtrl: AlertController,
    private route: ActivatedRoute, public storage: Storage,
    public afStore: AngularFirestore,  public services: ServiceService,
    public modalController: ModalController,private geolocation: Geolocation,private _haversineService: HaversineService
) { }

  ngOnInit() {
    this.storage.get('id').then(data =>{
      this.userId = data
      this.services.getOrcamentos().subscribe(data =>{
        this.listaOrcamento = data.filter(i => i.idComprador === this.userId);
        console.log(this.listaOrcamento)
      })
    })

  }

  chat(items){
    var mensagens = []
    if(items.chat){
      this.storage.remove('idOrcamento').then(() =>{
        this.storage.remove('idChat').then(() =>{
          this.services.getOrcamento(items.id).subscribe(data =>{
            var x = data.chat
            var y = items.id
            console.log(x);
            this.storage.set('idOrcamento', y).then(()=>{
              this.storage.set('idChat', x).then(() =>{
                this.navCtrl.navigateForward('/chat/' + x);
              });
            })   
          })
        })
      })
    }else{
      this.afStore.collection('chats').add({
        mensagens: mensagens,
        nomeLoja: items.nomeLoja,
        nomeComprador: items.nomeComprador,
        idOrcamento: items.id,
        idLoja:items.idLoja,
        idComprador:items.idComprador
      }).then(data =>{
        var x = data.id
        var y = items.id
        console.log(x);
        this.storage.remove('idOrcamento').then(() =>{
          this.storage.remove('idChat').then(() =>{
            this.storage.set('idOrcamento', y).then(()=>{
              this.storage.set('idChat', x).then(() =>{
                this.services.updateOrcamento(items.id, x);
                this.navCtrl.navigateForward('/chat/' + x);
              });
            })
          })
        })
      });
    }
  }

  async modal(id) {
    const modal = await this.modalController.create({
      component: ModalOrcamentoPage,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        'id': id,
        'idLoja': this.listaOrcamento.idLoja
    }
    });
     await modal.present();

    await modal.onDidDismiss().then((r) => {
      console.log(r)      
    })
  }

}
