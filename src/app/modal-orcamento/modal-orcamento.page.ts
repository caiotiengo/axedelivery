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
import { BrMaskDirective, BrMaskModel } from 'br-mask';

@Component({
  selector: 'app-modal-orcamento',
  templateUrl: './modal-orcamento.page.html',
  styleUrls: ['./modal-orcamento.page.scss'],
})
export class ModalOrcamentoPage implements OnInit {
  @Input() id ;
  @Input() idLoja ;
  @Input() nome ;
  orcamento
  valor
  produtos: Array<any> = [];
  loja
  valorD
  value
  constructor(public navCtrl: NavController,public brMask: BrMaskDirective, private router: Router, private platform: Platform,    public alertCtrl: AlertController,
    private route: ActivatedRoute, public storage: Storage,
    public afStore: AngularFirestore,  public services: ServiceService,
    public modalController: ModalController,private geolocation: Geolocation,private _haversineService: HaversineService
) { }

  ngOnInit() {
    this.services.getOrcamento(this.id).subscribe(data =>{
      console.log(data);
      this.orcamento = data;
      this.services.getProc(this.orcamento.idLoja).subscribe(res =>{
        this.loja = res
      })
      var valor = this.orcamento.orcamento.map(i => i.valor * i.qtdRes).reduce((a, b) =>   a + b, 0 )

      console.log(valor)
      var x = Number(valor.toFixed(2))
      //var frete = this.orcamento.valorFrete.replace('.','')
      //console.log(frete)
      //console.log(Number(frete))
      console.log(x)
      //var valorCompleto = x + Number(frete)
      //console.log(valorCompleto)
      if(x){
        const config: BrMaskModel = new BrMaskModel()
        config.money = true;
        this.valor =  this.brMask.writeValueMoney(String(x),config)
        //this.valorTotal = mapVal
      }
      if(String(valor) === 'NaN'){
        this.valor = '0.00'
      }
      console.log(this.valor)
      console.log(this.id)
      
    })
  }
  retirarItem(items){
    console.log(items)
    this.services.deleteItem(this.id, items)
    alert('Item retirado do seu orçamento')
    var valor = this.orcamento.orcamento.map(i => i.valor * i.qtdRes).reduce((a, b) =>   a + b, 0 )
    this.valor = Number(valor.toFixed(2) )+ Number(this.orcamento.valorFrete)
    console.log(this.valor)

  }
  addCarrinho() {
    
    this.orcamento.orcamento.forEach(items => {
      this.value = String(items.valor)
      var valorAlterado = this.value.replace('.','')
      console.log(valorAlterado)
        this.produtos.push({
          nome: items.nome,
          valor: Number(items.valor),
          price: Number(valorAlterado),
          product:items.nome,
          quantity: Number(items.qtdRes),
          detail: items.obs,
          email: this.loja.email,
          itemId: 'Sem ID',
          especi: '',
          lojaUID: this.orcamento.idLoja,
          itemNumber: Number(items.qtdRes),
          emailLoja: this.loja.email,
          fotos: '',
          valorReal:Number(items.valor),
          priceReal:Number(valorAlterado)

      });
    });
    console.log(this.produtos)
    var valor = this.produtos.map(i => i.valor * i.quantity).reduce((a, b) =>   a + b, 0 )
    console.log(valor)
    if(valor){
      const config: BrMaskModel = new BrMaskModel()
      config.money = true;
      var valorVirg =  this.brMask.writeValueMoney(String(valor),config)
      //this.valorTotal = mapVal
    }
    console.log(valorVirg)
    this.valor = valorVirg.replace(',','.')
    console.log(this.valor)
    console.log(this.id)
    this.finalizarCompra()     

 
  }
  finalizarCompra() { 
    console.log(this.valor)
    if(this.valor > 1.00){
      const date = new Date();
      date.setMonth(date.getMonth() + 1);
      const dia = date.getDate() + '/' + date.getMonth()  + '/' + date.getFullYear();
      console.log(dia);
      console.log(this.orcamento.valorFrete)
      var valorTudo = Number(this.valor)
      console.log(valorTudo)
      this.storage.set('loja', this.loja);
      this.storage.set('valorProdutos', this.valor);
      this.storage.set('valorFrete', this.orcamento.valorFrete)
      this.storage.set('orcamento','orcamento')
      this.storage.set('orcamentoID', this.id)
      this.storage.set('carrinhoUser', JSON.stringify(this.produtos)).then(res =>{
        this.voltar()
          this.navCtrl.navigateForward('/carrinho');
          console.log(res)
      });

    }else{
      alert('Erro, valor não ultrapassa o minimo de R$1.00')
    }
    
}
desistirOrc(){
  this.services.deleteOrc(this.id)
  alert('Orçamento excluido! :(')
  this.voltar()
}
  voltar(){
     // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
