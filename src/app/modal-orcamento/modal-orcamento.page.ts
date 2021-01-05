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
  valor = '';
  constructor(public navCtrl: NavController,    private platform: Platform,    public alertCtrl: AlertController,
    private route: ActivatedRoute, public storage: Storage,
    public afStore: AngularFirestore,  public services: ServiceService,
    public modalController: ModalController,private geolocation: Geolocation,private _haversineService: HaversineService
) { }

  ngOnInit() {
    this.services.getOrcamento(this.id).subscribe(data =>{
      console.log(data);
      this.orcamento = data;
      console.log(this.id)
      
    })
  }
  enviarPro(){
    if(this.valor != ''){
      console.log(this.valor)
      var x = this.valor.replace(',', '')
      var y = Number(x)
      this.services.updateOrcamentoVal(this.id, y, this.valor)
      this.voltar();
    }else{
      alert('Por favor, digite o valor para o orçamento do seu cliente!')
    }
  }
  voltar(){
     // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
