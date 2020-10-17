import { Component, OnInit } from '@angular/core';
import {AlertController, NavController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import { Produtos, ItemPage } from '../item/item.page';

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.page.html',
  styleUrls: ['./item-view.page.scss'],
})
export class ItemViewPage implements OnInit {
  itemAberto;
  produtos: Array<Produtos> = [];
  ItemPage: any;
  qtd = 0;
  descrito ='';
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private storage: Storage) {
    this.storage.get('itemAberto').then((data) => {
      this.itemAberto =  JSON.parse(data);
      console.log(this.itemAberto);
    });
  }

  ngOnInit() {
  }
  add(items){
    this.qtd++;
    console.log(this.qtd);
    this.produtos.push({
      nome: items.nome,
      quantity: this.qtd,
      itemId: items.id,
      descrito: this.descrito
    })
    
    //this.ItemPage.addCarrinho(items);
    //console.log(this.produtos)
  }
  remove(items){
    this.produtos.splice(items[0])
  }
 voltar(){
    this.navCtrl.pop()
    
  }
}
