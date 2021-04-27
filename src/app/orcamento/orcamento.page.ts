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


@Component({
  selector: 'app-orcamento',
  templateUrl: './orcamento.page.html',
  styleUrls: ['./orcamento.page.scss'],
})
export class OrcamentoPage implements OnInit {
  @Input() id ;
  @Input() idLoja ;
  @Input() nome ;
  
  loja
  produtos: Array<any> = [];
  produto = '';
  qtd = 1;
  observacao = '';
  constructor(public navCtrl: NavController,    private platform: Platform,    public alertCtrl: AlertController,
    private route: ActivatedRoute, public storage: Storage,
    public afStore: AngularFirestore,  public services: ServiceService,
    public modalController: ModalController,private geolocation: Geolocation,private _haversineService: HaversineService
) { }

  ngOnInit() {
    this.services.getProc(this.idLoja).subscribe(res =>{
      this.loja = res;
      console.log(this.loja)
      console.log(this.nome)
      console.log("55"+ String(this.loja.ddd) + String(this.loja.telefone))
    })
  }
  enviar(){
    this.afStore.collection('orcamento').add({
      orcamento:this.produtos,
      valor:0,
      idComprador: this.id,
      idLoja:this.idLoja,
      nomeComprador: this.nome,
      nomeLoja: this.loja.nome,
      numeroLoja: "55"+ String(this.loja.ddd) + String(this.loja.telefone)
    }).then(res =>{
      console.log(res.id)
      this.storage.set('idOrcamento', res.id).then(()=>{
        alert('Seu orçamento foi enviado, em alguns minutos terá um retorno da loja!')
        this.navCtrl.navigateForward('/lista-orcamento').then(()=>{
          this.voltar();
        })
      })
    })
  }
  voltar(){
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }
  adicionar(index:number){
    console.log(index)

    this.produtos[index].quantity += 1;
    
    console.log(this.produtos[index])
  }
  retirar(index:number){
    console.log(index)

    this.produtos[index].quantity -= 1;
    console.log(this.produtos[index])
  }
  addItem(){
    if(this.produto != ''){
      this.produtos.push({
        nome:this.produto,
        quantity:this.qtd,
        obs: this.observacao,
        foto: 'undefined',
        valor:0,
        disponivel: 'Não avaliado'
      })
    }else{
      alert('Escreva ao lado o nome do produto')
    }
  }
  deletaItem(index){
    alert('O item será retirado do seu carrinho!')
      this.produtos.splice(index, 1)
      //t//his.produtos.splice(index,1)
      console.log(this.produtos);
    
  }
}
