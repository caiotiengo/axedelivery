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
  hideMe = false;
  hideMe2 = true
  motivo =''
  agencia
  conta
  CPFCNPJ
  nome
  CPFconta
  nomeNaConta
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
      this.access = event.accessToken;
      this.agencia = event.agencia;
      this.conta = event.conta;
      this.digitoConta = event.digitoConta
      this.nome = event.nome;
      this.CPFCNPJ = event.CPFconta;
      this.numeroBanco = event.numeroBank
      this.CPFconta = event.CPFconta;
      this.nomeNaConta = event.nomeNaConta

    })
    

    
  }
  async presentAlertPrompt(items) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: items.nome,
      message: 'Qual o motivo do reembolso?',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: 'Motivo'
        }],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
              console.log(data.name1)
              this.reembolso(items, data.name1)
     
          }
        }
      ]
    });

    await alert.present();
  }
  async presentAlertPrompt2(items) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: items.nome,
      message: 'Qual o motivo da revisão?',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: 'Digite aqui o motivo'
        }],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
              console.log(data.name1)
              this.revisao(items, data.name1)
     
          }
        }
      ]
    });

    await alert.present();
  }



  lista(){
    this.services.getVendas().subscribe(res => {
      const user = firebase.auth().currentUser;
      console.log(user);
      
      if(user){
        this.emailUsr = user.email;
        this.goalList = res.filter(i => i.emailLoja === this.emailUsr && i.statusEnt === 'Entregue' && i.valorDevedor > 0 );  
        this.loadedGoalList = res.filter(i => i.emailLoja  === this.emailUsr && i.statusEnt === 'Entregue' && i.valorDevedor > 0 );
         var y = this.goalList.map(i => {
          if(i.statusEnt === 'Entregue'){
            return i.valorDevedor
          }
          else{
            return 0
          }
        }).reduce((a, b) =>   a + b, 0 )
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
  abrir(){
    this.hideMe2 = false;
  }
  transfer(){
    this.presentLoading() 

    if(this.valorDevedor <= 0){
      this.moip.transfer.create({
        amount: this.valorTransferir,
        transferInstrument: {
            method: "BANK_ACCOUNT",
            bankAccount: {
              type: "CHECKING",
              bankNumber: Number(this.numeroBanco),
              agencyNumber: Number(this.agencia),
              agencyCheckNumber: 0,
              accountNumber: Number(this.conta),
              accountCheckNumber: Number(this.digitoConta),
              holder: {
                  fullname: this.nomeNaConta,
                  taxDocument: {
                      type: "CNPJ",
                      number: this.CPFconta
                  }
                }
            }
        }
    }).then((response) => {
        console.log(response.body)
        this.afStore.collection('transferencias').add(response.body).then(()=>{
          alert('Seu saldo foi transferido para a sua conta, estará disponível em até 4 dias.')

          this.hideMe2 = true;
        }).catch((err) =>{
          alert('Processo não registrado no banco')
        })

    }).catch((response) => {
        console.log(response)
    })
    }else{
      alert('Você precisa acertar o valor devedor de: ' + this.valorDevedorHTML)
    }
   
  }

 /*  */
  ngOnInit() {

    this.presentLoading() 

  }
  ionViewWillEnter(){
    setTimeout(() => {
      this.connect();
      this.lista()
    }, 1000);
  }
  connect(){
    this.moip = moipSdk({
        /* 
         token: 'C5LQHXVYGJLN0XYSTRZCQY6LRQZVV6AR',
         key: 'LNRERY9ULDQSPBXYR2BTJLNKRKLWTPEIUKAV9E1Z',
         production: false
         idmoip account "MPA-CC3641B4B904"
        */

      accessToken: this.access,
      production: true
      // id moip account prod "MPA-888C5307676A"



      // token: 'your-token', "9009a4f80e3b4402b10442cbd5684121_v2"    "0841c40baa5844dfa45df1ab0c3117f7_v2"   "MPA-61E919999FDB"
      // key: 'your-key',
     
    });
     this.moip.account.getOne(this.idmoip)
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
  reembolso(items, motivo){
    this.afStore.collection('pedidosReembolsos').add({
      idCompra: items.payments[0].id,
      motivo: motivo
    }).then(()=>{
      alert('Pedido de reembolso efetuado com sucesso!')
    }).catch((err)=>{
      console.log(err)
      alert('Ocorreu um erro durante o processamento: ' + err)
    })
  }
  revisao(items, motivo){
    this.afStore.collection('pedidosRevisao').add({
      idCompra: items.payments[0].id,
      motivo: motivo
    }).then(()=>{
      alert('Pedido de revisão efetuado com sucesso!')
    }).catch((err)=>{
      console.log(err)
      alert('Ocorreu um erro durante o processamento: ' + err)
    })
  }
/*
  reembolso(id){
    this.presentLoading() 

    console.log(id)
    this.moip.payment.refunds.create(id)
    .then((response) => {
      console.log(response.body)
      this.afStore.collection('reembolsoConcluido').add(response.body).then(()=>{
        alert('Reembolso efetuado com sucesso!')

        //this.hideMe2 = true;
      }).catch((err) =>{
        alert('Processo não registrado no banco!')
      })
        console.log(response)
    }).catch((err) => {
        console.log(err)
    })
  }
*/
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
              id: "MPA-888C5307676A"
              }
            }
      }).then((response) => {
        this.presentLoading() 

          console.log(response.body)
          this.goalList.forEach(i =>{
              if(i.valorDevedor != 0){
                var x = 0
                this.services.updateDivida(i.id,x)
                this.afStore.collection('taxasPresenciais').add(response.body).then(()=>{
                  alert("Taxa paga! Agora você pode transferir o seu saldo!")
                }).catch((err) =>{
                  alert('Processo não registrado no banco ' + err)
                })

              }else{
                alert("Ocorreu um erro inesperado. Você não tem saldo disponível!")
              }
          })
    
      }).catch((response) => {
          console.log(response.body)
          alert("Ocorreu um erro inesperado. " + response.body )

      })
      
    }else{
      alert('Sua conta não tem saldo disponível para saque!')
    }
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Aguarde...',
      duration: 5000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }
}
