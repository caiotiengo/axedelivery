import {Component, NgZone, OnInit} from '@angular/core';
import {AlertController, NavController, Platform, LoadingController} from '@ionic/angular';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import{ ViewChild, ElementRef} from '@angular/core';
import { Subscription } from 'rxjs';
import { ServiceService, User } from '../service.service';
import * as firebase from 'firebase/app';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import {HttpClient} from '@angular/common/http';
import { google } from "google-maps";
import { HaversineService, GeoCoord } from "ng2-haversine";
import {format} from "date-fns";
import { PushOptions, Push, PushObject } from '@ionic-native/push/ngx';

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
export class ListPage {
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
    naoTem
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
    goalListFiltrado: Array<any> = []
    offlines: Array<any> = []
    loadedGoalListFiltrado: Array<any> = [];
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
    goalListFiltrei:  Array<any> = [];
    filtroLoja = '';
    valorFrete
    valorDelivery
    lojaLat
    lojaLng
    aprovado
    lojaperto : Array<User> = []
    complemento
    userId
    FCM
    fcmzin
    elementos
  constructor(public navCtrl: NavController,public Platform:Platform,
              public router: Router, public alerti: AlertController,
              private geolocation: Geolocation,
              public modalController: ModalController,  
              public alertCtrl: AlertController,
              private storage: Storage, 
              public afStore: AngularFirestore,
              public services: ServiceService,
              private _haversineService: HaversineService,
              private nativeGeocoder: NativeGeocoder,
              private push:Push, public loadingController: LoadingController
              ) {

              }


