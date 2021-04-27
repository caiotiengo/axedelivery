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
import { MoipCreditCard } from 'moip-sdk-js';
import moipSdk from 'moip-sdk-node'
import {
  MediaCapture,
  MediaFile,
  CaptureError
} from '@ionic-native/media-capture/ngx';
import {finalize} from 'rxjs/operators';
import {Observable} from 'rxjs'
import { File, FileEntry } from '@ionic-native/File/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { PoliticaPage } from '../politica/politica.page';
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
    Prinome = '';
    Segnome = '';
    CPFRES ='';
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
    numeroEND:number;
    agencia = '';
    conta = '';
    correnteoupou ='';
    complemento ='';
    nomeNaConta = '';
    banco = '';
    ddd = '';
    digitoConta ='';
    check:boolean
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
    hide2 = false
    latitudeGoogle
    longitudeGoogle
    autocomplete2: { input: string; };
    autocompleteItems2: any[];
    hider = true
    primeiraDiv = true;
    segundaDiv = true;
    terceiraDiv = true;
    quartaDiv = true;
    started = false;
    aprovado = true;
    moip: any;
    pubKey: any;
    hash: string;
    Es
    states
    cidades: Array<any> = [];
    errosFirebase;
    errosFirebaseLoad;  
    errosFire
  constructor(public navCtrl: NavController, private storage: Storage,public loadingController: LoadingController,
              public afAuth: AngularFireAuth, private geolocation: Geolocation, public router: Router, public actRouter: ActivatedRoute,
              public services: ServiceService, public afStore: AngularFirestore, public alertCtrl: AlertController,
              private modalController: ModalController,private http: HttpClient,private afStorage: AngularFireStorage,
              private mediaCapture: MediaCapture,private platform: Platform,private camera: Camera,
              private file: File,private push:Push,
              private media: Media, private formBuilder: FormBuilder, public zone: NgZone) {}

  ngOnInit() {
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

  });
  this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
  this.autocomplete = { input: '' };
  this.autocompleteItems = [];
  this.geocoder = new google.maps.Geocoder;

    this.services.data().then(x =>{
      this.states = x;
      console.log(this.states)
    })

    this.services.data3().then(z =>{
      this.errosFire = z
      this.errosFirebase = this.errosFire.errors;

      console.log(this.errosFirebase)
    })
  }
  city(evt){
    console.log(evt.srcElement.value)
    this.estado = evt.srcElement.value;
  let estado =  this.states.estados.filter(i => i.sigla === this.estado)
      console.log(estado[0].cidades)
      this.cidades =[];
      estado[0].cidades.forEach(element => {

        this.cidades.push({
          nome:element,
          estado:this.estado
        })
      });
  }
/**
 Registro wirecard
 */





// ---------- Google Address ----------- //
UpdateSearchResults(evt){
  this.hide = false
  this.autocomplete.input = evt.srcElement.value;
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
async SelectSearchResult(item) {
  this.hide = true
  const loading = await this.loadingController.create({
    cssClass: 'my-custom-class',
    message: 'Consultando o Pai Google...',
  });
  await loading.present();
  ///WE CAN CONFIGURE MORE COMPLEX FUNCTIONS SUCH AS UPLOAD DATA TO FIRESTORE OR LINK IT TO SOMETHING
  console.log(String(item.terms[0].value))      
  console.log(String(item.terms[1].value))      
  console.log(String(item.terms[2].value))      
  console.log(String(item.terms[3].value))   
  console.log(JSON.stringify(item))
  
  this.endereco = String(item.terms[0].value)

  //this.cidade = String(item.terms[2].value)
  //this.Es = String(item.terms[3].value)

  console.log(this.endereco)
  this.placeid = item.place_id
  console.log(this.placeid)
  this.geocoder.geocode({'placeId': item.place_id}, async (results, status) => {
    console.log(status)
    if(status === 'OK' && results[0]){

      let position = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
      };
      console.log(position)
      this.latitudeGoogle = results[0].geometry.location.lat()
      this.longitudeGoogle = results[0].geometry.location.lng()
      console.log(results[0].geometry.location)
      console.log(results)
      await loading.dismiss();

      //let marker = new google.maps.Marker({
      //  position: results[0].geometry.location,
      //  map: this.map,
      //});
      //this.markers.push(marker);
      //this.map.setCenter(results[0].geometry.location);
    }else{
      this.endereco = ''
      alert('Preencha novamente o campo endereço!')
      await loading.dismiss();

    }
  })
}
/*
Autocomplete
*/

  async authenticacao(){
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Enviando para o banco de dados....',
    });
    await loading.present();
    this.services.RegisterUser(this.email, this.password)      
      .then(async (res) => {
        console.log(res.user.uid)
        this.userID = res.user.uid
        await loading.dismiss();

        this.segundoPasso()
      }).catch(async (e) => {
        await loading.dismiss();

        console.dir(e)
          var erro = this.errosFirebase.filter(i => i.code === e.code)
          console.log(erro[0].message)
          if(erro.length > 0){
            alert('Ops! ' + erro[0].message )

          }else{
            alert('Ops! ' + e )
          }
        })
  }

