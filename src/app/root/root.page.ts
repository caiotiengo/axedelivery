import {Component, NgZone, OnInit} from '@angular/core';
import {AlertController, NavController, Platform} from '@ionic/angular';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import{ ViewChild, ElementRef} from '@angular/core';
import { Subscription } from 'rxjs';
import { ServiceService } from '../service.service';
import * as firebase from 'firebase/app';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import {HttpClient} from '@angular/common/http';
import { google } from "google-maps";
import { HaversineService, GeoCoord } from "ng2-haversine";
import {format} from "date-fns";

declare var google: any;

export interface Processo {
    zona: string;
    role: string;
    boss: string ;
    company: string;
    LikeValue: number;
    DislikeValue: number;
    tellme: string;
    email: string;
    id:string;
    nome:string;
}
@Component({
  selector: 'app-root',
  templateUrl: './root.page.html',
  styleUrls: ['./root.page.scss'],
})
export class RootPage implements OnInit {
  @ViewChild('map',  {static: true}) mapRef: ElementRef;
  public map: google.maps.Map;
  public mapOptions: google.maps.MapOptions;
    geoLatitude: number;
    geoLongitude: number;
    geoAccuracy: number;
    geoAddress: string;

    watchLocationUpdates: any;
    loading: any;
    isWatching: boolean;

    // Geocoder configuration
    geoencoderOptions: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
    };
    email: string;
  proccess = '';
  listaProdutosSize
  proc;
  tipo
  private goalList: any[];
  private loadedGoalList: any[];
  processos;
  currentGoale;
  public products = new Array<Processo>();
  private proccessSubscription: Subscription;
  private produtosSubscription: Subscription;

  userLocation;
    userCity;
    lat;
    lng;
    location;
   tamanho
    userLocationFromLatLng;
    mainuser: AngularFirestoreDocument;
    sub;
    name;
    boss;
    zona;
    listaProdutos
    goalListFiltrado = new Array<Processo>();
    loadedGoalListFiltrado;
    pois:any[];
    data
    existe
    lojaApr
    lojaAprLat
    lojaAprLng
    km
    semLoja
    lojinha
    latitudeNow
    longitudeNow
    endereco
    cidade
    bairro
    cep
    numero
    estado
    nomeUser
    datou
    DOB
    goalListFiltrei = new Array<Processo>();
    filtroLoja = '';
    valorFrete
    valorDelivery
  constructor(public navCtrl: NavController, public Platform:Platform,
    public router: Router, 
    private geolocation: Geolocation,
    public modalController: ModalController,  
    public alertCtrl: AlertController,
    private storage: Storage, 
    public afStore: AngularFirestore,
    public services: ServiceService,
    private _haversineService: HaversineService,
    private nativeGeocoder: NativeGeocoder) {


     }

  ngOnInit() {
    //
 
    this.proccessSubscription = this.services.getUsers().subscribe(data => {
      this.goalList = data;
      this.loadedGoalList = data;
      this.goalListFiltrei = this.goalList.filter(i =>  i.tipo === 'Loja' && i.aprovado === 'Sim');
      this.goalListFiltrado = this.goalList.filter(i =>  i.tipo === 'Loja' && i.aprovado === 'Sim');
    })  
    this.services.getProccessos().subscribe(res => {
        this.storage.set('produtos', res).then(res =>{
          console.log(res)
        })

    });
  }
  perfilPage() {
    const user = firebase.auth().currentUser;
this.storage.get('usuario').then(event =>{
  if (event) {
      this.navCtrl.navigateForward('/user');
  } else {
      this.navCtrl.navigateForward('/');
  }
})

    
}
registro(){
  this.navCtrl.navigateForward('/register')
}
login(){
  this.navCtrl.navigateForward('/login')
}
initializeItems(): void {
  this.goalListFiltrado = this.lojinha;
}
filterList(evt) {
  this.initializeItems();

  const searchTerm = evt.srcElement.value;

  if (!searchTerm) {
     return;
   }
  this.goalListFiltrado = this.lojinha.filter(currentGoal => {
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