              slidesOptions = {
                slidesPerView: 1.2
              }
add(){
  this.navCtrl.navigateForward('/add-proc')
}
listaOrc(){
  this.navCtrl.navigateForward('/lista-orcamento')
}

status(){
  this.navCtrl.navigateForward('/status')
}

async ionViewDidEnter() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Afinando os atabaques...'
    })
    await loading.present()
    this.goalListFiltrado = [];
    this.offlines = [];
    this.storage.remove('carrinhoUser')
    this.storage.get('usuario').then(event =>{
      console.log(event)
      this.lat = event.lat;
      this.lng = event.lng
      this.endereco = event.endereco;
      this.cidade = event.cidade;
      this.bairro = event.bairro;
      this.numero = event.numeroEND;
      this.estado = event.estado;
      this.nomeUser = event.nome
      this.DOB = event.DOB
      this.complemento = event.complemento
      this.fcmzin = event.fcm;
      console.log(this.semLoja)
      console.log(this.complemento)
      if(this.complemento === undefined){
          this.alerta()
      }
      if(this.fcmzin === '1'){
        this.alerta2()
      }
    })
     
          this.storage.get('lojas').then(async data =>{
            let Onlines = data.filter(i => i.estado === this.estado)
            console.log(Onlines)
            if(Onlines.length > 0){

              Onlines.forEach(dado =>{
                let unidades = dado.unidades
                unidades.forEach(element => {
                  this.goalListFiltrado.push(element)
                  console.log(this.goalListFiltrado)
                  this.lojinha = this.goalListFiltrado
                  setTimeout(async () => {
                    this.lojaperto = []
  
                    this.goalListFiltrado.forEach(element => {
                      this.lojaLat = element.lat
                      this.lojaLng = element.lng
                      console.log(this.lojaLat)
                      let Usuario: GeoCoord = {
                        latitude: Number(this.lat),
                        longitude: Number(this.lng)
                        };
                        console.log(Usuario)
                        let Loja: GeoCoord = {
                            latitude: Number(this.lojaLat),
                            longitude:Number(this.lojaLng)
                        };
                        console.log(Loja)
                   
                        let kilometers = this._haversineService.getDistanceInKilometers(Usuario, Loja).toFixed(1);
                        console.log("A distancia entre as lojas é de:" + Number(kilometers));
  
                        if(Number(kilometers) < 8.0){
                          console.log('maior')
                          if(element.estado === this.estado ){
                            this.lojaperto.push(element)
                            console.log(this.lojaperto)
  
                          }
  
                            
                          }else{
  
                            console.log('menor')
                            
                          }
                          });                
                          this.semLoja = this.lojaperto.length
                          await loading.dismiss()

                       
  
                        }, 1000);
  
                });
              })
              this.services.getLojasOffline().subscribe(data =>{
                this.offlines = data.filter(i => i.estado === this.estado && i.status === 'Offline')
                console.log(this.offlines)
              })
            }else{
              await loading.dismiss()
              alert('Na sua região ainda não temos lojistas! Indique o Axé Delivery para as lojas da sua região! ajude a nossa religião a crescer mais no mundo da tecnologia!')
            }

          });

        }

  async alerta2(){
    const alert = await this.alerti.create({
      cssClass:'my-custom-class',
      header: 'Habilite as notificações!',
      message:'Deixe as notificações habilitadas para poder melhorar a sua experiencia no nosso app!',
      buttons:[
      {
        text:'Ok!',
        handler: () =>{
          this.habilitar()
        }
      }
    ],
    backdropDismiss:false
    });
    await alert.present();
  }

  habilitar(){
    const options: PushOptions = {
      android: {
        senderID:'612729787094'
      },
      ios: {
       alert: 'true',
       badge: true,
       sound: 'true'
     }
   }
 
   const pushObject: PushObject = this.push.init(options);
 
     pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));
 
     pushObject.on('registration').subscribe((registration: any) => {
 
     console.log('Device registered', registration.registrationId)
     this.FCM = registration.registrationId
     this.services.updateFCM(this.userId, this.FCM);
     // this.showalert('Opa!', 'Notificação habilitada.')
         console.log('Device registered', registration)

   } );
   pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
 
 

  }

  async alerta(){
    const alert = await this.alerti.create({
      cssClass:'my-custom-class',
      header: 'Não esqueça!',
      message:'Coloque aqui o complemento do seu endereço(ex: Bloco,AP ou Casa 10, Fundos), para não ter problemas na suas futuras compras!',
      inputs: [{
        name:'name1',
        type: 'text',
        placeholder: 'Complemento'
      }],
      buttons:[
      {
        text:'Pronto!',
        handler: data =>{
          console.log(data.name1)
          if(data.name1 === ""){
            return false;
          }else{
            this.services.updateComplemento(this.userId, data.name1)
            console.log('ók')
          }
        }
      }
    ],
    backdropDismiss:false
    });
    await alert.present();
  }
  produtos(){
    this.produtosSubscription = this.services.getProccessos().subscribe(data =>{
      this.listaProdutos = data
      this.listaProdutosSize= data;
      this.tamanho = this.listaProdutosSize.lenght
    })
  }
  filtroZona(evt){
    this.initializeItems();

    const searchTerm = evt.srcElement.value;
    var x = this.lojinha.filter(i => i.estado === this.estado)
    this.naoTem = x.length
    console.log(this.naoTem)
    console.log(searchTerm)
    if (!searchTerm) {
       return;
    }
    this.goalListFiltrado = this.lojinha.filter(currentGoal => {
       if (currentGoal.zona && searchTerm) {
           if (currentGoal.zona.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {

             return true;
           } else {
             return false;
           }
       }else{
        this.naoTem = this.goalListFiltrado.length
        console.log(this.naoTem)
       }
     });
  }
  slidesDidLoad(slides) {
    slides.startAutoplay();
  }
  cli(){
    alert('Calma! Em breve estaremos com uma sessão de ervas para vocês!')
  }
  cli2(){
    alert('Calma! Em breve estaremos com uma sessão de animais para vocês!')
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
  this.storage.get('usuario').then(event =>{
    if (event) {
        this.navCtrl.navigateForward('/user');
    } else {
        this.navCtrl.navigateForward('/');
    } 
  })

      
  }

  
modal(){
  
  this.navCtrl.navigateForward('/procurar');
  

}



}
