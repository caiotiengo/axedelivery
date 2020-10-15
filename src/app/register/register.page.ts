import { Component, OnInit, NgZone } from '@angular/core';
import {NavController, Platform } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { ServiceService } from '../service.service';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import {AlertController, ModalController} from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import { AngularFirestoreDocument} from '@angular/fire/firestore';
import { LoadingController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';

import {
  MediaCapture,
  MediaFile,
  CaptureError
} from '@ionic-native/media-capture/ngx';
import {finalize} from 'rxjs/operators';
import {Observable} from 'rxjs'
import { File, FileEntry } from '@ionic-native/File/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
declare var google;

export interface Foto {
  fotoN: string;
  link?: any;
}
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
    nome = '';
    endereco = '';
    telefone = '';
    bairro = '';
    cidade = '';
    estado = '';
    type = '';
    typeUser = '';
    resumo = '';
    email = '';
    password = '';
    CPFconta = '';
    CEP = '';
    DOB = '';
    CPF = '';
    numeroEND = '';
    agencia = '';
    conta = '';
    correnteoupou ='';
    complemento ='';
    nomeNaConta = '';
    banco = '';
    ddd = '';
    lat 
    url

    long
    cnpj: any;
    strCNPJ: any;
    datou
    public cadastro : FormGroup;
    mainuser: AngularFirestoreDocument;
    userID
    sub;
    FCM
    public donwloadUrl: Observable<string>;
    public uploadPercent: Observable<number>;
    photos: Array<Foto> = [];
    autocomplete: { input: string; };
    autocompleteItems: any[];
    location: any;
    placeid: any;
    GoogleAutocomplete: any;
    hide = false
    geocoder
    latitudeGoogle
    longitudeGoogle
  constructor(public navCtrl: NavController, private storage: Storage,public loadingController: LoadingController,
              public afAuth: AngularFireAuth, private geolocation: Geolocation, public router: Router, public actRouter: ActivatedRoute,
              public services: ServiceService, public afStore: AngularFirestore, public alertCtrl: AlertController,
              private modalController: ModalController,private http: HttpClient,private afStorage: AngularFireStorage,
              private mediaCapture: MediaCapture,private platform: Platform,private camera: Camera,
              private file: File,private push:Push,
              private media: Media, private formBuilder: FormBuilder, public zone: NgZone) {
                this.cadastro = this.formBuilder.group({
                  resumo: [''],
                  nome: [''],
                  endereco: [''],
                  telefone: [''],
                  bairro: [''],
                  cidade: [''],
                  estado: [''],
                  email: [''],
                  password: [''],
                  CEP: [''],
                  DOB: [''],
                  complemento:[''],
                  banco:[''],
                  CPF: [''],
                  agencia: [''],
                  nomeNaConta: [''],
                  conta: [''],                  
                  numeroEND: ['',],
                  correnteoupou:[''],
                  CPFconta:[''],
                  ddd:[''],
                  entregaDe:[''],
                  seNEntrega:['']   

            });

            
         this.geolocation.getCurrentPosition().then((resp) => {
              console.log(resp.coords.latitude)
              console.log(resp.coords.longitude)
              this.lat = resp.coords.latitude;
              this.long = resp.coords.longitude;
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
          this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
          this.autocomplete = { input: '' };
          this.autocompleteItems = [];
          this.geocoder = new google.maps.Geocoder;

  }

  ngOnInit() {
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
    
    this.cadastro.value.endereco = String(item.terms[0].value)
    this.cadastro.value.bairro = String(item.terms[1].value)
    this.endereco = String(item.terms[0].value)
    this.bairro = String(item.terms[1].value)
    this.cidade = String(item.terms[2].value)

    console.log(this.cadastro.value.endereco)
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
  
  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Aguarde...',
      duration: 6000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }
  registrar() {
   const{email, password } = this.cadastro.value;
   this.presentLoading() 

    if(this.cadastro.valid && this.typeUser == 'Loja'){
      try {
        const res =  this.afAuth.createUserWithEmailAndPassword(email, password).then(() => {
         if(this.FCM === undefined){
           this.FCM === '1'
         }
        const user = firebase.auth().currentUser;
        this.afStore.doc(`users/${user.uid}`).set({
             nome: this.cadastro.value.nome,
             email: this.cadastro.value.email,
             endereco: this.cadastro.value.endereco,
             telefone:  this.cadastro.value.telefone,
             bairro: this.cadastro.value.bairro,
             cidade: this.cadastro.value.cidade,
             zona: this.type,
             tipo: this.typeUser,
             LikeValue: 0,
             DislikeValue: 0,
             lat: this.latitudeGoogle,
             lng: this.longitudeGoogle,
             aprovado: "Nao avaliado",
             banco: this.cadastro.value.banco,
             CPFconta:this.cadastro.value.CPFconta,
             agencia: this.cadastro.value.agencia,
             nomeNaConta: this.cadastro.value.nomeNaConta,
             conta: this.cadastro.value.conta,
             correnteoupou:this.correnteoupou,
             resumo: this.cadastro.value.resumo,
             numeroEND: this.cadastro.value.numeroEND,
             CPFCNPJ: this.cadastro.value.CPF,
             CEP: this.cadastro.value.CEP,
             DOB: this.cadastro.value.DOB,
             estado: "RJ", //this.cadastro.value.estado,
             ddd:this.cadastro.value.ddd,
             entrega: this.cadastro.value.entregaDe,
             seNao: this.cadastro.value.seNEntrega,
             fcm: '1',
             FotoPerfil: String(this.url)
        }).then(() => {
           const user = firebase.auth().currentUser;
           if(this.FCM === undefined){
            this.FCM === '1'
          }
          this.mainuser = this.afStore.doc(`users/${user.uid}`);
          this.userID = user.uid
 
          this.sub = this.mainuser.valueChanges().subscribe(event => {
            if(this.FCM === undefined){
              this.FCM === '1'
            }
            this.storage.set('usuario', event) 
                              this.storage.set('email', user.email);
                
               this.navCtrl.navigateRoot('/user');
               console.log(user);
               this.showalert('Bem-vindo ao Axé Delivery!', 'Agora é só aproveitar!')
             });
 
        });
 
 
        })
        
     } catch (err) {
         console.dir(err);
     }
    } else if(this.cadastro.valid && this.typeUser == 'user'){
      try {
        const res =  this.afAuth.createUserWithEmailAndPassword(email, password).then(() => {
         if(this.FCM === undefined){
           this.FCM === '1'
         }
        const user = firebase.auth().currentUser;
        this.afStore.doc(`users/${user.uid}`).set({
             nome: this.cadastro.value.nome,
             email: this.cadastro.value.email,
             endereco: this.cadastro.value.endereco,
             telefone:  this.cadastro.value.telefone,
             bairro: this.cadastro.value.bairro,
             cidade: this.cadastro.value.cidade,
             zona: this.type,
             tipo: this.typeUser,
             LikeValue: 0,
             DislikeValue: 0,
             lat: this.latitudeGoogle,
             lng: this.longitudeGoogle,
             aprovado: "Nao avaliado",
             banco: '',
             CPFconta: '',
             agencia: '',
             nomeNaConta: '',
             conta: '',
             correnteoupou: '',
             resumo: '',
             numeroEND: this.cadastro.value.numeroEND,
             CPFCNPJ: this.cadastro.value.CPF,
             CEP: this.cadastro.value.CEP,
             DOB: this.cadastro.value.DOB,
             estado: "RJ", //this.cadastro.value.estado,
             ddd:this.cadastro.value.ddd,
             entrega: '',
             seNao: '',
             fcm: '1',
             FotoPerfil: String(this.url)
        }).then(() => {
          if(this.FCM === undefined){
            this.FCM === '1'
          }
           const user = firebase.auth().currentUser;
 
          this.mainuser = this.afStore.doc(`users/${user.uid}`);
          this.userID = user.uid
 
          this.sub = this.mainuser.valueChanges().subscribe(event => {
               this.storage.set('usuario', event) 
                              this.storage.set('email', user.email);
                              if(this.FCM === undefined){
                                this.FCM === '1'
                              }
               this.navCtrl.navigateRoot('/user');
               console.log(user);
               this.showalert('Bem-vindo ao Axé Delivery!', 'Agora é só aproveitar!')
             });
 
        });
 
 
        })
        
     } catch (err) {
         console.dir(err);
     }
  }
      // tslint:disable-next-line:indent
      // tslint:disable-next-line:indent
  	 console.log(this.cadastro);

      // tslint:disable-next-line:indent
  	// Após o registro, ele fará a insersão no firebase.
  }
  async showalert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['Ok']
    });

    await alert.present();
  }
  voltar(){
  		this.navCtrl.navigateForward('/');
  }

  async photo(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true,
      //mediaType: this.camera.MediaType.PICTURE
  }
  try{
    const fileUri: string = await this.camera.getPicture(options)
    let file: string

    if(this.platform.is('ios')){
      file = fileUri.split('/').pop();
    }else{
      file = fileUri.substring(fileUri.lastIndexOf('/')+1, fileUri.indexOf('?'))
    }
    const path: string = fileUri.substring(0, fileUri.lastIndexOf('/'));
    const buffer: ArrayBuffer = await this.file.readAsArrayBuffer(path, file)
    const blob: Blob = new Blob([buffer],{type:'image/jpeg'})
    this.uploadPicture(blob)
  }catch(error){
    console.error(error)
  }

}

uploadPicture(blob:Blob){
  var seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
  console.log(seq);
  const ref = this.afStorage.ref(seq +'.jpeg');
  const task = ref.put(blob)
  const don = this.afStorage.ref(seq+'.jpeg');
  const task2 = don.put(blob)
  this.uploadPercent = task.percentageChanges();
  task2.snapshotChanges().pipe(
      finalize(() => {

        this.donwloadUrl = don.getDownloadURL();
        this.donwloadUrl.subscribe(res => {
          this.url = res;
           this.photos.push({fotoN:'ionic.fotoSUB',
                          link:String(this.url)})
          this.showalert('Opa!', 'Concluido! Se quiser, já pode se registrar!');

        })
       
      })
    ).subscribe();
}

}
