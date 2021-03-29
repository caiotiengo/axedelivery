import { Component, OnInit, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';
import { ServiceService } from '../service.service';
import * as firebase from 'firebase';
import { NavController, ModalController, AlertController } from '@ionic/angular';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Push } from '@ionic-native/push/ngx';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-lista-produtos',
  templateUrl: './lista-produtos.page.html',
  styleUrls: ['./lista-produtos.page.scss'],
})
export class ListaProdutosPage implements OnInit {
  public proccessSubscription: Subscription;
  goalList;
  loadedGoalList
  mainuser: AngularFirestoreDocument;
  userID
  categorias
  valorinicial
  moremo = 0
  categoria
  lista: Array<any> = [];
  lista2: Array<any> = [];
  busca
  constructor(public navCtrl: NavController,
    public afStore: AngularFirestore, 
    public modalController: ModalController,
      public services: ServiceService, 
      public alertCtrl: AlertController, public storage: Storage) {
    const user = firebase.auth().currentUser;
    console.log(user);
    if (user) {
            this.mainuser = this.afStore.doc(`users/${user.uid}`);
               this.userID = user.uid
               console.log(this.userID)
      } else {

      }
      this.proccessSubscription = this.services.getProccessos().subscribe(data => {
        this.goalList = data.filter(i => i.email === user.email && i.noApp === "Sim");
        this.loadedGoalList = data.filter(i => i.email === user.email && i.noApp === "Sim");
        console.log(this.goalList);
        this.goalList.slice(0,10).forEach(i =>{
          //console.log(i.id)
          this.lista.push(i)
          this.lista2.push(i)
          console.log(this.lista)
         
         })
        this.categorias = Array.from(new Set(this.lista.map((item: any) => item.tipoPrd)))
        this.valorinicial = this.categorias[0]
        console.log(this.valorinicial);
        this.categorias = Array.from(new Set(this.lista2.map((item: any) => item.tipoPrd)))
        console.log(this.categorias)

  });
   
   }

  ngOnInit() {
  }
  initializeItems(): void {
    this.lista = this.lista2;

  }
  addProc() {
  	this.navCtrl.navigateForward('/add-proc');
  	console.log('Fine');
  // Deletar quando tiver conexão com o firebase.

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
        this.lista =[]
        this.lista2 =[]

        this.goalList.filter(i => i.tipoPrd === this.categoria).slice(0,25).forEach(x =>{
         
          //console.log(i.id)
          //this.loadProduct()
          this.lista.push(x)
          this.lista2.push(x)

  
         })
  
      }else if(this.moremo === 2){
        this.lista =[]
        this.lista2 =[]
  
        this.goalList.filter(i => i.tipoPrd === this.categoria).slice(0,50).forEach(x =>{
         
          //console.log(i.id)
          //this.loadProduct()
          this.lista.push(x)
          this.lista2.push(x)

         })
  
      }else if(this.moremo >= 3){
        this.lista =[]
        this.lista2 =[]
        
        this.goalList.filter(i => i.tipoPrd === this.categoria).forEach(x =>{
         
          //console.log(i.id)
          //this.loadProduct()
          this.lista.push(x)
          this.lista2.push(x)

  
         })
      }
    }else{
      if(this.moremo === 1){
        this.lista =[]
        this.lista2 =[]

        this.goalList.filter(i => i.tipoPrd === this.categoria).slice(0,25).forEach(x =>{
          console.log(x)

          //console.log(i.id)
          //this.loadProduct()
          this.lista.push(x)
          this.lista2.push(x)

  
         })
  
      }else if(this.moremo === 2){
        this.lista =[]
        this.lista2 =[]
  
        this.goalList.filter(i => i.tipoPrd === this.categoria).slice(0,50).forEach(x =>{
          console.log(x)
          //console.log(i.id)
          //this.loadProduct()
          this.lista.push(x)
          this.lista2.push(x)

         })
  
      }else if(this.moremo >= 3){
        this.lista =[]
        this.lista2 =[]
        
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
      if (this.lista.length == 1000) {
        event.target.disabled = true;
      }
    }, 500);
  }

  filterList(evt) {
    this.initializeItems();
    if(evt.srcElement.value === undefined){
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
    }else{
      const searchTerm = evt.srcElement.value;
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
    
}
  async presentAlertConfirm(items) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Quase apagando o seu item...',
      message: 'Você tem certeza disso?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Tenho',
          handler: () => {
            console.log('Confirm Okay');
            this.deletarItem(items)
          }
        }
      ]
    });

    await alert.present();
  }
  deletarItem(items){
    this.services.deletarItem(items.id).then(() =>{
      alert('Seu produto foi deletado com sucesso!');
    })
  }

}
