import { Component, OnInit } from '@angular/core';
import {AlertController, NavController} from '@ionic/angular';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.page.html',
  styleUrls: ['./item-view.page.scss'],
})
export class ItemViewPage implements OnInit {
  itemAberto;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private storage: Storage) {
    this.storage.get('itemAberto').then((data) => {
      this.itemAberto =  JSON.parse(data);
      console.log(this.itemAberto);
    });
  }

  ngOnInit() {
  }
 voltar(){
    this.navCtrl.pop()
  }
}
