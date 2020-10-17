import { Component, OnInit, ViewChild } from '@angular/core';
import {IonInfiniteScroll, NavController} from '@ionic/angular';
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

export interface User {
    name: string;
    role: string;
    boss: string;
    company: string;
    email: string;
    comments:string
}
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
    seNao?:string;
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
    slideOpts = {
       initialSlide: 1,
       speed: 400
       };
    qtd = 0;
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
  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
              private route: ActivatedRoute, private storage: Storage,
              public afStore: AngularFirestore,  public services: ServiceService,
              public modalController: ModalController,private geolocation: Geolocation,private _haversineService: HaversineService
) {


      const user = firebase.auth().currentUser;
      console.log(user);
      if (user) {
          this.mainuser = this.afStore.doc(`users/${user.uid}`);
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
  
        });
      } else {
        this.geolocation.getCurrentPosition().then((resp) => {
          // resp.coords.latitude
          // resp.coords.longitude
          console.log(resp.coords.latitude)
          this.lat = Number(resp.coords.latitude);
          this.lng = Number(resp.coords.longitude);

         }).catch((error) => {
           console.log('Error getting location', error);
         });
         
      }

      this.que = this.route.snapshot.paramMap.get('id');

      console.log(this.que);
      this.procUser = this.services.getProc(this.que);
      //this.comments = this.services.comment(this.que);
      console.log(this.services.getProc(this.que));
      if (this.que) {
            this.loadProduct();
            //this.loadComments();
        }
      console.log(this.services.getLikes(this.que));

      
   }
    optionsFn(value: any ) {
        this.segmento = value;
        this.categoria = this.segmento;
        console.log(this.categoria);
    }
  ngOnInit() {


  }

  async presentAlertPrompt(items) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: items.nome,
      message: 'Deseja adicionar ao carrinho?',
      inputs: [
        {
          name: 'Quantidade',
          type: 'number',
          placeholder: 'Quantidade',
          max: 3
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (alertdata) => {
            console.log(alertdata.Quantidade)

            console.log('Confirm Ok');
            if(items.especi === undefined){
              this.addCarrinho(items,alertdata.Quantidade,items.id)
            }else{
              this.presentAlertCheckbox(items, alertdata.Quantidade)

            }
          }
        }
      ]
    });

    await alert.present();
  }
  async presentAlertCheckbox(items, qtd) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Escolha os detalhes!',
      inputs: items.especi,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            this.addCarrinho(items, qtd, data.checkbox2 )
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }


 voltar(){
    this.navCtrl.pop()
  }

    loadData(event) {
        setTimeout(() => {
            console.log('Done');
            event.target.complete();

            // App logic to determine if all data is loaded
            // and disable the infinite scroll
            if (this.goalList.length === 1000) {
                event.target.disabled = true;
            }
        }, 500);
    }

    toggleInfiniteScroll() {
        this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
    }
   loadProduct() {
    this.lojaSubscription = this.services.getProc(this.que).subscribe(data => {
      this.loja = data;
      this.likes = data.LikeValue;
      this.dislikes = data.LikeValue;
      this.emailLoja = data.email;
      this.lojaLat = data.lat;
      this.lojaLng = data.lng;
      console.log(this.loja);
      console.log(this.likes);
      console.log(this.dislikes);
      let Usuario: GeoCoord = {
                   latitude: Number(this.lat),
                   longitude: Number(this.lng)
              };
              console.log(Usuario)
              let Loja: GeoCoord = {
                  latitude: Number(this.lojaLat),
                  longitude:Number(this.lojaLng)
              };
              
              
             let kilometers = this._haversineService.getDistanceInKilometers(Usuario, Loja).toFixed(1);
             console.log("A distancia entre as lojas é de:" + Number(kilometers));
             this.valorFrete = Math.floor(1.40+2.0)*Number(kilometers) + 5
             this.valorDelivery = this.valorFrete.toFixed(2)

    });
    this.productSubscription = this.services.getProccessos().subscribe(res => {
           this.goalList = res.filter(i => i.email === this.emailLoja && i.noApp ==='Sim');
           this.loadedGoalList = res.filter(i => i.email === this.emailLoja && i.noApp ==='Sim');
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
  async handleLike() {
       this.likes++;
       try {
          await this.services.like(this.que, this.loja);
          this.showalert('Obrigado pelo feedback!', 'Isso ajuda a todos nós!');
        } catch (e) {
          console.log('Erro' + e);
        }
  }
    initializeItems(): void {
        this.goalList = this.loadedGoalList;
    }

    addCarrinho(items,qtd, data) {
      console.log(items);
      this.qtd++;
      console.log(this.qtd);
      if(items.fotos[0] === undefined){
        this.produtos.push({
          nome: items.nome,
          valor: items.valor,
          price: items.price,
          product:items.nome,
          quantity: Number(qtd),
          detail: items.resumo,
          email: items.email,
          itemId: items.id,
          especi: data,
          lojaUID: this.que,
          itemNumber: this.qtd,
          emailLoja: this.loja.email,
          fotos: ''
      });
      }else{
        this.produtos.push({
          nome: items.nome,
          valor: items.valor,
          price: items.price,
          product:items.nome,
          quantity: Number(qtd),
          detail: items.resumo,
          email: items.email,
          itemId: items.id,
          especi: data,
          lojaUID: this.que,
          itemNumber: this.qtd,
          emailLoja: this.loja.email,
          fotos: items.fotos[0].link,
      });
      }
      
      var quant = this.produtos.map(res => res.quantity)
      var quantTotal = quant.reduce((acc, val) => acc += val)
      console.log(quantTotal)
      var contaBasica = Number(items.valor) * Number(qtd);
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
        this.storage.set('carrinhoUser', JSON.stringify(this.produtos)).then(() =>{
            this.navCtrl.navigateRoot('/carrinho');
        });

    }
    veritem(items) {
      console.log(items);
      this.storage.set('itemAberto', JSON.stringify(items)).then(() => {
          this.navCtrl.navigateForward('/item-view');
      });
    }
    filterList(evt) {
        this.initializeItems();

        const searchTerm = evt.srcElement.value;

        if (!searchTerm) {
            return;
        }
        this.goalList = this.goalList.filter(currentGoal => {
            if (currentGoal.nome && searchTerm) {
                if (currentGoal.nome.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {

                    return true;
                } else {
                    return false;
                }
            }
        });
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
      this.navCtrl.navigateRoot('/list');
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

 like() {


  }
}
