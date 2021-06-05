import {Component, NgZone, OnInit} from '@angular/core';
import {AlertController, NavController, Platform, LoadingController} from '@ionic/angular';
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
import { google } from "google-maps";
import { HaversineService, GeoCoord } from "ng2-haversine";
import {format} from "date-fns";
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { File, FileEntry } from '@ionic-native/File/ngx';

declare var google: any;

export interface Processo {
    unidades?: any;
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
    produtos:Array<any> = [];
    unidades:Array<any> = [];
    unit
    lojas
  constructor(public navCtrl: NavController, public Platform:Platform,
    public router: Router, 
    private geolocation: Geolocation,
    public modalController: ModalController,  
    public alertCtrl: AlertController,
    private storage: Storage, 
    public afStore: AngularFirestore,
    public services: ServiceService,
    private _haversineService: HaversineService,
    private nativeGeocoder: NativeGeocoder,
    public loadingController: LoadingController,public file:File, public http: HttpClient) {


     }
     slidesOptions = {
      slidesPerView: 1.0
    }
  async ngOnInit() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Afinando os atabaques...',
    });
    this.storage.get('usuario').then(data =>{
      console.log(data)
      if (data && data.tipo === "user"){
        console.log(data.tipo)
        console.log('vai')
        this.navCtrl.navigateRoot('/list');
      }else if(data.tipo === "Loja"){
        console.log('nao')
        this.storage.remove('usuario');
        alert('Amigo Lojista, para ter acesso a sua loja, entre no app "Parceiros Axé"! Faça o download agora na Play Store ou App Store.')
        //this.navCtrl.navigateForward('/login')
      }
    })
    
      this.services.getUsers().subscribe(async (data) => {

        this.goalList = data;
        this.storage.remove('carrinhoUser')
        this.loadedGoalList = data;
        this.goalListFiltrei = this.goalList.filter(i =>  i.tipo === 'Loja' && i.aprovado === 'Sim');
        this.goalListFiltrado = this.goalList.filter(i =>  i.tipo === 'Loja' && i.aprovado === 'Sim');
        
        await loading.dismiss();
  
      })  
   
    


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
clique(){
  window.location.href = 'https://cadastro.axedelivery.com.br';
  /*if(this.Platform.is("ios")){
    console.log('ios')
    window.location.href = 'https://apps.apple.com/us/app/parceiros-ax%C3%A9/id1565700938'
  }else if(this.Platform.is("android")){
    window.location.href = 'https://play.google.com/store/apps/details?id=io.axedelivery.parceirosapp'
  }else{
    window.location.href = 'https://www.axedelivery.com.br/'

  }*/
}
entrar(){
  this.storage.get('usuario').then(data =>{
    console.log(data)
    if (data.lenght > 0){
      this.navCtrl.navigateRoot('/list');
    }else{
      this.navCtrl.navigateForward('/login')
    }
  })

}

  registro(){
    this.navCtrl.navigateForward('/register')
  }
  login(){
    this.navCtrl.navigateForward('/login')
  }

}
