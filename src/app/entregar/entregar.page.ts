import { Component, OnInit, Input } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { HTTP } from '@ionic-native/http/ngx';
import Lalamove from 'lalamove-js'
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { ServiceService, Vendas } from '../service.service';
import { FormBuilder } from '@angular/forms';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-entregar',
  templateUrl: './entregar.page.html',
  styleUrls: ['./entregar.page.scss'],
})
export class EntregarPage implements OnInit {
  @Input() venda ;
  @Input() tipo ;
  statusEnt = '';

  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
    private route: ActivatedRoute, private storage: Storage,
    public afStore: AngularFirestore,  public services: ServiceService,
    public modalController: ModalController,private formBuilder: FormBuilder) { 



  }

  ngOnInit() {
    console.log(this.tipo)
    console.log(this.venda)
  }
  save() {
   this.services.vendasCollection.doc<Vendas>(this.venda.id).update({statusEnt: this.statusEnt }).then(() =>{
     this.navCtrl.navigateRoot('/status')
   });
  }
  novoChat(items){
    var mensagens = []
    if(items.chat){
      this.storage.remove('idVenda').then(() =>{
        this.storage.remove('idChat').then(() =>{
          this.services.getStatusProd(items.id).subscribe(data =>{
            var x = data.chat
            var y = items.id
            console.log(x);
            this.storage.set('idVenda', y).then(()=>{
              this.storage.set('idChat', x).then(() =>{
                this.dismiss2()

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
        idVenda: items.id,
        idLoja:items.lojaUID,
        idComprador:items.compradorUID
      }).then(data =>{
        var x = data.id
        var y = items.id
        console.log(x);
        this.storage.remove('idVenda').then(() =>{
          this.storage.remove('idChat').then(() =>{
            this.storage.set('idVenda', y).then(()=>{
              this.storage.set('idChat', x).then(() =>{
                this.dismiss2()
                this.services.updateVendas(items.id, x);
                this.navCtrl.navigateForward('/chat/' + x);
              });
            })
          })
        })
      });
    }
    
  }
  dismiss2(){
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

 
}
