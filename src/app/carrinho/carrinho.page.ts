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

export interface Produtos {
  nome?: string;
  valor?: number;
  qtd?: number;
  email?: string;
  itemId?: any;
  itemNumber?: any;
  dia?: number;
  lojaUID?:any;
  emailLoja?:string;
  price?:number;
  CPFComprador?:any;
}

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
})

export class CarrinhoPage implements OnInit {
  produtin;
  carrinho;
  loja;
  valor;
  valores;
  valorCompra;
  pagar;
  pagamento = '';
  moip: any;
  pubKey: any;
  hash: string;
  produtos: Array<Produtos> = [];
  nome;
  endereco;
  cidade;
  bairro;
  telefone;
  zona;
  like: number;
  disklike: number;
  email;
  paypalConfig
  mainuser: AngularFirestoreDocument;
  sub;
  lojaUID;
  userCPF
  produtinz;
  numeroCard = "";
  nomeCartao = "";
  CVV = "";
  mesValidade = "";
  anoValidade = "";
  DOB
  CEP
  estado
  numeroEND
  valorFrete
    valorDelivery
    lat 
    lng
    lojaLng
    lojaLat
    telefoneComprador
    complemento
    ddd
    cpfCartao ='';
    dataNCartao ='';
    telefoneCartao ='';
    dddCartao ='';
  constructor(public afStore: AngularFirestore,
              public loadingController: LoadingController,
              public navCtrl: NavController,
              private _haversineService: HaversineService, 
              public alertCtrl: AlertController, 
              private storage: Storage){
    this.storage.get('carrinhoUser').then((data) => {
      this.carrinho =  JSON.parse(data);
      console.log(this.carrinho);
    });
    this.storage.get('loja').then((data) => {
      this.loja =  data;
      console.log(this.loja);
    });
     this.storage.get('valorFrete').then((data) => {
      this.valorDelivery =  data;
      var y = this.valorDelivery.replace('.','') 
      this.valorFrete = Number(y)
      console.log(this.valorFrete);
    });
    this.storage.get('valorFinal').then((data) => {
      var x =  Number(data);
      this.valor = x.toFixed(2)
      console.log(this.valor);
    });
    this.sub = this.storage.get('usuario').then(event => {
      this.nome = event.nome;
      this.endereco = event.endereco;
      this.cidade = event.cidade;
      this.email = event.email;
      this.bairro = event.bairro;
      this.telefone = event.telefone;
      this.zona = event.zona;
      this.like = event.LikeValue;
      this.disklike = event.DislikeValue;
      this.userCPF = event.CPFCNPJ;
      this.DOB = event.DOB;
      this.numeroEND = event.numeroEND;
      this.CEP = event.CEP;
      this.estado = event.estado;
      this.telefoneComprador = event.telefone;
      this.complemento = event.complemento;
      this.ddd = event.ddd;
    });
    console.log(this.moip);
    this.hash = 'Gerando hash...';


    this.pubKey = `-----BEGIN PUBLIC KEY-----
                     MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAodkPNhEFaP90CU2z6zKZ
                     kyPb98kI3NA4C/j9lJnzUNsqgPzfx0xdHxk0rvQvqH/shJIm76EXGBtsWuUjyO8n
                     UMrq9l/8lWPY5OsOmpHiiBZ7oLjfPN1tSs3CgNMqMyWay8F82zowXOdwZk4hY+aa
                     mkkZcg8Sou3Wo7pIcInNXy9cLClp+qhrTR9LlrMcxT7oMDwxw8CFzX7SK9EEnBz0
                     H5T1BRSXVd3VXjC75I1w6RFk9AzbDfSKgj2b6Ladf0PKm4XdruiA+C7Gad8mg7Wu
                     ZBBwoPkwFHnKFtCs+P84OqNjAyEqxOc3oGgCi6LkFRWL43DfFPcPj6QkOMZM64WO
                     DQIDAQAB
                    -----END PUBLIC KEY-----`;

  this.moip = moipSdk({
    //accessToken: 'C5LQHXVYGJLN0XYSTRZCQY6LRQZVV6AR',
     token: 'C5LQHXVYGJLN0XYSTRZCQY6LRQZVV6AR',
     key: 'LNRERY9ULDQSPBXYR2BTJLNKRKLWTPEIUKAV9E1Z',
        // production: false
    production: false
  })
  }
  ngOnInit() {

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
teste(){
  this.presentLoading() 
  let birthdate = this.DOB
  var x = format(new Date(birthdate), "yyyy-MM-dd");
  let birthdateCard = this.dataNCartao
  var b = format(new Date(birthdateCard),"yyyy-MM-dd")

  MoipCreditCard
    .setEncrypter(jsencrypt, 'ionic')
    .setPubKey(this.pubKey)
    .setCreditCard({
        number: this.numeroCard, //'4012001037141112',
        cvc: this.CVV, //'123',
        expirationMonth: this.mesValidade ,//'05',
        expirationYear: this.anoValidade//'22'
    })
    .hash()
    .then(hash => {
      console.log('hash', hash)
      this.hash = hash;
        this.moip.order.create({
            ownId: this.userCPF,
            amount: {
                currency: 'BRL',
                subtotals: {
                    shipping: Number(this.valorFrete)
                }
            },
            items: this.carrinho,
            customer: {
                ownId: this.userCPF,
                fullname: this.nome,
                email: this.email,
                birthDate: x,
                taxDocument: {
                    type: 'CPF',
                    number: this.userCPF
                },
                phone: {
                    countryCode: '55',
                    areaCode: this.ddd,
                    number: this.telefone
                },
                shippingAddress: {
                    street: this.endereco,
                    streetNumber: this.numeroEND,
                    complement: this.complemento,
                    district: this.bairro,
                    city: this.cidade,
                    state: this.estado,
                    country: 'BRA',
                    zipCode: this.CEP
                }
            }
        }).then((response) => {
            console.log(response.body)
            this.moip.payment.create(response.body.id, {
            installmentCount: 1,
            fundingInstrument: {
                method: 'CREDIT_CARD',
                creditCard: {
                    hash: this.hash,
                    holder: {
                        fullname: this.nomeCartao,
                        birthdate: b,
                        taxDocument: {
                            type: 'CPF',
                            number: this.cpfCartao
                        },
                        phone: {
                            countryCode: '55',
                            areaCode: this.dddCartao,
                            number: this.telefoneCartao
                        }
                    }
                }
            }
        }).then((response) => {
          if(response.body.status === 'IN_ANALYSIS'){
              console.log(response)
              const user = firebase.auth().currentUser;
    if (user) {
      this.mainuser = this.afStore.doc(`users/${user.uid}`);
      console.log(user);
    } else {}
               this.showalert('Obrigado pela compra!', 'A loja foi informada e você' +
        ' pode acompanhar o seu pedido pela aba "Seus Pedidos"')
      this.sub = this.storage.get('usuario').then(event => {
      this.nome = event.nome;
      this.endereco = event.endereco;
      this.cidade = event.cidade;
      this.email = event.email;
      this.bairro = event.bairro;
      this.telefone = event.telefone;
      this.zona = event.zona;
      this.like = event.LikeValue;
      this.disklike = event.DislikeValue;

      const date = new Date();
      date.setMonth(date.getMonth() + 1);
      const dia = date.getDate() + '/' + date.getMonth()  + '/' + date.getFullYear();
      console.log(dia);
      const mes = date.getMonth();
      this.valores = this.carrinho.map(res => res.valor);
      this.valorCompra = this.valores.reduce((acc, val) => acc += val, 0);
      this.storage.get('valorFinal').then((data) => {
        var y = Math.floor(Number(data) + Number(this.valorDelivery));
 //Math.floor(Number(data) + 8) 
        this.valor = y.toFixed(2)
        console.log(this.valor);
      });

      this.storage.get('carrinhoUser').then((data) => {
        this.produtos =  JSON.parse(data);
        console.log(this.produtos);
        var seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
        console.log(seq);
        this.afStore.collection('vendas').add({
          nPedido:Number(seq),
          nomeComprador: this.nome,
          endereco: this.endereco + ', '+ this.numeroEND +',' + this.bairro + ', ' + this.cidade +' - CEP:' + this.CEP,
          nomeLoja: this.loja.nome,
          valor: Number(this.valor),
          dia,
          mes,
          produtos: this.produtos,
          emailComprador: this.email,
          lojaUID: this.produtos[0].lojaUID,
          emailLoja: this.produtos[0].emailLoja,
          statusPag: 'Aprovado',
          statusEnt: 'Loja informada',
          telefoneComprador: this.telefoneComprador,
          CPFComprador: this.userCPF
        }).then(() => {
          this.storage.remove('carrinhoUser').then(() => {
            this.navCtrl.navigateRoot('/status');
          });        
        });
      });
    });
          }else{
            this.showalert('Ops...', 'Hove um erro na sua compra,' +
        ' verifique suas informações e tente novamente.')
          }
        }).catch((err) => {
            console.log(err)
        })
        }).catch((err) => {
            console.log(err)
        })

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



  
 
}
