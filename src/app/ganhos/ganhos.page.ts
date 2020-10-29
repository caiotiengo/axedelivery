import { Component, OnInit, AfterViewChecked } from '@angular/core';
import jsencrypt from 'jsencrypt';
import {Storage} from '@ionic/storage';
import { MoipCreditCard } from 'moip-sdk-js';
import moipSdk from 'moip-sdk-node'
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { HaversineService, GeoCoord } from "ng2-haversine";
import {AlertController, NavController} from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import {format} from "date-fns";
import * as _ from 'lodash';
import { BrMaskDirective, BrMaskModel } from 'br-mask';
import * as numeral from 'numeral'
import { ServiceService } from '../service.service';
@Component({
  selector: 'app-ganhos',
  templateUrl: './ganhos.page.html',
  styleUrls: ['./ganhos.page.scss'],
})
export class GanhosPage implements OnInit {
  moip: any;
  sub
  idmoip
  areceber
  valor
  ordens
  access
  valorDevedor: any;
  valorDevedorHTML: any;
  valorTransferir
  emailUsr
  public goalList: any[];
  public loadedGoalList: any[];
  numeroBanco
  numeroAgencia
  digitoAgencia
  numeroConta
  digitoConta
  constructor(public afStore: AngularFirestore,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    private _haversineService: HaversineService, 
    public alertCtrl: AlertController, 
    private storage: Storage,public brMask: BrMaskDirective,public services: ServiceService) { 
      const user = firebase.auth().currentUser;

    this.storage.get('usuario').then(event => {

      console.log(event)
      this.idmoip = event.idmoip;
      this.access = event.accessToken
      this.numeroBanco = event.bankNumber
      this.numeroAgencia = event.agencia
      this.digitoAgencia = event.digitoAgencia
      this.numeroConta = event.numeroConta
       this.digitoConta = event.digitoConta
    })
    

    
  }
  lista(){
    this.services.getVendas().subscribe(res => {
      const user = firebase.auth().currentUser;
      console.log(user);
      
      if(user){
        this.emailUsr = user.email;
        this.goalList = res.filter(i => i.emailLoja === this.emailUsr && i.statusEnt != 'Cancelada' && i.valorDevedor > 0 );  
        this.loadedGoalList = res.filter(i => i.emailLoja  === this.emailUsr && i.statusEnt != 'Cancelada' && i.valorDevedor > 0 );
         var y = this.goalList.map(i => {
          if(i.statusEnt === 'Entregue'){
            return i.valorDevedor
          }
          else{
            return 0
          }
        }).reduce(function(a, b) { return a + b; })
        const config: BrMaskModel = new BrMaskModel()
         config.money = true;
         this.valorDevedorHTML =  this.brMask.writeValueMoney(String(y),config)
      //   this.valor = this.brMask.writeValueMoney(String(x), config)
        this.valorDevedor = y
        console.log(this.valorDevedor)
      }else{

      }
    })
  }
  transfer(){
    if(this.valorDevedor <= 0){
      this.moip.transfer.create({
        amount: this.valorTransferir,
        transferInstrument: {
            method: "BANK_ACCOUNT",
            bankAccount: {
                type: "CHECKING",
                bankNumber: this.numeroBanco,
                agencyNumber: this.numeroAgencia,
                agencyCheckNumber: this.digitoAgencia,
                accountNumber: this.numeroConta,
                accountCheckNumber: this.digitoConta,
                holder: {
                    fullname: "Nome do Portador",
                    taxDocument: {
                        type: "CPF",
                        number: "22222222222"
                    }
                }
            }
        }
    }).then((response) => {
        console.log(response.body)
    }).catch((response) => {
        console.log(response.body)
    })
    }else{
      alert('Você precisa acertar o valor devedor de: ' + this.valorDevedorHTML)
    }
   
  }

 /* conta(){
    this.moip.account.create({
      email: {
          address: "costa1241@hotmail.com"
      },
      person: {
          name: "Runscope",
          lastName: "Random 9123",
          taxDocument: {
              type: "CPF",
              number: "110.837.397-60"
          },
          identityDocument: {
              type : "RG",
              number: "434322344",
              issuer: "SSP",
              issueDate: "2000-12-12"
          },
          birthDate: "1990-01-01",
          phone: {
              countryCode: "55",
              areaCode: "11",
              number: "965213244"
          },
          address: {
              street: "Av. Brigadeiro Faria Lima",
              streetNumber: "2927",
              district: "Itaim",
              zipCode: "01234-000",
              city: "São Paulo",
              state: "SP",
              country: "BRA"
          }
      },
      type: "MERCHANT",
      transparentAccount: true
  }).then((response) => {
      console.log(response.body)
  }).catch((err) => {
      console.log(err)
  })
  } */
  ngOnInit() {

    

  }
  ionViewWillEnter(){
    setTimeout(() => {
      this.connect();
      this.lista()
    }, 3000);
  }
  connect(){
    this.moip = moipSdk({
      token: 'C5LQHXVYGJLN0XYSTRZCQY6LRQZVV6AR',
      key: 'LNRERY9ULDQSPBXYR2BTJLNKRKLWTPEIUKAV9E1Z',
         // production: false
     production: false
      //accessToken:'C5LQHXVYGJLN0XYSTRZCQY6LRQZVV6AR', //this.access,
      // token: 'your-token', "9009a4f80e3b4402b10442cbd5684121_v2"    "0841c40baa5844dfa45df1ab0c3117f7_v2"   "MPA-61E919999FDB"
      // key: 'your-key',
     // production: false
 
    });
     this.moip.account.getOne("MPA-CC3641B4B904")
     .then((response) => {
       this.moip.balance.getOne()
       .then((response) => {
           console.log(response)
           var x = response.body[0].current
           var y = response.body[0].future
         console.log(x)
         this.valorTransferir = x
         const config: BrMaskModel = new BrMaskModel()
         config.money = true;
         this.areceber =  this.brMask.writeValueMoney(String(y),config)
         this.valor = this.brMask.writeValueMoney(String(x), config)
         //console.log(this.areceber)
          this.moip.order.getAll().then((response) =>{
            console.log(response)
            this.ordens = response.body.orders
          }).catch((err)=>{
            console.log(err)
          })
       }).catch((err) => {
           console.log(err)
       })
         console.log(response.body)
     })
     .catch((err) => {
         console.log(err)
     })

     
  }
  private mascara() : any {
    const config: BrMaskModel = new BrMaskModel()
    config.money = true;
    return this.brMask.writeValueMoney(String(this.valor), config)
  }

  reembolso(id){
    console.log(id)
    this.moip.payment.refunds.create(id)
    .then((response) => {
        console.log(response)
    }).catch((err) => {
        console.log(err)
    })
  }

  voltar(){
  	this.navCtrl.pop();
  }

  transferirAxe(){

    if(this.valorTransferir > 0 && this.valorDevedor != 0){
      this.moip.transfer.create({
        amount: this.valorDevedor, 
        transferInstrument: {
            method: "MOIP_ACCOUNT",
            moipAccount:{
              id:"MPA-CC3641B4B904" //"MPA-888C5307676A"
              }
            }
      }).then((response) => {
          console.log(response.body)
    
      }).catch((response) => {
          console.log(response.body)
      })
      
    }else{
      alert('Sem saldo')
    }
  }
}
