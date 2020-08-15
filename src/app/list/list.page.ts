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
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
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
  proc;
  tipo
  private goalList: any[];
  private loadedGoalList: any[];
  processos;
  currentGoale;
  public products = new Array<Processo>();
  private proccessSubscription: Subscription;
    userLocation;
    userCity;
    lat;
    lng;
    location;
   
    userLocationFromLatLng;
    mainuser: AngularFirestoreDocument;
    sub;
    name;
    boss;
    zona;
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
    goalListFiltrei
    filtroLoja = '';
  constructor(public navCtrl: NavController, public Platform:Platform,
              public router: Router, 
              private geolocation: Geolocation,
              public modalController: ModalController,  
              public alertCtrl: AlertController,
              private storage: Storage, 
              public afStore: AngularFirestore,
              public services: ServiceService,
              private _haversineService: HaversineService
              ) {
          let user = firebase.auth().currentUser;
          console.log(user);
          if (user) {
              this.mainuser = this.afStore.doc(`users/${user.uid}`);
            

          } else {
              this.showalert('Bem-vindo ao Axé delivery!', 'Faça o login para' 
             +'começar a explorar o mundo macumbistico na sua região');
              //this.navCtrl.navigateRoot('/');

          }
      this.proccessSubscription = this.services.getUsers().subscribe(data => {
          this.goalList = data;
          this.loadedGoalList = data;
            this.mainuser.valueChanges().subscribe(event => {
                console.log(event)
                  this.zona = event.zona;
                  this.lat = event.lat;
                  this.lng = event.lng
                  this.endereco = event.endereco;
                  this.cidade = event.cidade;
                  this.cep = event.CEP;
                  this.bairro = event.bairro;
                  this.numero = event.numeroEND;
                  this.estado = event.estado;
                  this.nomeUser = event.nome
                  this.DOB = event.DOB
                  this.tipo = event.tipo
                  let birthdate = this.DOB
                  format(new Date(birthdate), "yyyy-MM-dd");
                  this.filtroLoja = this.zona
                  console.log(birthdate);
                  console.log(format(new Date(birthdate), "yyyy-MM-dd"))
               // this.goalListFiltrado = this.goalList.filter(i => i.zona === this.zona && i.tipo === 'Loja' && i.aprovado === true);
              // this.loadedGoalListFiltrado = this.loadedGoalList.filter(i => i.zona === this.zona && i.tipo === 'Loja' && i.aprovado === true);

              this.lojaApr = this.goalList.filter(i => i.tipo === 'Loja' && i.aprovado === "Sim")       
                                 this.goalListFiltrado = []

              this.lojaApr.forEach(loja => {
              console.log(loja)
              this.lojaAprLat = loja.lat; 
              this.lojaAprLng = loja.lng; 
              console.log(this.lojaAprLng +" " + this.lojaAprLat)

              let Usuario: GeoCoord = {
                   latitude: Number(this.lat),
                   longitude: Number(this.lng)
              };
              console.log(Usuario)
              let Loja: GeoCoord = {
                  latitude: Number(this.lojaAprLat),
                  longitude:Number(this.lojaAprLng)
              };
              
              
             let kilometers = this._haversineService.getDistanceInKilometers(Usuario, Loja).toFixed(1);
             console.log("A distancia entre as lojas é de:" + kilometers); 

             var km = Number(kilometers)
               if(Number(kilometers) >= 0 ){
                    this.goalListFiltrado.push(loja)
                    console.log(this.goalListFiltrado.length)
                    
                    this.lojinha = this.goalListFiltrado
                    this.semLoja = this.goalListFiltrado.length

                 }else{
                   console.log("Out of range" + loja.lenght)
                  this.semLoja = this.goalListFiltrado.length

               } 
             
            })
         })



    });

            
      
  }


 
ionViewWillEnter(){

  
      
                 
  
  
}




  ngOnInit() {
     
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
    async showalert(header: string, message: string) {
        const alert = await this.alertCtrl.create({
            header,
            message,
            buttons: ['Ok']
        });

        await alert.present();
    }

   dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true
    });
  }
  verifica() {
      const user = firebase.auth().currentUser;
      if (!user) {
      this.navCtrl.navigateForward('/login');
        }

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
