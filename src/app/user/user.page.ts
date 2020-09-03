import { Component, OnInit } from '@angular/core';
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
    private goalList: any[];
    private loadedGoalList: any[];
    processos;
    typeUser;
    currentGoale;
    public products = new Array<Processo>();
    private proccessSubscription: Subscription;
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
  constructor(public navCtrl: NavController, private storage: Storage,
              public afStore: AngularFirestore, 
              public modalController: ModalController,
                public services: ServiceService,
                private formBuilder: FormBuilder,
                private geolocation: Geolocation,private http: HttpClient, public alertCtrl: AlertController) {
    


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
    });

   }

  

  ngOnInit() {
  }

  updateEnd(){
      this.hideMe = false;
  }
  updateBank(){
    this.hideMe2 = false
  }
  updateBanco(){

      this.services.updateBanco(this.userID, this.newBanco.value.bancoNew, this.newBanco.value.agenciaNew,
         this.newBanco.value.contaNew,this.newBanco.value.tipoContaNew,this.newBanco.value.nomeContaNew,
        this.newBanco.value.CPFcontaNew)
      this.showalert('Opa!', 'Dados atualizados!')
       this.hideMe2 = true;
  }
  update(){
    
    return new Promise(resolve => {
            this.http.get<any[]>('https://nominatim.openstreetmap.org/search?q='+this.newCadastro.value.enderecoNew+','+this.newCadastro.value.bairroNew+','+
               this.newCadastro.value.numeroENDNew+','+ this.newCadastro.value.cidadeNew+'&format=json').subscribe(data => {
                      resolve(data);
                      console.log(data.length);
                      if (data.length === 0){
                       this.showalert('Hm...', 'Parece que não encontramos seu endereço. Já tentou sem abreviações?')
                      }else{
                        this.datou = data[0].lat;
                       this.services.updateEnd(this.userID,this.type,this.newCadastro.value.enderecoNew, this.newCadastro.value.CEPNew,
                       this.newCadastro.value.bairroNew, this.newCadastro.value.numeroENDNew, this.newCadastro.value.cidadeNew,
                       this.newCadastro.value.estadoNew, data[0].lat, data[0].lon)
                       this.hideMe = true
                       this.storage.remove('usuario').then(() =>{
                        const user = firebase.auth().currentUser;
                        this.mainuser = this.afStore.doc(`users/${user.uid}`);
                        this.userID = user.uid
               
                        this.mainuser.valueChanges().subscribe(event => {
                           console.log(event)
                           this.FCM = event.fcm
                           this.services.updateFCM(this.userID, this.FCM)
                           this.storage.set('usuario', event).then(() =>{
                           this.showalert('Opa!', 'Dados atualizados!')
                           //this.navCtrl.navigateRoot('/list');
                              
                        })
                                 
                      })                        
                    })

                       //Av. Ten-Cel. Muniz de Aragão 
                  }
                      
                  }, err => {
                   console.log(err);
          });
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
