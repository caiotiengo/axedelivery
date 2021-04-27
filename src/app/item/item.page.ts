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
import { OrcamentoPage } from '../orcamento/orcamento.page';

export interface User {
    name: string;
    role: string;
    boss: string;
    company: string;
    email: string;
    comments:string
}
export interface Loja {
    unidades?: any;
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
    seNao?:string;
    lat?:any;
    lng?:any;
    
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
    valorReal?:any;
    priceReal?:any;


}

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})

export class ItemPage implements OnInit {
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
    public  loja: Loja = {};
    public que: string = null;
    public loading: any;
    public lojaSubscription: Subscription;
    public productSubscription: Subscription;
    public goalList: any[];
    public commentsSubscription: Subscription;
    public loadedGoalList: any[];
    emailLoja;
    qualquer;
    produtos: Array<Produtos> = [];
    lista: Array<any> = [];
    lista2: Array<any> = [];

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
    moremo =0
    lojaLng
    type = '';
    lojaLat
    quantidade: any = []
    categorias
    segumentacao = ''
    plataforma
    valorinicial
    idUser
    busca
    estado
    qtdUnidades
    lojaEstado
    bairroSelecionado
    bairroNome
    lojaCity
    hide = true;
    hide2 = false;
    opcLoja
    constructor(public navCtrl: NavController,  public loadingController: LoadingController,  private platform: Platform,    public alertCtrl: AlertController,
              private route: ActivatedRoute, public storage: Storage,
              public afStore: AngularFirestore,  public services: ServiceService,
              public modalController: ModalController,private geolocation: Geolocation,private _haversineService: HaversineService
) { }


  async presentModal(id) {
    
    const modal = await this.modalController.create({
      component: ModalVendaPage,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        'id': id,
        'idLoja': this.que
    }
    });
     await modal.present();

