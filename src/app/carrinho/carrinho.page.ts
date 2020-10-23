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
    idmoip
    porcentagemAxe:number
    porcentagemLoja:number
    count = [];
    uid
  constructor(public afStore: AngularFirestore,
              public loadingController: LoadingController,
              public navCtrl: NavController,
              private _haversineService: HaversineService, 
              public alertCtrl: AlertController, 
              private storage: Storage){

                const user = firebase.auth().currentUser;
                this.uid = user.uid;
                console.log(this.uid)            
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
      console.log(x)
      this.valor = x.toFixed(2)
      console.log(this.valor);
    });
    this.storage.get('contagem').then((data) =>{
      var z = data
      this.count = z;
    })
    this.sub = this.storage.get('usuario').then(event => {
      console.log(event)
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
      //this.DOB = event.DOB;
      this.numeroEND = event.numeroEND;
      this.CEP = event.CEP;
      this.estado = event.estado;
      this.telefoneComprador = event.telefone;
      this.complemento = event.complemento;
      this.ddd = event.ddd;
      this.idmoip = event.idmoip;
      this.porcentagemLoja =  event.porcentagemLoja;
      this.porcentagemAxe = event.porcentagemAxe;
    });
    console.log(this.moip);
    this.hash = 'Gerando hash...';


    this.pubKey = `-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs4QUZH3Y8mQaCqYtOT9g
    +yQTtmtGkESK1AnQ66roMlsJRyZ8xiCsmO0OC2hckKKA7h7KQNBTMMWCAhXr0jRB
    SqeFhD9QOqQGh5NcLgf6DZ2WhalwozfnCaYmjwWCPfTaWARem+8k/7VhctpoEM7B
    PWCbqSsUFicQlhXvM8p5tMacVhEVxGe0SGvDpS3DaX8FoIUyI8Jn6fWXMV/Ya59p
    f+yrk2ufrSI/gtmJpOZ4/5W/bsGEGtiJtGBtnI+cjRLjPa8kyQ7pa266ozmRqnst
    +EJhsHdW1P8T254YByuKdc6OU73UwPYowYt2DtNemI2KHQExarj7+70Ez4w5gAch
    xwIDAQAB
    -----END PUBLIC KEY-----
    `;

  this.moip = moipSdk({
    //accessToken: 'C5LQHXVYGJLN0XYSTRZCQY6LRQZVV6AR',
    /*
    token: 'C5LQHXVYGJLN0XYSTRZCQY6LRQZVV6AR',
     key: 'LNRERY9ULDQSPBXYR2BTJLNKRKLWTPEIUKAV9E1Z',
        // production: false
    production: false
    */
    accessToken: '292bed0bd3244409b835986edca4119f_v2',
    token: 'Z9KP0SCKJ2UZGWSGYXUJCZOU0BVMB1QN',
    //secret:'cf87986f39c342caa5d9a49c6c166a2a',
    key: 'Y4UDSTTB0JSJC6UPCQPGLMGPHQT7MEHCDM1FERDI',
    channelId:"APP-16HIIBI5HPS8",
    // production: false
    production: true,
    "Accept" : "*/*"
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
  //let birthdate = this.DOB
  //var x = format(new Date(birthdate), "yyyy-MM-dd");
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
            ownId: this.cpfCartao,
            amount: {
                currency: 'BRL',
                subtotals: {
                    shipping: Number(this.valorFrete)
                }
            },
            items: this.carrinho,
            customer: {
                ownId: this.cpfCartao,
                fullname: this.nomeCartao,
                email: this.email,
                birthDate: b,
                taxDocument: {
                    type: 'CPF',
                    number: this.cpfCartao
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
                },
            },
            receivers: [
              {
                moipAccount: {
                    id: "MPA-888C5307676A"
                },
                type: "PRIMARY",
                feePayor: true,
                amount: {
                  percentual: this.loja.porcentagemAxe
                  }
              },
              {
                moipAccount: {
                    id: this.loja.idmoip
                },
                type: "SECONDARY",
                feePayor: false,
                amount: {
                  percentual: this.loja.porcentagemLoja,
                  }
              }
            ]
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
          if(response.body.status === 'AUTHORIZED'){
              console.log(response.body.id)
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
                  var y = Number(data);

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
                    CPFComprador: this.userCPF,
                    idPagamento: response.body.id,
                    compradorUID: this.uid
                  }).then(() => {
                    this.storage.remove('carrinhoUser').then(() => {
                      this.navCtrl.navigateRoot('/status');
                    });        
                  });
                });
              });
          }else if(response.body.status === 'IN_ANALYSIS'){
            this.showalert('Opa!', 'Seu pagamento está em análise, assim que for autorizado vamos liberar o produto para você!')
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
                var y = Number(data);

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
                  statusPag: 'Em análise',
                  statusEnt: 'Loja informada',
                  telefoneComprador: this.telefoneComprador,
                  CPFComprador: this.userCPF,
                  idPagamento: response.body.id,
                  compradorUID: this.uid
                }).then(() => {
                  this.storage.remove('carrinhoUser').then(() => {
                    this.navCtrl.navigateRoot('/status');
                  });        
                });
              });
            });
          }else if(response.body.status === 'CANCELLED'){
            this.showalert('Opa!', 'Seu pagamento foi cancelado por algum motivo, entre em contato com o seu banco!')
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
                var y = Number(data);

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
                  statusPag: 'Cancelado pelo banco',
                  statusEnt: 'Cancelado pelo banco',
                  telefoneComprador: this.telefoneComprador,
                  CPFComprador: this.userCPF,
                  idPagamento: response.body.id,
                  compradorUID: this.uid
                }).then(() => {
                  this.storage.remove('carrinhoUser').then(() => {
                    this.navCtrl.navigateRoot('/status');
                  });        
                });
              });
            });
          }else {
            this.showalert('Ops...', 'Houve algum erro no seu pagamento.')
          }
        }).catch((err) => {
            console.log(err)
            alert("Pagamento não concluido:"+" "+ err)

        })
        }).catch((err) => {
            console.log(err)
            alert("Pagamento não concluido:"+" "+ err)

        })

  });

}
  async pagarDin() {
    const user = firebase.auth().currentUser;
    if (user) {
      this.mainuser = this.afStore.doc(`users/${user.uid}`);
      console.log(user);
    } else {}
    this.showalert('Obrigado pela compra!', 'A loja foi informada e você' +
        ' pode acompanhar o seu pedido pela aba "Seus Pedidos"');
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
      this.userCPF = event.CPFCNPJ

      const date = new Date();
      date.setMonth(date.getMonth() + 1);
      const dia = date.getDate() + '/' + date.getMonth()  + '/' + date.getFullYear();
      console.log(dia);
      const mes = date.getMonth();
      console.log(mes)
      this.valores = this.carrinho.map(res => res.valor);
      this.valorCompra = this.valores.reduce((acc, val) => acc += val, 0);
      this.storage.get('valorFinal').then((data) => {
        var y = Number(data);

// Math.floor(Number(data) + 8) //Math.floor(Number(data) + Number(this.valorDelivery));
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
          endereco: this.endereco + ', '+ this.numeroEND +',' + this.bairro + ', ' + this.cidade +' - CEP:' + this.CEP,          nomeLoja: this.loja.nome,
          valor: Number(this.valor),
          dia,
          mes,
          produtos: this.produtos,
          emailComprador: this.email,
          lojaUID: this.produtos[0].lojaUID,
          emailLoja: this.produtos[0].emailLoja,
          statusPag: 'Em dinheiro',
          statusEnt: 'Loja informada',
          telefoneComprador: this.telefoneComprador,
          CPFComprador: this.userCPF,
          compradorUID: this.uid

        }).then(() => {
          this.storage.remove('carrinhoUser').then(() => {
            this.navCtrl.navigateRoot('/status');
          });        
        });
      });
    });

  }
  async pagarDeb() {
    const user = firebase.auth().currentUser;
    if (user) {
      this.mainuser = this.afStore.doc(`users/${user.uid}`);
      console.log(user);
    } else {}
    this.showalert('Obrigado pela compra!', 'A loja foi informada e você' +
        ' pode acompanhar o seu pedido pela aba "Seus Pedidos"');
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
      this.userCPF = event.CPFCNPJ

      const date = new Date();
      date.setMonth(date.getMonth() + 1);
      const dia = date.getDate() + '/' + date.getMonth()  + '/' + date.getFullYear();
      console.log(dia);
      const mes = date.getMonth();
      console.log(mes)
      this.valores = this.carrinho.map(res => res.valor);
      this.valorCompra = this.valores.reduce((acc, val) => acc += val, 0);
      this.storage.get('valorFinal').then((data) => {
        var y = Number(data);

// Math.floor(Number(data) + 8) //Math.floor(Number(data) + Number(this.valorDelivery));
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
          endereco: this.endereco + ', '+ this.numeroEND +',' + this.bairro + ', ' + this.cidade +' - CEP:' + this.CEP,          nomeLoja: this.loja.nome,
          valor: Number(this.valor),
          dia,
          mes,
          produtos: this.produtos,
          emailComprador: this.email,
          lojaUID: this.produtos[0].lojaUID,
          emailLoja: this.produtos[0].emailLoja,
          statusPag: 'Débito presencial',
          statusEnt: 'Loja informada',
          telefoneComprador: this.telefoneComprador,
          CPFComprador: this.userCPF,
          compradorUID: this.uid
          
        }).then(() => {
          this.storage.remove('carrinhoUser').then(() => {
            this.navCtrl.navigateRoot('/status');
          });        
        });
      });
    });

  }
  voltar(){
  	this.navCtrl.pop();
  }
  deletaItem(items) {
    console.log(items);
    console.log(this.carrinho);

    _.remove(this.carrinho, n => n.itemNumber === items.itemNumber);
    console.log(this.carrinho);
    this.storage.remove('carrinhoUser').then(() => {
        this.storage.set('carrinhoUser', JSON.stringify(this.carrinho)).then((data) => {
          this.carrinho = JSON.parse(data);
        });
      });
    this.valores = this.carrinho.map(res => res.valor);
    this.valorCompra = this.valores.reduce((acc, val) => acc += val, 0);
    this.storage.remove('valorFinal').then(() => {
        this.storage.set('valorFinal', this.valorCompra).then((data) => {
          this.valor =  data + Number(this.valorDelivery);
          this.valor = this.valor.toFixed(2)
          console.log(this.valor.toFixed(2));
        });
      });
  }
  home() {

    //this.showalert('Atenção', 'Ao sair dessa pagina');
    this.storage.remove('carrinhoUser').then(() => {
      this.navCtrl.navigateRoot('/list');
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
