import { Component, OnInit } from '@angular/core';
import {AlertController, ModalController, NavController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {Storage} from '@ionic/storage';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {ServiceService} from '../service.service';
import {Subscription} from 'rxjs';
import * as firebase from 'firebase';
import {Loja} from '../item/item.page';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';

export interface Vendas {
  nomeComprador: string;
  endereco: string;
  nomeLoja: string;
  valor: number;
  dia: string;
  emailComprador: string;
  produtos: string;
  statusPag: string;
  statusEnt: string;
  emailLoja: string;
}
export interface Comentario{
        comments: any,
        loja: string,
        lojaUID: any,
        emailLoja: string,
        usuario: any
}
@Component({
  selector: 'app-status',
  templateUrl: './status.page.html',
  styleUrls: ['./status.page.scss'],
})
export class StatusPage implements OnInit {
  private vendasSub: Subscription;
  private goalListUs: any[];
  private loadedGoalListUs: any[];
  private goalListST: any[];
  private loadedGoalListST: any[];
  public  loja: Loja = {};
  public commentsSubscription: Subscription;

  mainuser: AngularFirestoreDocument;
  emailUsr;
  sub;
  typeUser;
  statusEnt = '';
  comentario = '';
  que;
  venda;
  itemVenda;
  likes: 0;
  dislikes: 0;
  receber: number;
  total: number;
  valorre
  valorreST
  emailCom
  hideMe
  usuario: Array<Comentario> = [];
  private formulario : FormGroup;
  lojaUIDvenda
  comentou
  idComent
  comentariando
  compraMap
  comment
  mapVal
  nPedidoStr
  usuarioLogado
  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
              private route: ActivatedRoute, private storage: Storage,
              public afStore: AngularFirestore,  public services: ServiceService,
              public modalController: ModalController,private formBuilder: FormBuilder) {
        this.storage.get('usuario').then((data)=>{
         this.usuarioLogado = data;
         console.log(this.usuarioLogado)
        })
    console.log(this.typeUser)
             console.log(this.goalListUs)
      this.formulario = this.formBuilder.group({
          comentario: ['', Validators.required],
          starRating2:[0]
           
    });

      
  }
  ngOnInit(){
    
  }
  ionViewWillEnter(){
         this.atualiza();
 
  }
  atualiza(){
        this.vendasSub = this.services.getVendas().subscribe(res => {
      const user = firebase.auth().currentUser;
      console.log(user);
      
      if (user) {

   
           
        this.mainuser = this.afStore.doc(`users/${user.uid}`);
        this.emailUsr = user.email;
        this.goalListUs = res.filter(i => i.emailComprador === this.emailUsr && i.statusEnt != 'Cancelada' );
        
        this.loadedGoalListUs = res.filter(i => i.emailComprador  === this.emailUsr && i.statusEnt != 'Cancelada' );
        this.goalListST = res.filter(i => i.emailLoja === this.emailUsr && i.statusEnt != 'Cancelada' && i.statusEnt != 'Entregue');
        if(res.filter(i => i.emailLoja === this.emailUsr)){
          this.typeUser = 'Loja'
          console.log(this.typeUser)
        }if(res.filter(i => i.emailComprador === this.emailUsr)){
          this.typeUser = 'User'
                    console.log(this.typeUser)

        }
        this.loadedGoalListST = res.filter(i => i.emailLoja  === this.emailUsr && i.statusEnt != 'Cancelada' && i.statusEnt != 'Entregue'); 
             this.commentsSubscription = this.services.getComments().subscribe(data =>{
                console.log(data)
                this.comentariando = data
                for (var i = this.comentariando.length -1; i >= 0; i--) {
                  console.log(this.comentariando[i].nPedido)
                  this.compraMap = this.comentariando[i].nPedido
                  var x = document.getElementById(this.compraMap)
                  //console.log(Number(x.id))
                        if(this.comentariando.length > 0){
                              
                              if(this.lojaUIDvenda = res.find(i => i.nPedido === this.compraMap)){
                                  var x = document.getElementById(this.comentariando[i].nPedido)
                                  console.log(x)
                                  if(x != null && x.style.display === "block"){
                                      x.style.display = "none";
                                  }

                              }                          
                        }else{
                    }

                }

                
            })
  
        var data
        console.log(this.comentou)
        data = res.filter(i => i.nPedido === this.comentou)
        console.log(data)
        
        this.valorre =  this.goalListUs.length
        console.log(this.valorre)
        this.valorreST = this.goalListST.length
        console.log(this.valorreST)
        this.sub = this.mainuser.valueChanges().subscribe(event => {
        this.typeUser = event.tipo;


      });
        if(this.usuarioLogado.tipo === 'Loja'){
          this.mapVal = this.goalListST.map(i => {
          if(i.statusEnt != 'Cancelada'){
            return i.valor
          }
          else{
            return null
          }
        }).reduce(function(a, b) { return a + b; })
        var count = 84 * Number(this.mapVal.toFixed(2))
        console.log(count/100)   
        var percent = count/100
        this.receber = Number(percent.toFixed(2))
        this.total = Number(this.mapVal.toFixed(2))
        console.log(this.mapVal.toFixed(2))
        console.log(this.receber.toFixed(2))
      //  console.log(this.emailUsr);
        }
        
      } else {

      }
   
    });
  }
  tomaComment(items, rating){
    console.log(items)
         console.log("changed rating: ", this.formulario.value.starRating2);
       if(this.formulario.value.comentario != '' ){

     this.afStore.collection('comments').add({
         comments: this.formulario.value.comentario,
         loja: items.nomeLoja,
         nomeComprador: items.nomeComprador,
         lojaUID: items.lojaUID,
         emailLoja: items.emailLoja,
         emailComprador: items.emailComprador,
         nPedido: Number(items.nPedido),
         rating: Number(this.formulario.value.starRating2)

      }).then(()=>{
           this.showalert('Obrigado pelo feedback!', 'Isso ajuda a todos nós!');

          
          
      })
    }else{
            rating = 0;
            this.showalert('Falta Pouco!', 'Agora é só adicionar um comentário');
    } 
  
   
    
  }

  async handleLike(items) {
    this.likes++;
    try {
      await this.services.like(items.lojaUID, this.loja);
      this.showalert('Obrigado pelo feedback!', 'Isso ajuda a todos nós!');
    } catch (e) {
      console.log('Erro' + e);
    }
  }
  async handleDislike(items) {
    this.dislikes++;
    try {
      await this.services.dislike(items.lojaUID, this.loja);
      this.showalert('Obrigado pelo feedback!', 'Entraremos em contato com o anunciante');
    } catch (e) {
      console.log('Erro' + e);
    }
  }

  veritem(items) {
    console.log(items);
    this.storage.set('itemAberto', JSON.stringify(items)).then(() => {
      this.navCtrl.navigateForward('/item-view');
    });
  }
    async showalert2(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: [
         {
        text: 'Sim',
        role: 'sim',
        handler: () => {
          console.log('sim clicked');

        }
      },
      {
        text: 'Não',
        role: 'nao',
        handler: () => {
          console.log('não clicked');
        }
      }]
    });

    await alert.present();
  }
  async showalert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['Ok']
    });

    await alert.present();
  }
  initializeItems(): void {
    this.goalListUs = this.loadedGoalListUs;
    this.goalListST = this.loadedGoalListST;
  }
  filterList(evt) {
    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }
    this.goalListUs = this.goalListUs.filter(currentGoal => {
      if (currentGoal.nomeLoja && searchTerm) {
        if (currentGoal.nomeLoja.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {

          return true;
        } else {
          return false;
        }
      }
    });

    this.goalListST = this.goalListST.filter(currentGoal => {
      var x = currentGoal.nPedido
      this.nPedidoStr = String(x)
      if (this.nPedidoStr && searchTerm) {
        if (this.nPedidoStr.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {

          return true;
        } else {
          return false;
        }
      }
    });
  }

    async save(items) {
    const alert = await this.alertCtrl.create({
      header:'Pense bem...',
      message:'Você tem certeza que quer cancelar a sua compra?',
      buttons: [
         {
        text: 'Não',
        role: 'nao',
        handler: () => {
          
        }
      },
      {
        text: 'Sim',
        role: 'sim',
        handler: () => {
          console.log('sim clicked');
          //this.atualiza();
          this.services.vendasCollection.doc<Vendas>(items.id).update({statusEnt: 'Cancelada' });
        }
      }]
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
  home() {

    // this.showalert('Atenção', 'Ao sair dessa pagina');
    this.storage.remove('carrinhoUser').then(() => {
      this.navCtrl.navigateRoot('/list');
    });

  }

 doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.atualiza();
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
 
}
