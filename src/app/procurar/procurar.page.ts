import { Component, OnInit, ViewChild } from '@angular/core';
import {IonInfiniteScroll, NavController, Platform, LoadingController} from '@ionic/angular';
import { ServiceService } from '../service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import {AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { IonSlides} from '@ionic/angular';
import {AlertController} from '@ionic/angular';
import { HaversineService, GeoCoord } from "ng2-haversine";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ModalVendaPage } from '../modal-venda/modal-venda.page';


export interface Loja {
    nome?: string;
    zona?: string;
    bairro?: string;
    endereco?: string;
    LikeValue?: number;
    DislikeValue?: number;
    cidade?: string;
    email?: string;
    resumo?: string;
    comments?:string;
    entrega?:string;
    aprovado?:string;
    seNao?:string;
    nomeLoja?:string;
}
export interface Produtos {
    nome?: string;
    valor?: number;
    qtd?: number;
    email?: string;
    itemId?: any;
    itemNumber?: any;
    dia?: number;
    lojaUID?: string;
    emailLoja?: string;
    price?:number;
    product?:string;
    quantity: number;
    detail?: string;
    fotos?: string
    tipoPrd?:any;
    descrito?:any;
    especi?:any;
    noApp?:any;
    id?:any;
    nomeLoja?:string;
    fotoPerfil?:any;
    valorReal?:any;
    priceReal?:any;
    lng?:any;
    lat?:any;

}
@Component({
  selector: 'app-procurar',
  templateUrl: './procurar.page.html',
  styleUrls: ['./procurar.page.scss'],
})
export class ProcurarPage implements OnInit {
  @ViewChild('mySlider', {static: true})  slides: IonSlides;
  @ViewChild(IonInfiniteScroll, {static: true}) infiniteScroll: IonInfiniteScroll;

	item: any = [];
	mainuser: AngularFirestoreDocument;
    name: string ;
    role: string ;
    boss: string ;
    company: string ;
    email: string;
    sub;
    proc;
    procUser: any ;
    LikeValue: number;
    DislikeValue: number;
    likes: number;
    dislikes: number;
    public loja :  any = {};
    public que: string = null;
    public loading: any;
    public lojaSubscription: Subscription;
    public productSubscription: Subscription;
    public goalList: any[];
    public commentsSubscription: Subscription;
    public loadedGoalList: any[];
    public listaUsers: any[];
    public listaUsers2: any[];

    emailLoja;
    qualquer;
    lista: Array<Produtos> = [];
    lista2: Array<Produtos> = [];
    produtos: Array<Produtos> = [];

    slideOpts = {
       initialSlide: 1,
       speed: 400
       };
    qtd = 0;
    testy
    categoria;
    segmento;
    valores;
    valorCompra;
    nome;
    endereco;
    cidade;
    bairro;
    telefone;
    zona;
    visu
    comments
    commentsLen
    lojaID
    valorFrete
    valorDelivery
    lat 
    lng
    lojaLng
    type = '';
    lojaLat
    quantidade: any = []
    categorias
    segumentacao = ''
    plataforma
    valorinicial
       emails
       semLoja
       estado
       datou
       user
       nomeLoja
       moremo =0
  constructor(public navCtrl: NavController,private platform: Platform, public alertCtrl: AlertController,
    private route: ActivatedRoute, public storage: Storage,public loadingController: LoadingController,
    public afStore: AngularFirestore,  public services: ServiceService,
    public modalController: ModalController,private geolocation: Geolocation,private _haversineService: HaversineService) { 
       this.user = firebase.auth().currentUser;
      console.log(this.user);
      this.mainuser = this.afStore.doc(`users/${this.user.uid}`);
      this.sub = this.mainuser.valueChanges().subscribe(event => {
        this.nome = event.nome;
        this.endereco = event.endereco;
        this.cidade = event.cidade;
        this.email = event.email;
        this.bairro = event.bairro;
        this.telefone = event.telefone;
        this.zona = event.zona;
        this.lat = event.lat;
        this.lng = event.lng
        this.estado = event.estado;

    });
    this.services.getProccessos().subscribe(res => {
      this.goalList = res.filter(i => i.estado === this.estado && i.aprovado === 'Sim')
      this.loadedGoalList = res.filter(i => i.estado === this.estado && i.aprovado === 'Sim')

      //this.lista = this.lista.concat(this.goalList)
      this.categorias = Array.from(new Set(this.goalList.map((item: any) => item.tipoPrd)))

      this.semLoja = this.goalList.length
      this.semLoja = this.goalList.length
      //console.log(this.goalList)
      this.goalList.slice(0,10).forEach(i =>{
       //console.log(i.id)
       this.loadProduct(i.lojaUID)
       this.lista.push(i)
      })
    });    
  }

