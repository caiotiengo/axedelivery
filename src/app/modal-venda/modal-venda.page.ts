import { Component, OnInit, Input } from '@angular/core';
import {AlertController, ModalController, NavController, LoadingController} from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { ServiceService } from '../service.service';

import { Storage } from '@ionic/storage';

export interface Especi {
  especi: any
  qtd:number
  nome: string
  valor: number
  price: number
  product: string
  quantity: number
  detail: string
  email: string
  itemId: any
  lojaUID: any
  itemNumber: number
  fotos: any
  tipoPrd:string
  emailLoja:string
  lat:number
  lng:number

}
@Component({
  selector: 'app-modal-venda',
  templateUrl: './modal-venda.page.html',
  styleUrls: ['./modal-venda.page.scss'],
})

export class ModalVendaPage implements OnInit {
  @Input() id ;
  @Input() idLoja ;
  @Input()  emailUser;

  produto
  qtd = 0;
  especi: Array<Especi> = [];
  nome = '';
  produtoEspeci: Array<Especi> = [];
  produtoNada: Array<Especi> = []

  checked = false;
  price = 0;
  lojaUID
  lojaLat
  lojaLng
  constructor(public navCtrl: NavController, public storage: Storage,public loadingController: LoadingController,
    public afAuth: AngularFireAuth, public router: Router, public actRouter: ActivatedRoute,
    public services: ServiceService, public afStore: AngularFirestore, public alertCtrl: AlertController,
    private modalController: ModalController) { }

  ngOnInit() {
    console.log(this.id)
    console.log(this.idLoja)
    console.log(this.emailUser)
    this.services.getProc(this.idLoja).subscribe(res =>{
      this.lojaLat = res.lat
      this.lojaLng = res.lng
    })
    this.services.getProdutos(this.id).subscribe(data =>{
      console.log(data)
      this.produto = data
      if(this.produto.especi.length > 0){
        
      this.produto.especi.forEach(element => {
        this.produtoEspeci.push({
          nome: this.produto.nome,
          valor: this.produto.valor,
          price: this.produto.price,
          product:this.produto.nome,
          quantity: 0,
          detail: this.produto.resumo.slice(0,200),
          email: this.emailUser,
          emailLoja:this.produto.email,
          itemId: this.id,
          especi: element.value,
          tipoPrd:this.produto.tipoPrd,
          lojaUID: this.idLoja,
          itemNumber: this.qtd,
          fotos: '',
          qtd: 0,
          lat: this.lojaLat,
          lng: this.lojaLng
        })
      });
      console.log(this.produtoEspeci)
      }else{
        this.produtoNada.push({
          nome: this.produto.nome,
          valor: this.produto.valor,
          price: this.produto.price,
          product:this.produto.nome,
          quantity: 0,
          detail: this.produto.resumo.slice(0,200),
          email: this.emailUser,
          emailLoja:this.produto.email,
          itemId: this.id,
          especi: data,
          tipoPrd:this.produto.tipoPrd,
          lojaUID: this.idLoja,
          itemNumber: this.qtd,
          fotos: '',
          qtd: 0,
          lat: this.lojaLat,
          lng: this.lojaLng
        })
      }
      console.log(this.produtoNada)

    })
  }
  selectCP(event, item) {

    if (event.checked) {

      this.produtoEspeci.forEach(shpItm => {
        this.checked    
        if (shpItm.especi === item.value) {
          this.checked = true;
        } else {
          this.checked = false;
        }
      });
    }
    if (!event.checked) {
        this.produtoEspeci.forEach(shpItm => {

        if (shpItm.especi === item.value) {
          this.checked = false;
        }
      });
    }
        
  }
  adicionarQTD(index:number){
    console.log(index)

    this.produtoEspeci[index].qtd += 1;
    
    console.log(this.produtoEspeci[index])
  }
  retirarQTD(index:number){
    console.log(index)

    this.produtoEspeci[index].qtd -= 1;
    console.log(this.produtoEspeci[index])
  }
  adicionar(){
    
    this.qtd += 1;
    
    console.log(this.qtd)
  }
  retirar(){

    this.qtd -= 1;
    console.log(this.qtd)
  }


