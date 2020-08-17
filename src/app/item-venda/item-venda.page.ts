import { Component, OnInit } from '@angular/core';
import {AlertController, NavController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {ServiceService} from '../service.service';
import {ActivatedRoute} from '@angular/router';
import {Vendas} from '../status/status.page';
import * as firebase from 'firebase';

@Component({
  selector: 'app-item-venda',
  templateUrl: './item-venda.page.html',
  styleUrls: ['./item-venda.page.scss'],
})
export class ItemVendaPage implements OnInit {
  itemAberto;
  que;
  itemVenda;
  venda;
  typeUser;
  statusEnt = '';
  mainuser: AngularFirestoreDocument;
  emailUsr;
  sub;
  private goalList: any[];
  private loadedGoalList: any[];
  constructor( public navCtrl: NavController, private route: ActivatedRoute,  public afStore: AngularFirestore,
               public services: ServiceService,
               public alertCtrl: AlertController, private storage: Storage) {
    this.load();
    this.que = this.route.snapshot.paramMap.get('id');
    // this.itemVenda = this.services.getStatusProd(this.que);
    const user = firebase.auth().currentUser;
    console.log(user);
    if (user) {
      this.mainuser = this.afStore.doc(`users/${user.uid}`);
      this.emailUsr = user.email;
      console.log(this.emailUsr);
    } else {

    }
    this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.typeUser = event.tipo;

    });
  }
  voltar(){
  	this.navCtrl.pop()
  }
  ngOnInit() {
  }
  save() {
    this.que = this.route.snapshot.paramMap.get('id');
    return this.services.vendasCollection.doc<Vendas>(this.que).update({statusEnt: this.statusEnt });
  }
  load() {
    this.que = this.route.snapshot.paramMap.get('id');

    this.itemVenda = this.services.getStatusProd(this.que).subscribe(data => {
      this.venda = data;
      console.log(this.venda);
    });
  }
  veritem(items) {
    console.log(items);
    this.storage.set('itemAberto', JSON.stringify(items)).then(() => {
      this.navCtrl.navigateForward('/item-view');
    });
  }
}
