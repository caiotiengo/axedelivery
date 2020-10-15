import { Component, OnInit ,NgZone} from '@angular/core';
import {NavController,AlertController} from '@ionic/angular';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {HttpClient} from '@angular/common/http';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';

declare var google;

export interface Processo {
    nome: string ;
    endereco: string ;
    cidade: string ;
    bairro: string ;
    telefone: string ;
    LikeValue: number;
    DislikeValue: number;
    tellme: string;
    email: string;
    typeUser:string;
    lat:any;
    long:any;
}
@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})

export class UserPage implements OnInit {

  mainuser: AngularFirestoreDocument;
    nome: string ;
    endereco: string ;
    cidade: string ;
    bairro: string ;
    telefone: string ;
    email: string;
    zona: string;
    sub;
    proc;
    que: any;
    procUser;
    public goalList: any[];
    public loadedGoalList: any[];
    processos;
    typeUser;
    currentGoale;
    public products = new Array<Processo>();
    public proccessSubscription: Subscription;
    goalListFiltrado;
    loadedGoalListFiltrado;
    userID
    enderecoNew = '';
    bairroNew = '';
    cidadeNew = '';
    estadoNew = '';
    numeroENDNew = '';
    agenciaNew = '';
    contaNew = '';
    nomeContaNew = '';
    bancoNew = '';
    tipoContaNew = '';
    CEPNew = '';
    CPFconta
    hideMe = true
    hideMe2 = true
    newCadastro
    CEP:string
    estado:string
    lat
    newBanco
    newEntrega
    lng
    datou
    numero
    banco
    conta
    nomeNaConta
    tipoConta 
    agencia
    CPFcontaNew = '';
    type = '';
    FCM
    hideMe3 = true
    entrega
    seNao
    autocomplete: { input: string; };
    autocompleteItems: any[];
    location: any;
    placeid: any;
    GoogleAutocomplete: any;
    hide = false
    geocoder
    latitudeGoogle
    longitudeGoogle
  constructor(public navCtrl: NavController, private storage: Storage,
              public afStore: AngularFirestore, 
              public modalController: ModalController,
                public services: ServiceService,
                private formBuilder: FormBuilder,
                private geolocation: Geolocation,private http: HttpClient, public zone: NgZone, 
                public alertCtrl: AlertController,private push:Push) {
        this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
                  this.autocomplete = { input: '' };
                  this.autocompleteItems = [];
                  this.geocoder = new google.maps.Geocoder;


        this.newCadastro = this.formBuilder.group({
                  
                  enderecoNew: ['', Validators.required],
                  numeroENDNew: ['', Validators.required],
                  CEPNew: ['', Validators.required],
                  bairroNew: ['', Validators.required],
                  cidadeNew: ['', Validators.required],
                  estadoNew: ['', Validators.required],
                  
            });
        this.newBanco = this.formBuilder.group({
                  
                  bancoNew: ['', Validators.required],
                  contaNew: ['', Validators.required],
                  agenciaNew: ['', Validators.required],
                  nomeContaNew: ['', Validators.required],
                  tipoContaNew: ['', Validators.required],
                  CPFcontaNew: ['', Validators.required]
                  
            }); 
            this.newEntrega = this.formBuilder.group({
                  
              entregas: ['', Validators.required],
              senaoEntregas: ['', Validators.required],

              
        });        
        this.geolocation.getCurrentPosition().then((resp) => {
              console.log(resp.coords.latitude)
              console.log(resp.coords.longitude)
              this.lat = resp.coords.latitude;
              this.lng = resp.coords.longitude;
          }).catch((error) => {
              console.log('Error getting location', error);
          });

              let watch = this.geolocation.watchPosition();
                  watch.subscribe((data) => {
           // data can be a set of coordinates, or an error (if an error occurred).
           // data.coords.latitude
           // data.coords.longitude

          //AIzaSyB1IBIxpEAg1qTweg3ZU2Q1SQpgz9yrG28
          });
    const user = firebase.auth().currentUser;
    console.log(user);
    if (user) {
            this.mainuser = this.afStore.doc(`users/${user.uid}`);
               this.userID = user.uid
               console.log(this.userID)
      } else {

      }
    this.proccessSubscription = this.services.getProccessos().subscribe(data => {
          this.goalListFiltrado = data.filter(i => i.email === user.email);
          this.loadedGoalListFiltrado = data.filter(i => i.email === user.email);
          console.log(this.goalList);


    });


    this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.nome = event.nome;
      this.endereco = event.endereco;
      this.cidade = event.cidade;
      this.email = event.email;
      this.bairro = event.bairro;
      this.telefone = event.telefone;
      this.zona = event.zona;
      this.typeUser = event.tipo;
      this.CEP = event.CEP;
      this.estado = event.estado;
      this.numero = event.numeroEND
      this.banco = event.banco
      this.agencia = event.agencia
      this.conta = event.conta
      this.nomeNaConta = event.nomeNaConta
      this.tipoConta = event.correnteoupou
      this.CPFconta = event.CPFconta
      this.entrega = event.entrega
      this.seNao = event.seNao
    });

   }

  

  ngOnInit() {

  }
  entregaz(){
    this.services.updateEntrega(this.userID, this.newEntrega.value.entregas,
       this.newEntrega.value.senaoEntregas)
   this.showalert('Opa!', 'Dados atualizados!')
    this.hideMe3 = true;
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
     this.services.updateFCM(this.userID, this.FCM);
      this.showalert('Opa!', 'Notificação habilitada.')
         console.log('Device registered', registration)
   /*  this.afStore.collection('devices').add({
          idDevice: registration[0].registrationId,
 
       });
   */
   } );
   pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
 
 

  }
  private iniciarPush(){
    

  }
  updateEnd(){
      this.hideMe = false;
  }
  updateBank(){
    this.hideMe2 = false;
  }
  updateEntrega(){
    this.hideMe3 = false;
  }
  updateBanco(){

      this.services.updateBanco(this.userID, this.newBanco.value.bancoNew, this.newBanco.value.agenciaNew,
         this.newBanco.value.contaNew,this.newBanco.value.tipoContaNew,this.newBanco.value.nomeContaNew,
        this.newBanco.value.CPFcontaNew)
      this.showalert('Opa!', 'Dados atualizados!')
       this.hideMe2 = true;
  }
  UpdateSearchResults(){
    this.hide = false

    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ 
      input: this.autocomplete.input,
      componentRestrictions: {
        country: 'br'
      }
    },
    (predictions, status) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        });
      });
    });
  }
  SelectSearchResult(item) {
    this.hide = true

    ///WE CAN CONFIGURE MORE COMPLEX FUNCTIONS SUCH AS UPLOAD DATA TO FIRESTORE OR LINK IT TO SOMETHING
    console.log(String(item.terms[0].value))      
    console.log(String(item.terms[1].value))      
    console.log(String(item.terms[2].value))      
    console.log(String(item.terms[3].value))   
    console.log(JSON.stringify(item))
    
    this.newCadastro.value.enderecoNew = String(item.terms[0].value)
    this.newCadastro.value.bairroNew = String(item.terms[1].value)
    this.newCadastro.value.cidadeNew = String(item.terms[2].value)

    this.enderecoNew = String(item.terms[0].value)
    this.bairroNew = String(item.terms[1].value)
    this.cidadeNew = String(item.terms[2].value)

    console.log(this.newCadastro.value.bairroNew)
    console.log(this.newCadastro.value.cidadeNew)
    console.log(this.bairroNew)
    console.log(this.cidadeNew)

    this.placeid = item.place_id
    this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
      if(status === 'OK' && results[0]){
        let position = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
        };
        console.log(position)
        this.latitudeGoogle =results[0].geometry.location.lat()
        this.longitudeGoogle = results[0].geometry.location.lng()
        console.log(results[0].geometry.location)
        console.log(results)
        //let marker = new google.maps.Marker({
        //  position: results[0].geometry.location,
        //  map: this.map,
        //});
        //this.markers.push(marker);
        //this.map.setCenter(results[0].geometry.location);
      }
    })
  }
  
  update(){
    this.newCadastro.value.estadoNew = "RJ"
    this.services.updateEnd(this.userID,this.type,this.newCadastro.value.enderecoNew, 
      this.newCadastro.value.CEPNew,
                       this.bairroNew, this.newCadastro.value.numeroENDNew, 
                       this.cidadeNew,
                       this.newCadastro.value.estadoNew, this.latitudeGoogle, this.longitudeGoogle)
                       this.hideMe = true
                       this.storage.remove('usuario').then(() =>{
                        const user = firebase.auth().currentUser;
                        this.mainuser = this.afStore.doc(`users/${user.uid}`);
                        this.userID = user.uid
               
                        this.mainuser.valueChanges().subscribe(event => {
                           console.log(event)
                           this.FCM = event.fcm
                           this.storage.set('usuario', event).then(() =>{
                           this.showalert('Opa!', 'Dados atualizados!')
                           //this.navCtrl.navigateRoot('/list');
                              
                        })
                                 
                      })                        
                
          });
  }
  deletarItem(items){
    this.services.deletarItem(items.id)
  }
 async showalert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['Ok']
    });

    await alert.present();
  }
  sair() {
    
    this.storage.clear();
    firebase.auth().signOut().then(() => {
      this.navCtrl.navigateRoot('/');
    });

  }
  home() {
   this.navCtrl.navigateForward('/list');
  }
perfilPage() {
  	this.navCtrl.navigateForward('/login');
  	console.log('Fine');
  }
  user() {
  	this.navCtrl.navigateForward('/user');
  	console.log('Fine');
  // Deletar quando tiver conexão com o firebase.

  }

  addProc() {
  	this.navCtrl.navigateForward('/add-proc');
  	console.log('Fine');
  // Deletar quando tiver conexão com o firebase.

  }
}