  add(){

    if(this.produto.especi.length > 0 && this.price === 0){
      
      this.produtoEspeci.forEach(element =>{
        if(element.qtd > 0){
          //var x = element.valor * element.qtd
          this.qtd = element.qtd
          //this.price = x
          this.especi.push({
            nome: this.produto.nome,
            valor: this.produto.valor,
            price: this.produto.price,
            product:this.produto.nome,
            quantity: element.qtd,
            detail: this.produto.resumo.slice(0,200),
            email: this.emailUser,
            emailLoja:this.produto.email,
            itemId: this.id,
            especi: element.especi,
            lojaUID: this.idLoja,
            itemNumber: this.qtd,
            fotos: this.produto.fotos,
            qtd: element.qtd,
            tipoPrd:this.produto.tipoPrd,
            lat: this.lojaLat,
            lng: this.lojaLng
          })

        }else{
          console.log('Nao foi escolhido')
        }
      })
      var quant = this.produtoEspeci.map(i => i.qtd)
      var sum = quant.reduce((acc, val) => acc += val)
      this.qtd = sum
      var x = this.produto.valor * this.qtd
      var zota = x.toFixed(2)
      this.price = Number(zota)
      console.log(this.price)
      console.log(this.especi)
    }else if(this.produto.especi.length === 0 && this.price === 0){
      var x = this.produto.valor * this.qtd
      var zota = x.toFixed(2)
      this.price = Number(zota)
      this.especi.push({
        nome: this.produto.nome,
        valor: this.produto.valor,
        price: this.produto.price,
        product:this.produto.nome,
        quantity: this.qtd,
        detail: this.produto.resumo.slice(0,200),
        email: this.emailUser,
        emailLoja:this.produto.email,
        itemId: this.id,
        especi: '',
        lojaUID: this.idLoja,
        itemNumber: this.qtd,
        fotos: this.produto.fotos,
        qtd: this.qtd,
        tipoPrd:this.produto.tipoPrd,
        lat: this.lojaLat,
        lng: this.lojaLng
      })
      console.log(this.especi) 
     
    }else if(this.produto.especi.length > 0 && this.price !== 0){
      this.especi = []
      this.produtoEspeci.forEach(element =>{
        if(element.qtd > 0){
          //var x = element.valor * element.qtd
          this.qtd = element.qtd
          //this.price = x
          this.especi.push({
            nome: this.produto.nome,
            valor: this.produto.valor,
            price: this.produto.price,
            product:this.produto.nome,
            quantity: element.qtd,
            detail: this.produto.resumo.slice(0,200),
            email: this.emailUser,
            emailLoja:this.produto.email,
            itemId: this.id,
            especi: element.especi,
            lojaUID: this.idLoja,
            itemNumber: this.qtd,
            fotos: this.produto.fotos,
            qtd: element.qtd,
            tipoPrd:this.produto.tipoPrd,
            lat: this.lojaLat,
            lng: this.lojaLng
          })

        }else{
          console.log('Nao foi escolhido')
        }
      })
      var quant = this.produtoEspeci.map(i => i.qtd)
      var sum = quant.reduce((acc, val) => acc += val)
      this.qtd = sum
      var x = this.produto.valor * this.qtd
      var zota = x.toFixed(2)
      this.price = Number(zota)
      console.log(this.price)
      console.log(this.especi)
    }else if(this.produto.especi.length === 0 && this.price > 0){
      this.especi = []

      var x = this.produto.valor * this.qtd
      var zota = x.toFixed(2)
      this.price = Number(zota)
      this.especi.push({
        nome: this.produto.nome,
        valor: this.produto.valor,
        price: this.produto.price,
        product:this.produto.nome,
        quantity: this.qtd,
        detail: this.produto.resumo.slice(0,200),
        email: this.emailUser,
        emailLoja:this.produto.email,
        itemId: this.id,
        especi: '',
        lojaUID: this.idLoja,
        itemNumber: this.qtd,
        fotos: this.produto.fotos,
        qtd: this.qtd,
        tipoPrd:this.produto.tipoPrd,
        lat: this.lojaLat,
        lng: this.lojaLng
      })
      console.log(this.especi) 
     
    }

    


  }
  dismiss2(){
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true,
      data: this.especi
    });
  }
  
}