    await modal.onDidDismiss().then((r) => {
      this.testy = r.data.data;
      if(this.testy === undefined){
        console.log("indefinido")
      }else{
        this.testy.forEach(element => {
          this.addCarrinho(element)
        });
        console.log("the result:", r , 'test'+ this.testy);
        
      }

    })
  }
  searchBar(){
    this.hide = false;
    this.hide2 = true;
  }
  filtroCat(){
    this.hide = true;
    this.hide2 = false;
  }
    optionsFn(value: any ) {
        this.segmento = value;
        this.categoria = this.segmento;
        console.log(this.categoria);
    }
    async ionViewWillEnter(){
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Carregando dados da loja...'
      })
      await loading.present()
      this.storage.get('carrinhoUser').then(data =>{
        console.log(data)
        if(data){
          if(data.length != 0){
            this.produtos = [];
            data.forEach(element => {
              this.produtos.push(element)
            });
          }else{
  
          }
        }else{
          console.log('nada')
        }
        
        //this.bairroSelecionado = this.bairroNome
      })
      this.storage.get('id').then((data) =>{
        this.idUser = data;
        console.log(this.idUser)
      })
         
            
      this.storage.get('usuario').then(event => {
        console.log(event)

        this.nome = event.nome;
        this.endereco = event.endereco;
        this.cidade = event.cidade;
        this.email = event.email;
        this.bairro = event.bairro;
        this.telefone = event.telefone;
        this.zona = event.zona;

        this.estado = event.estado
    });              

    
      this.que = this.route.snapshot.paramMap.get('id');
      this.bairroSelecionado = this.route.snapshot.paramMap.get('bairro');
      console.log(this.bairroSelecionado)
      console.log(this.que);
      this.procUser = this.services.getProc(this.que);
      //this.comments = this.services.comment(this.que);
      console.log(this.services.getProc(this.que));
      if (this.que) {
        this.storage.get('produtos').then(async (data) =>{
          console.log(data)
          this.goalList = data.filter(i => i.lojaUID === this.que  && i.noApp === 'Sim');
          this.loadedGoalList = data.filter(i => i.lojaUID === this.que && i.noApp === 'Sim')
    
          this.goalList.forEach(i =>{
            //console.log(i.id)
            this.lista.push(i)
            this.lista2.push(i)
            console.log(this.lista)
           
           })
           this.categorias = Array.from(new Set(this.lista.map((item: any) => item.tipoPrd)))
           this.valorinicial = this.categorias[0]
           this.opcLoja = 'Produtos'
           console.log(this.valorinicial)
    
          /*this.goalList.forEach(element =>{
            var x = element.fotos[0].link
            let foto = x
            this.novosProdutos.push({
              nome:element.nome,
              id:element.id,
              foto: foto,
              valor: element.valor,
              quantity: element.quantity,
              tipoPrd: element.tipoPrd
            })
          })*/
          await loading.dismiss()

              this.categorias = Array.from(new Set(this.lista2.map((item: any) => item.tipoPrd)))
               console.log(this.categorias)
          });
            this.loadProduct();
      }

      
    }
    ngOnInit() {
  
    }


 async orcamento(){
          const modal = await this.modalController.create({
            component: OrcamentoPage,
            cssClass: 'my-custom-modal-css',
            componentProps: {
              'id': this.idUser,
              'idLoja': this.que,
              'nome': this.nome
            }
          });
          await modal.present();

          await modal.onDidDismiss().then((r) => {
            
          })
    }

  voltar(){
    this.storage.remove('carrinhoUser').then(() =>{
      //alert('Estamos esvaziando o seu carrinho!');
      this.navCtrl.pop()

    })
  }

    loadData1(event) {
        setTimeout(() => {
            console.log('Done');
            event.target.complete();
            if (this.goalList.length === 1000) {
                event.target.disabled = true;
            }
        }, 500);
    }

    toggleInfiniteScroll() {
        this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
    }
    buscando(evt){
      this.bairroNome = evt.target.value
      this.mudeOpc(this.bairroNome)
    }
    mudeOpc(evt){
      this.bairroSelecionado = evt
      console.log(this.bairroSelecionado)
      this.storage.get('usuario').then(data=>{
        this.lat = data.lat;
        this.lng = data.lng
 
      let ba = this.loja.unidades.find(y => y.bairro === this.bairroSelecionado)
      console.log(ba)
      this.lojaLat = ba.lat
      this.lojaLng = ba.lng
      let Usuario: GeoCoord = {
          latitude: Number(this.lat),
          longitude: Number(this.lng)
      };
      console.log(Usuario)
      let Loja: GeoCoord = {
          latitude: Number(this.lojaLat),
          longitude:Number(this.lojaLng)
      };
      console.log(Usuario);
      console.log(Loja)
      
      let kilometers = this._haversineService.getDistanceInKilometers(Usuario, Loja).toFixed(1);
      console.log("A distancia entre as lojas é de:" + Number(kilometers));
        console.log(Number(kilometers))
        let moto = Number(kilometers) - 3
        console.log(moto)
        this.valorFrete = Math.floor(1.70) * moto + 18.50;
        this.valorDelivery = this.valorFrete.toFixed(2)
        if(moto <= 6.0){
          this.valorDelivery = 18.00
        }
      });
    }
  async loadProduct() {
   
    this.services.getProc(this.que).subscribe(data => {
      this.loja = data
      console.log(this.loja)
      console.log(this.estado)
      console.log(this.loja.unidades.length)
      console.log(this.loja.unidades)
      this.qtdUnidades = this.loja.unidades.length
      //this.likes = data.LikeValue;
      //this.dislikes = data.LikeValue;
      this.emailLoja = this.loja.email;
      if(this.loja.unidades.length >= 1){
        this.lojaEstado = this.loja.unidades.filter(i => i.estado === this.estado);
        this.lojaCity = this.loja.cidade;
        this.mudeOpc(this.bairroSelecionado)

      }

    });


    this.commentsSubscription = this.services.getComments().subscribe(res =>{
           this.lojaID = res.filter(i => i.emailLoja === this.emailLoja)
           this.commentsLen = Number(this.lojaID.length)

    })
  }
      nextSlide(mySlider) {
        console.log(mySlider);
        mySlider.slideNext(mySlider);
      }
      slidePrev(mySlider) {
                console.log(mySlider);
                mySlider.slidePrev(mySlider);
      }

    initializeItems(): void {
        this.lista = this.lista2;
    }
    

    segmentChanged(items){
      this.initializeItems();

      console.log(items.detail.value)
      //this.segumentacao = items.detail.value
      this.moremo = 0
      const searchTerm = items.detail.value;
      this.categoria = items.detail.value
      this.more()
      if (!searchTerm) {
          return;
      }
      this.lista = this.lista2.filter(currentGoal => {
          if (currentGoal.tipoPrd && searchTerm) {
              if (currentGoal.tipoPrd.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {

                  return true;
              } else {
                  return false;
              }
          }
      });
 
    }
    segmentChanged3(items){
      this.initializeItems();

      console.log(items.detail.value)

      const searchTerm = items.detail.value;
      if (!searchTerm) {
          return;
      }
      this.lista = this.lista2.filter(currentGoal => {
          if (currentGoal.nome && searchTerm) {
              if (currentGoal.nome.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {

                  return true;
              } else {
                  return false;
              }
          }
      });
 
    }
    segmentChanged2(items){
      this.initializeItems();

      console.log(items.detail.value)
      const searchTerm = items.detail.value;
      this.opcLoja = items.detail.value

     
    }
    more(){
      this.moremo++
      if(this.busca != undefined){
        this.filterList(this.busca)

      }else{
        console.log('sem busca')
        
      }
      console.log(this.moremo)
      if(this.categoria != this.valorinicial){

        if(this.moremo === 1){
          //this.lista =[]
          //this.lista2 =[]
  
          this.goalList.filter(i => i.tipoPrd === this.categoria).slice(0,25).forEach(x =>{
           
            //console.log(i.id)
            //this.loadProduct()
            this.lista.push(x)
            this.lista2.push(x)
  
    
           })
    
        }else if(this.moremo === 2){
         // this.lista =[]
         // this.lista2 =[]
    
          this.goalList.filter(i => i.tipoPrd === this.categoria).slice(25,50).forEach(x =>{
           
            //console.log(i.id)
            //this.loadProduct()
            this.lista.push(x)
            this.lista2.push(x)
  
           })
    
        }else if(this.moremo >= 3){
          //this.lista =[]
          //this.lista2 =[]
          
          this.goalList.filter(i => i.tipoPrd === this.categoria).forEach(x =>{
           
            //console.log(i.id)
            //this.loadProduct()
            this.lista.push(x)
            this.lista2.push(x)
  
    
           })
        }
      }else{
        if(this.moremo === 1){
         // this.lista =[]
          //this.lista2 =[]
  
          this.goalList.filter(i => i.tipoPrd === this.categoria).slice(0,25).forEach(x =>{
            console.log(x)

            //console.log(i.id)
            //this.loadProduct()
            this.lista.push(x)
            this.lista2.push(x)
  
    
           })
    
        }else if(this.moremo === 2){
         // this.lista =[]
         // this.lista2 =[]
    
          this.goalList.filter(i => i.tipoPrd === this.categoria).slice(25,50).forEach(x =>{
            console.log(x)
            //console.log(i.id)
            //this.loadProduct()
            this.lista.push(x)
            this.lista2.push(x)
  
           })
    
        }else if(this.moremo >= 3){
         // this.lista =[]
          //this.lista2 =[]
          
          this.goalList.filter(i => i.tipoPrd === this.categoria).forEach(x =>{
            console.log(x)

            //console.log(i.id)
            //this.loadProduct()
            this.lista.push(x)
            this.lista2.push(x)
  
    
           })
        }
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

    addCarrinho(items) {
      console.log(items.valor * items.qtd );
      console.log(this.qtd);
      console.log(items.detail)
      if(items.fotos[0] === undefined){
        this.produtos.push({
          nome: items.nome,
          valor: items.valor * Number(items.qtd),
          price: items.price,
          product:items.nome,
          quantity: Number(items.qtd),
          detail: items.detail,
          email: items.email,
          itemId: items.id,
          especi: items.especi,
          lojaUID: this.que,
          itemNumber: this.qtd,
          emailLoja: this.loja.email,
          fotos: '',
          valorReal:items.valor,
          priceReal:items.price

      });
      }else{
        console.log(items.detail)

        this.produtos.push({
          nome: items.nome,
          valor: items.valor * Number(items.qtd),
          price: items.price,
          product:items.nome,
          quantity: Number(items.qtd),
          detail: items.detail,
          email: items.email,
          itemId: items.id,
          especi: items.especi,
          lojaUID: this.que,
          itemNumber: this.qtd,
          emailLoja: this.loja.email,
          fotos: items.fotos[0].link,
          valorReal:items.valor,
          priceReal:items.price

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
        this.valores = this.produtos.map(res => res.valor);
        this.valorCompra = this.valores.reduce((acc, val) => acc += val);
        
        if(this.valorCompra > 15.00){
          const date = new Date();
          date.setMonth(date.getMonth() + 1);
          const dia = date.getDate() + '/' + date.getMonth()  + '/' + date.getFullYear();
          console.log(dia);
          console.log(Number(this.visu.toFixed(2)))
          console.log(this.valorDelivery)
          var valorTudo = Number(this.visu.toFixed(2)) + Number(this.valorDelivery)
          console.log(valorTudo.toFixed(2))
          this.storage.set('loja', this.loja);
          this.storage.set('valorFinal', valorTudo.toFixed(2));
          this.storage.set('valorFrete', this.valorDelivery)
          this.storage.set('carrinhoUser', JSON.stringify(this.produtos)).then(res =>{
              this.navCtrl.navigateForward('/carrinho');
              console.log(res)
          });

        }else{
          alert('O valor mínimo em produtos é de R$15,00')
        }
        
    }
    veritem(items) {
      console.log(items);
      this.storage.set('itemAberto', JSON.stringify(items)).then(() => {
          this.navCtrl.navigateForward('/item-view');
      });
    }
    filterList(evt) {
      this.initializeItems();
      console.log(evt)
      const searchTerm =  evt.srcElement;
      if(searchTerm != undefined){
        console.log('nao undefined')
        this.busca = searchTerm.value
        if (!this.busca) {
          return;
       }
       this.lista = this.lista2.filter(currentGoal => {
           if (currentGoal.nome && this.busca) {
               if (currentGoal.nome.toLowerCase().indexOf(this.busca.toLowerCase()) > -1) {
                   return true;
                 } else {
                   return false;
                 }
             }
         });

      }else{
        console.log('undefined')
        this.busca = evt;
        if (!this.busca) {
          return;
       }
       this.lista = this.lista2.filter(currentGoal => {
           if (currentGoal.nome && this.busca) {
               if (currentGoal.nome.toLowerCase().indexOf(this.busca.toLowerCase()) > -1) {
                   return true;
                 } else {
                   return false;
                 }
             }
         });

      }  
    }
 async handleDislike() {
       this.dislikes++;
       try {
           await this.services.dislike(this.que, this.loja);
           this.showalert('Obrigado pelo feedback!', 'Entraremos em contato com o anunciante');
         } catch (e) {
           console.log('Erro' + e);
         }
  }
 back() {
    this.storage.remove('carrinhoUser').then(() =>{
      alert('Estamos esvaziando o seu carrinho!');
      this.navCtrl.navigateRoot('/list');

    })
   }

  home() {
    this.navCtrl.navigateForward('/tabs/tab1');
  }
  pesquisa() {
    this.navCtrl.navigateForward('/list');
  }
    addProc() {
     const user = firebase.auth().currentUser;

     if (user) {
      this.navCtrl.navigateForward('/add-proc');
      console.log('Fine');
  } else {
    this.navCtrl.navigateForward('/login');
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
  perfilPage() {
      const user = firebase.auth().currentUser;

      if (user) {
      this.navCtrl.navigateForward('/user');
    } else {
      this.navCtrl.navigateForward('/login');
    }
  }


}
