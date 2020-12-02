import {Component, NgZone, OnInit} from '@angular/core';
import {AlertController, NavController, Platform} from '@ionic/angular';
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
    goalListFiltrei = new Array<User>();
    filtroLoja = '';
    valorFrete
    valorDelivery
    lojaLat
    lojaLng
    lojaperto : Array<User> = []
  constructor(public navCtrl: NavController,public Platform:Platform,
              public router: Router, 
              private geolocation: Geolocation,
              public modalController: ModalController,  
              public alertCtrl: AlertController,
              private storage: Storage, 
              public afStore: AngularFirestore,
              public services: ServiceService,
              private _haversineService: HaversineService,
              private nativeGeocoder: NativeGeocoder
              ) {


          /*
          */
      
            
      
  }


 
add(){
  this.navCtrl.navigateForward('/add-proc')
}
/*share(){
  if(this.Platform.is("ios")){
    this.socialSharing.shareViaWhatsApp('Cara, to conseguindo comprar tudo para a gira no Axé Delivery!','','https://apps.apple.com/us/app/ax%C3%A9-delivery/id1528911749')

  }else{
    this.socialSharing.shareViaWhatsApp('Cara, to conseguindo comprar tudo para a gira no Axé Delivery!','','https://play.google.com/store/apps/details?id=io.ionic.axeDelivery')
  }
}*/
status(){
  this.navCtrl.navigateForward('/status')
}

  ngOnInit() {
    let user = firebase.auth().currentUser;
          console.log(user);
          if (user) {
              this.mainuser = this.afStore.doc(`users/${user.uid}`);

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
                        //let birthdate = this.DOB
                       // format(new Date(birthdate), "yyyy-MM-dd");
                        this.filtroLoja = this.zona
                        //console.log(birthdate);
                        //console.log(format(new Date(birthdate), "yyyy-MM-dd"))
                        this.goalListFiltrado = this.goalList.filter(i => i.estado === this.estado &&  i.tipo === 'Loja' && i.aprovado === 'Sim'); 

                        this.goalListFiltrei = this.goalList.filter(i => i.estado === this.estado &&  i.tipo === 'Loja' && i.status === "Online" && i.aprovado === 'Sim');//
                        this.loadedGoalListFiltrado = this.loadedGoalList.filter(i => i.estado === this.estado && i.tipo === 'Loja' && i.aprovado === 'Sim' );
                        this.lojinha = this.goalListFiltrado
                        console.log(this.lojinha)
                        
                        this.geolocation.getCurrentPosition().then((resp) => {
                          // resp.coords.latitude
                          // resp.coords.longitude
                          console.log(resp.coords.latitude)
                          this.lat = Number(resp.coords.latitude);
                          this.lng = Number(resp.coords.longitude);
                
                         }).catch((error) => {
                           console.log('Error getting location', error);
                         });
                         this.lojaperto = []

                          this.goalListFiltrei.forEach(element => {
                            this.lojaLat = element.lat
                            this.lojaLng = element.lng

                            let Usuario: GeoCoord = {
                              latitude: Number(this.lat),
                              longitude: Number(this.lng)
                         };
                         console.log(Usuario)
                         let Loja: GeoCoord = {
                             latitude: Number(this.lojaLat),
                             longitude:Number(this.lojaLng)
                         };
                         
                         
                        let kilometers = this._haversineService.getDistanceInKilometers(Usuario, Loja).toFixed(1);
                        console.log("A distancia entre as lojas é de:" + Number(kilometers));

                        if(Number(kilometers) < 8.0){
                          console.log('maior')
                          this.lojaperto.push(element)
                          console.log(this.lojaperto)
                          
                        }else{

                          console.log('menor')
                          
                        }
                          });                
                          this.semLoja = this.lojaperto.length

                        console.log(this.semLoja)
 
                    
               })
            
            
            });            

          } else {
            this.navCtrl.navigateRoot('/')
          }


     this.produtos();
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
      const user = firebase.auth().currentUser;
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