async registrarUsuario(){
  const loading = await this.loadingController.create({
    cssClass: 'my-custom-class',
    message: 'Cadastrando o seu perfil...',
  });
  await loading.present();
  const userid = this.userID
  this.afStore.doc(`users/${userid}`).set({
     nome: this.nome,
     email: this.email,
     endereco: this.endereco,
     telefone:  this.telefone,
     bairro: this.bairro,
     cidade: this.cidade,
     lat: this.latitudeGoogle,
     lng: this.longitudeGoogle,
     numeroEND: this.numeroEND,
     CPFCNPJ: this.CPF,
     CEP: this.CEP,
     complemento: this.complemento,
     estado: this.estado,
     ddd: this.ddd,
     fcm: '1',          
     }).then(async (data)=>{
       await loading.dismiss()
       this.quartoPasso()
     }).catch(async (e) =>{
      console.dir(e)
      var erro = this.errosFirebase.filter(i => i.code === e.code)
      console.log(erro[0].message)
      if(erro.length > 0){
        await loading.dismiss()

        this.showalert('Ops!',erro[0].message )

      }else{
        await loading.dismiss()

        this.showalert('Ops!',e )
      }

    })
     
  
  }




  iniciar(){

    this.started = false
    this.primeiraDiv = true;
    this.segundaDiv = true;
    this.terceiraDiv = true;
    this.quartaDiv = true;
  }

  primeiroPasso(){

    this.started = true
    this.primeiraDiv = false;
    this.segundaDiv = true;
    this.terceiraDiv = true;
    this.quartaDiv = true;

  }
  segundoPasso(){
    //console.log(this.email)
    //console.log(this.senha)
    this.started = true
    this.primeiraDiv = true;
    this.segundaDiv = false;
    this.terceiraDiv = true;
    this.quartaDiv = true;

  }
  terceiroPasso(){
    this.started = true
    this.primeiraDiv = true;
    this.segundaDiv = true;
    this.terceiraDiv = false;
    this.quartaDiv = true;

  }
  quartoPasso(){
    this.services.getProc(this.userID).subscribe((res) =>{
      console.log(res)
      this.storage.set('usuario', res).then((data) =>{
        console.log(data)
      })
    })
    this.started = true
    this.primeiraDiv = true;
    this.segundaDiv = true;
    this.terceiraDiv = true;
    this.quartaDiv = false;

  }
  quintoPasso(){
   
  }

  async showalert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['Ok']
    });

    await alert.present();
  }

  politica(){
    this.presentModal();
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: PoliticaPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }
  finalizar(){
    this.storage.get('usuario').then((data)=>{
      console.log(data)
      this.navCtrl.navigateRoot('/list')
    })
  }

  habilitar(){
    this.aprovado = false;
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
         console.log('Device registered', registration)

   } );
   pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
 
 

  }



checklistUsuario(){
    if(this.email !='' || this.email != undefined){
      if(this.password !='' || this.password != undefined){
        if(this.nome !='' || this.nome != undefined){
          console.log('ok nome')
          if(this.CPF !='' || this.CPF != undefined){
            console.log('ok cpf')
            if(this.endereco !='' || this.endereco != undefined){
              console.log('ok end')
              if(this.numeroEND != null || this.numeroEND != undefined){
                console.log('ok num')
                if(this.CEP !='' ||this.CEP != undefined){
                  console.log('ok Cep')
                  if(this.complemento !='' || this.complemento != undefined){
                    console.log('ok com')
                    if(this.bairro !='' || this.bairro != undefined){
                      console.log('ok bairro')
                      if(this.cidade !='' || this.cidade != undefined){
                        console.log('ok cid')
                        if(this.ddd !='' || this.ddd != undefined){
                          console.log('ok ddd')
                          if(this.telefone !='' || this.telefone != undefined){
                            console.log('ok Tel')
                            this.registrarUsuario()
                          }else{
                            alert('Preencha o campo "Telefone"')
                          }
                        }else{
                          alert('Preencha o campo "DDD"')
                        }
                  
                      }else{
                        alert('Preencha o campo "Cidade"')
                      }
                    }else{
                      alert('Preencha o campo "Bairro"')
                    }
              
                  }else{
                    alert('Preencha o campo "Complemento"')
                  }
                }else{
                  alert('Preencha o campo "CEP"')
                }
              }else{
                alert('Preencha o campo "Número"')
              }
            }else{
              alert('Preencha o campo "Endereço"')
            }
          }else{
            alert('Preencha o campo "CPF"')
          }
        }else{
          alert('Preencha o campo "Nome Completo"')
        }
      }else{
        alert('Preencha o campo "Senha"')
      }
    }else{
      alert('Preencha o campo "Email"')
    }
  }

}