  ngOnInit() {

  }
  more(){
    this.moremo++
    console.log(this.moremo)

    if(this.moremo === 1){
      this.lista =[]

      this.goalList.slice(0,50).forEach(i =>{
        //console.log(i.id)
        this.loadProduct(i.lojaUID)
        this.lista.push(i)

       })

    }else if(this.moremo === 2){
      this.lista =[]

      this.goalList.slice(0,100).forEach(i =>{
       // console.log(i.id)
        this.loadProduct(i.lojaUID)
        this.lista.push(i)

       })

    }else if(this.moremo === 3){
      this.lista =[]

      this.goalList.forEach(i =>{
        //console.log(i.id)
        this.loadProduct(i.lojaUID)
        this.lista.push(i)

       })
    }else{
      alert('Ops, a lista inteira de produtos já foi carregada!')
    }
  }
  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();
      this.more()
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.goalList.length == 1000) {
        event.target.disabled = true;
      }
    }, 500);
  }
  async presentModal(id, idLoja, email) {
    if(this.produtos.length > 0 ){
      console.log(id)
      console.log(idLoja)
      console.log(this.produtos[0].email)
      if(email === this.produtos[0].email){
        const modal = await this.modalController.create({
          component: ModalVendaPage,
          cssClass: 'my-custom-modal-css',
          componentProps: {
            'id': id,
            'idLoja': idLoja
          }
        });
         await modal.present();
    
        await modal.onDidDismiss().then((r) => {
          this.testy = r.data.data;
          this.testy.forEach(element => {
            this.addCarrinho(element)
          });
          console.log("the result:", r , 'test'+ this.testy);
          
        })
      }else{
        this.presentAlertConfirm()
      }
    }else{
      const modal = await this.modalController.create({
        component: ModalVendaPage,
        cssClass: 'my-custom-modal-css',
        componentProps: {
          'id': id,
          'idLoja': idLoja

        }
      });
       await modal.present();
  
      await modal.onDidDismiss().then((r) => {
        this.testy = r.data.data;
        this.testy.forEach(element => {
          this.addCarrinho(element)
        });
        console.log("the result:", r , 'test'+ this.testy);
        
      })
    }

  }
  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Opa!',
      message: 'Você não pode comprar em lojas diferentes, deseja limpar o seu carrinho?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Sim',
          handler: () => {
            console.log('Confirm Okay');
            this.produtos = [];
          }
        }
      ]
    });

    await alert.present();
  }

  loadProduct(id) {
    this.lojaSubscription = this.services.getProc(id).subscribe(data => {
      this.loja = data;
      //console.log(this.loja);

      this.emailLoja = data.email;
     // this.lojaLat = data.lat;
    //  this.lojaLng = data.lng;
     // console.log(this.loja);
      //console.log(this.likes);
     // console.log(this.dislikes);
     /* let Usuario: GeoCoord = {
                   latitude: Number(this.lat),
                   longitude: Number(this.lng)
              };
              console.log(Usuario)
              let Loja: GeoCoord = {
                  latitude: Number(this.lojaLat),
                  longitude:Number(this.lojaLng)
              };
              
              
             let kilometers = this._haversineService.getDistanceInKilometers(Usuario, Loja).toFixed(1);
            // console.log("A distancia entre as lojas é de:" + Number(kilometers));
             
             this.valorFrete = Math.floor(1.20)*Number(kilometers) + 5;
             if(this.valorFrete > 30.00){
              // console.log('maior')
               var y = 35.00
               this.valorDelivery = y.toFixed(2)

             }else{
              // console.log('menor')
               this.valorDelivery = this.valorFrete.toFixed(2)

             }*/

    });

  }
  segmentChanged(items){
    this.initializeItems();

    console.log(items.detail.value)
    //console.log(items.value)
    //console.log(items)


    //this.segumentacao = items.detail.value
    const searchTerm = items.detail.value;

    if (!searchTerm) {
        return;
    }
    this.lista = this.lista.filter(currentGoal => {
        if (currentGoal.tipoPrd && searchTerm) {
            if (currentGoal.tipoPrd.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {

                return true;
            } else {
                return false;
            }
        }
    });
  //  this.goalList.filter(i => i.email === this.emailLoja && i.noApp ==='Sim' && i.tipoPrd === items.detail.value);
   // this.loadedGoalList.filter(i => i.email === this.emailLoja && i.noApp ==='Sim' && i.tipoPrd === items.detail.value);
  }

  initializeItems(): void {
    this.lista = this.loadedGoalList;

  }
  filterList(evt) {
    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
       return;
     }
    this.lista = this.lista.filter(currentGoal => {
       if (currentGoal.nome && searchTerm) {
           if (currentGoal.nome.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {

             return true;
           } else {

             return false;
           }
       }
     });
  }

  addCarrinho(items) {
    console.log(items.valor * items.qtd );
    console.log(this.qtd);
    console.log(this.lojaLng)
    console.log(items.detail)
    if(items.fotos[0] === undefined){
      this.produtos.push({
        nome: items.nome,
        valor: items.valor * Number(items.qtd),
        price: items.price,
        product:items.nome,
        quantity: Number(items.qtd),
        detail: items.resumo,
        email: items.email,
        itemId: items.id,
        especi: items.especi,
        lojaUID: items.lojaUID,
        itemNumber: this.qtd,
        emailLoja: items.email,
        fotos: '',
        valorReal:items.valor,
        priceReal: items.price,
        lat:items.lat,
        lng:items.lng
    });
    }else{
      this.produtos.push({
        nome: items.nome,
        valor: items.valor * Number(items.qtd),
        price: items.price,
        product:items.nome,
        quantity: Number(items.qtd),
        detail: items.resumo,
        email: items.email,
        itemId: items.id,
        especi: items.especi,
        lojaUID: items.lojaUID,
        itemNumber: this.qtd,
        emailLoja: items.email,
        fotos: items.fotos[0].link,
        valorReal:items.valor,
        priceReal: items.price,
        lat:items.lat,
        lng:items.lng
        
    });
  }
    
    var quant = this.produtos.map(res => res.quantity)
    var quantTotal = quant.reduce((acc, val) => acc += val)
    console.log(quantTotal)
    var contaBasica = Number(items.valor) * Number(items.qtd);
    console.log(contaBasica)
    this.valores = this.produtos.map(res => res.valor);
    this.valorCompra = this.valores.reduce((acc, val) => acc += val);
    this.visu = Number(this.valorCompra.toFixed(2)) 
    console.log(this.visu)
    console.log(this.valorCompra.toFixed(2));
    console.log(this.produtos);
    var counts = {};
    var count = {

    };
    this.produtos.forEach(function(i) { count[i.nome] = (count[i.nome]||0) + 1;});
    console.log(count);
    var x = this.produtos.filter(i => i.nome === count[i.nome])
    console.log(x)
    this.quantidade.push(count)
    console.log(this.quantidade)
    var y = this.produtos.forEach( data =>{
      if(data.nome === count[data.nome]){
        console.log(data.nome + "tem")
      }
    })
    this.storage.set('contagem', count)
  }
  finalizarCompra() {

      let Usuario: GeoCoord = {
                   latitude: Number(this.lat),
                   longitude: Number(this.lng)
              };
              console.log(Usuario)
              let Loja: GeoCoord = {
                  latitude: Number(this.produtos[0].lat),
                  longitude:Number(this.produtos[0].lng)
              };
              
              
             let kilometers = this._haversineService.getDistanceInKilometers(Usuario, Loja).toFixed(1);
            // console.log("A distancia entre as lojas é de:" + Number(kilometers));
             
             this.valorFrete = Math.floor(1.20)*Number(kilometers) + 5;
             if(this.valorFrete > 30.00){
              // console.log('maior')
               var y = 35.00
               this.valorDelivery = y.toFixed(2)

             }else{
              // console.log('menor')
               this.valorDelivery = this.valorFrete.toFixed(2)

             }
    this.valores = this.produtos.map(res => res.valor);
    this.valorCompra = this.valores.reduce((acc, val) => acc += val);

    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    const dia = date.getDate() + '/' + date.getMonth()  + '/' + date.getFullYear();
    console.log(dia);
    console.log(Number(this.visu.toFixed(2)))
    console.log(this.valorDelivery)
    var valorTudo = Number(this.visu.toFixed(2)) + Number(this.valorDelivery)
    console.log(valorTudo.toFixed(2))
    this.storage.set('loja', this.loja);
    //this.storage.set('valorFinal', valorTudo.toFixed(2));
    this.storage.set('valorFrete', this.valorDelivery)
    this.storage.set('carrinhoUser', JSON.stringify(this.produtos)).then(res =>{
            this.navCtrl.navigateForward('/carrinho');
            console.log(res)
        });

  }
  voltar(){
  	this.navCtrl.navigateBack('/list');
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Aguarde...',
      duration: 6000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }
}
