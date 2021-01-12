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
import { ServiceService } from '../service.service';

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
  especi?:any;
  fotos?:any;
  product?:any;
  quantity?:number;
  valorReal?:any;
  priceReal?:any;
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
  carrinhoDes: Array<Produtos> = [];
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
  value
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
    parcelamento =''
    moip2: any;
    porcentagemAxeDIN
    cupom =''
    esconde = false
    descontin
    porcentagemDes
    cuponNome
    cuponzada
  constructor(public afStore: AngularFirestore,
              public loadingController: LoadingController,
              public navCtrl: NavController,
              private _haversineService: HaversineService, 
              public alertCtrl: AlertController, 
              private storage: Storage, public services: ServiceService){

                const user = firebase.auth().currentUser;
                this.uid = user.uid;
                console.log(this.uid)            
                this.cuponNome = 'Sem cupom'


     this.storage.get('valorFrete').then((data) => {
      this.valorDelivery =  data;
      var y = this.valorDelivery.replace('.','') 
      this.valorFrete = Number(y)
      console.log(this.valorFrete);
    });
    this.storage.get('carrinhoUser').then((data) => {
      this.carrinho =  JSON.parse(data);
      this.carrinho.forEach(element => {
        this.carrinhoDes.push(element)
        var y = this.carrinhoDes.map(i => i.valor);
        var result = y.reduce((acc, val) => acc += val);
        console.log(result);
        var resposta = Number(result) + Number(this.valorDelivery);
        this.valor = Number(resposta.toFixed(2))

        this.services.getProc(this.carrinhoDes[0].lojaUID).subscribe(res =>{
          this.loja = res
          console.log(this.loja)
        })
      });
      console.log(this.carrinhoDes);
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
      this.cuponzada = event.cupons;
    });

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

    
     /* 
   this.pubKey = `-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAodkPNhEFaP90CU2z6zKZ
    kyPb98kI3NA4C/j9lJnzUNsqgPzfx0xdHxk0rvQvqH/shJIm76EXGBtsWuUjyO8n
    UMrq9l/8lWPY5OsOmpHiiBZ7oLjfPN1tSs3CgNMqMyWay8F82zowXOdwZk4hY+aa
    mkkZcg8Sou3Wo7pIcInNXy9cLClp+qhrTR9LlrMcxT7oMDwxw8CFzX7SK9EEnBz0
    H5T1BRSXVd3VXjC75I1w6RFk9AzbDfSKgj2b6Ladf0PKm4XdruiA+C7Gad8mg7Wu
    ZBBwoPkwFHnKFtCs+P84OqNjAyEqxOc3oGgCi6LkFRWL43DfFPcPj6QkOMZM64WO
    DQIDAQAB
    -----END PUBLIC KEY-----`
    
    */ 
    
  this.moip = moipSdk({
  /*  
    token: 'C5LQHXVYGJLN0XYSTRZCQY6LRQZVV6AR',
    key: 'LNRERY9ULDQSPBXYR2BTJLNKRKLWTPEIUKAV9E1Z',
    production: false
         //idmoip account "MPA-CC3641B4B904"
    
*/
    accessToken: '292bed0bd3244409b835986edca4119f_v2',
    secret:'cf87986f39c342caa5d9a49c6c166a2a',
    key: 'Y4UDSTTB0JSJC6UPCQPGLMGPHQT7MEHCDM1FERDI',
    channelId:"APP-16HIIBI5HPS8",
    production: true,
   "Accept" : "*/*" 
   
    //token: 'Z9KP0SCKJ2UZGWSGYXUJCZOU0BVMB1QN',
    //id moip account prod "MPA-888C5307676A"

  })
  console.log(this.moip);

  setTimeout(() => {

  
    console.log(this.loja.accessToken)
    this.moip2 = moipSdk({
      accessToken: this.loja.accessToken,

      production: true,
      //"Accept" : "*/*"
    })
  }, 2000);
  }
  ngOnInit() {

  }
  cupo(){
      var y = this.cuponzada.filter(i => i.cupom === this.cupom)
      console.log(y)
      if(y.length === 0 ){
        this.services.getCupom().subscribe((data) =>{
          var x = data.filter(i => i.cupom === this.cupom)
          if(x.length != 0){
            console.log(x)
            alert('Não é uma oferenda, mas o cupom foi aceito com sucesso!')
            this.cuponNome = x[0].cupom
            this.porcentagemDes = x[0].desconto
            console.log(this.porcentagemDes)
            var mapa = this.carrinho.map(i => i.price * Number(i.quantity))
            console.log(mapa)
    
            var calculo =  mapa.reduce((acc, val) => acc += val);
            console.log(calculo)
    
            var percentage = x[0].desconto
            console.log(percentage)
    
            var valor = (percentage / 100) * calculo;
            console.log(valor)
    
            var mapaQTD = this.carrinho.map(i => Number(i.quantity))
            console.log(mapaQTD)
    
            var qtd = mapaQTD.reduce((acc, val) => acc += val);
            console.log(qtd)
    
            //valor do desconto para ficar aparente
            var mapa2 = this.carrinho.map(i => i.valor)
            console.log(mapa2)
    
            var calculo2 =  mapa2.reduce((acc, val) => acc += val);
            console.log(calculo2)
    
            var valor2 = (percentage / 100) * calculo2;
            console.log(valor2)
            
            var calculodesconto2 = calculo2 - valor2 + Number(this.valorDelivery)
            console.log(calculodesconto2.toFixed(2));
            this.valor = Number(calculodesconto2.toFixed(2))
            // calculo da
            var valorFinal = valor / qtd
            console.log(valorFinal.toFixed(0))
            this.carrinhoDes = [];
            this.carrinho.forEach(e => {
              var quantidade = e.quantity
              var valor = Number(valorFinal.toFixed(0)) * Number(quantidade)
              var valorx = valor / quantidade
              console.log(valorx)
              this.descontin = e.price - valorx
              console.log(this.descontin)
              this.carrinhoDes.push({
                email: this.email,
                emailLoja: this.loja.email,
                especi: e.especi,
                fotos: e.fotos,
                itemNumber: e.itemNumber,
                lojaUID: e.lojaUID,
                nome: e.nome,
                price: Number(e.price) - Number(valorx),
                product: e.product,
                quantity: e.quantity,
                valor: Number(this.valor),
                valorReal:e.valorReal
              })
    
            });
            console.log(this.carrinhoDes)
            console.log(this.carrinho)
            this.esconde = true;
            
    
          }else{
            console.log(x)
            this.cuponNome = 'Sem cupom'
            alert('Cupom inválido!')
    
          }
        })      
      }else{
        alert('Macumba dobrada não vale né? você já usou esse cupom!')
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
            items: this.carrinhoDes,
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
                  percentual: Number(this.loja.porcentagemAxe)
                  }
              },
              {
                moipAccount: {
                    id: this.loja.idmoip
                },
                type: "SECONDARY",
                feePayor: false,
                amount: {
                  percentual: Number(this.loja.porcentagemLoja)
                  }
              }
            ]
        }).then((response) => {
            console.log(response.body)
            this.moip.payment.create(response.body.id, {
            installmentCount: Number(this.parcelamento),
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


                this.storage.get('carrinhoUser').then((data) => {
                  this.produtos =  JSON.parse(data);
                  
                  
                  console.log(this.produtos);
                  var seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
                  console.log(seq);
                  this.services.updateCupom(this.uid, this.cuponNome)

                  this.afStore.collection('vendas').add({
                    nPedido:Number(seq),
                    valorFrete: this.valorDelivery,
                    nomeComprador: this.nome,
                    bairroEnt: this.bairro,
                    entregador:"Não Solicitado",
                    endereco: this.endereco + ', '+ this.numeroEND +', ' + this.complemento +', '+ this.bairro + ', ' + this.cidade +' - CEP:' + this.CEP,
                    nomeLoja: this.loja.nome,
                    valor: Number(this.valor),
                    enderecoLoja:this.loja.endereco+ ', '+ this.loja.numeroEND + ', ' + this.loja.complemento + ', ' + this.loja.bairro+ ', ' + this.loja.cidade+' - CEP:'+ this.CEP,
                    dia,
                    mes,
                    produtos: this.produtos,
                    emailComprador: this.email,
                    lojaUID: this.produtos[0].lojaUID,
                    emailLoja: this.loja.email,
                    statusPag: 'Aprovado',
                    statusEnt: 'Loja informada',
                    telefoneComprador: this.telefoneComprador,
                    CPFComprador: this.userCPF,
                    idPagamento: response.body.id,
                    compradorUID: this.uid,
                    cupom: this.cuponNome
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


              this.storage.get('carrinhoUser').then((data) => {
                this.produtos =  JSON.parse(data);
                
                
                console.log(this.produtos);
                var seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
                console.log(seq);
                this.services.updateCupom(this.uid, this.cuponNome)

                this.afStore.collection('vendas').add({
                  nPedido:Number(seq),
                  valorFrete: this.valorDelivery,
                  nomeComprador: this.nome,
                  bairroEnt: this.bairro,
                  entregador:"Não Solicitado",

                  endereco: this.endereco + ', '+ this.numeroEND + ', ' + this.complemento +', ' + this.bairro + ', ' + this.cidade +' - CEP:' + this.CEP,
                  nomeLoja: this.loja.nome,
                  valor: Number(this.valor),
                  enderecoLoja:this.loja.endereco+ ', '+ this.loja.numeroEND + ', ' + this.loja.complemento + ', ' + this.loja.bairro+ ', ' + this.loja.cidade+' - CEP:'+ this.CEP,
                  dia,
                  mes,
                  produtos: this.produtos,
                  emailComprador: this.email,
                  lojaUID: this.produtos[0].lojaUID,
                  emailLoja: this.loja.email,
                  statusPag: 'Em análise',
                  statusEnt: 'Loja informada',
                  telefoneComprador: this.telefoneComprador,
                  CPFComprador: this.userCPF,
                  idPagamento: response.body.id,
                  compradorUID: this.uid,
                  cupom: this.cuponNome

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


              this.storage.get('carrinhoUser').then((data) => {
                this.produtos =  JSON.parse(data);
                
                
                console.log(this.produtos);
                var seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
                console.log(seq);
                this.services.updateCupom(this.uid, this.cuponNome)

                this.afStore.collection('vendas').add({
                  nPedido:Number(seq),
                  nomeComprador: this.nome,
                  valorFrete: this.valorDelivery,
                  bairroEnt: this.bairro,
                  entregador:"Não Solicitado",
                  endereco: this.endereco + ', '+ this.numeroEND + ', ' + this.complemento +', ' + this.bairro + ', ' + this.cidade +' - CEP:' + this.CEP,
                  nomeLoja: this.loja.nome,
                  valor: Number(this.valor),
                  enderecoLoja:this.loja.endereco+ ', '+ this.loja.numeroEND + ', ' + this.loja.complemento + ', ' + this.loja.bairro+ ', ' + this.loja.cidade+' - CEP:'+ this.CEP,
                  dia,
                  mes,
                  produtos: this.produtos,
                  emailComprador: this.email,
                  lojaUID: this.produtos[0].lojaUID,
                  emailLoja: this.loja.email,
                  statusPag: 'Cancelado pelo banco',
                  statusEnt: 'Cancelado',
                  telefoneComprador: this.telefoneComprador,
                  CPFComprador: this.userCPF,
                  idPagamento: response.body.id,
                  compradorUID: this.uid,
                  cupom: this.cuponNome

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







/* PAGAMENTO EM DINHEIRO */



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

        var porcentagemDinheiro = this.loja.porcentagemAxe - 2
        console.log(porcentagemDinheiro)
        var count = Number(porcentagemDinheiro) * Number(this.valor)
        console.log(count)
        console.log('porcentagem do axé vai ser: ' + count/100)  
        this.porcentagemAxeDIN = Number(count/100).toFixed(2)
        console.log(this.porcentagemAxeDIN)
        var value = String(this.porcentagemAxeDIN).replace('.','')
        console.log(value)
        if(Number(value) < 100){
          var v = '0'+ value
          this.value = v
          console.log(v)
          console.log(this.value)

          this.transferirDin(this.value)
        }else{
          this.value = Number(value)
          console.log(this.value)

          this.transferirDin(this.value.toFixed(0))

        }
    });

  }

  transferirDin(value){
    console.log(value)
    console.log(Number(value))

 
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    const dia = date.getDate() + '/' + date.getMonth()  + '/' + date.getFullYear();
    console.log(dia);
    const mes = date.getMonth();
    console.log(mes)
    this.valores = this.carrinho.map(res => res.valor);
    this.valorCompra = this.valores.reduce((acc, val) => acc += val, 0);

    this.storage.get('carrinhoUser').then((data) => {
      this.produtos =  JSON.parse(data);
      console.log(this.produtos);
      var seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
      console.log(seq);
      this.services.updateCupom(this.uid, this.cuponNome)

      this.afStore.collection('vendas').add({
        nPedido:Number(seq),
        nomeComprador: this.nome,
        valorFrete: this.valorDelivery,
        bairroEnt: this.bairro,
        entregador:"Não Solicitado",
        endereco: this.endereco + ', '+ this.numeroEND + ', ' + this.complemento +', ' + this.bairro + ', ' + this.cidade +' - CEP:' + this.CEP,
        nomeLoja: this.loja.nome,
        valor: Number(this.valor),
        enderecoLoja:this.loja.endereco+ ', '+ this.loja.numeroEND + ', ' + this.loja.complemento + ', ' + this.loja.bairro+ ', ' + this.loja.cidade+' - CEP:'+ this.CEP,
        dia,
        mes,
        produtos: this.produtos,
        emailComprador: this.email,
        lojaUID: this.produtos[0].lojaUID,
        emailLoja: this.loja.email,
        statusPag: 'Em dinheiro',
        statusEnt: 'Loja informada',
        telefoneComprador: this.telefoneComprador,
        CPFComprador: this.userCPF,
        compradorUID: this.uid,
        valorDevedor: Number(value),
        cupom: this.cuponNome


      }).then(() => {
        this.storage.remove('carrinhoUser').then(() => {
          this.navCtrl.navigateRoot('/status');
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
      var porcentagemDinheiro = this.loja.porcentagemAxe - 2
        console.log(porcentagemDinheiro)
        var count = Number(porcentagemDinheiro) * Number(this.valor)
        console.log(count)
        console.log('porcentagem do axé vai ser: ' + count/100)  
        this.porcentagemAxeDIN = Number(count/100).toFixed(2)
        console.log(this.porcentagemAxeDIN)
        var value = String(this.porcentagemAxeDIN).replace('.','')
        console.log(value)
        if(Number(value) < 100){
          var v = '0'+ value
          this.value = v
          console.log(v)
          console.log(this.value)

          this.transferirDeb(this.value)
        }else{
          this.value = Number(value)
          console.log(this.value)

          this.transferirDeb(this.value)

        }

    });

  }

  transferirDeb(value){
    console.log(value)
    console.log(Number(value))
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    const dia = date.getDate() + '/' + date.getMonth()  + '/' + date.getFullYear();
    console.log(dia);
    const mes = date.getMonth();
    console.log(mes)
    this.valores = this.carrinho.map(res => res.valor);
    this.valorCompra = this.valores.reduce((acc, val) => acc += val, 0);

    this.storage.get('carrinhoUser').then((data) => {
      this.produtos =  JSON.parse(data);

      console.log(this.produtos);
      var seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
      console.log(seq);
      this.services.updateCupom(this.uid, this.cuponNome)

      this.afStore.collection('vendas').add({
        nPedido:Number(seq),
        nomeComprador: this.nome,
        valorFrete: this.valorDelivery,
        bairroEnt: this.bairro,
        entregador:"Não Solicitado",
        endereco: this.endereco + ', '+ this.numeroEND + ', ' + this.complemento +', ' + this.bairro + ', ' + this.cidade +' - CEP:' + this.CEP,      
        nomeLoja: this.loja.nome,
        valor: Number(this.valor),
        enderecoLoja:this.loja.endereco+ ', '+ this.loja.numeroEND + ', ' + this.loja.complemento + ', ' + this.loja.bairro+ ', ' + this.loja.cidade+' - CEP:'+ this.CEP,
        dia,
        mes,
        produtos: this.produtos,
        emailComprador: this.email,
        lojaUID: this.produtos[0].lojaUID,
        emailLoja: this.loja.email,
        statusPag: 'Débito presencial',
        statusEnt: 'Loja informada',
        telefoneComprador: this.telefoneComprador,
        CPFComprador: this.userCPF,
        compradorUID: this.uid,
        valorDevedor: Number(value),
        cupom: this.cuponNome

        
      }).then(() => {
        this.storage.remove('carrinhoUser').then(() => {
          this.navCtrl.navigateRoot('/status');
        });        
      });
    });
  }
  voltar(){
    this.storage.remove('carrinhoUser').then(() =>{
      this.storage.set('carrinhoUser', this.carrinhoDes).then(() =>{
        this.navCtrl.pop();

      })
    })
  }
  adicionarQTD(index:number){
    console.log(index)
    this.carrinhoDes[index].quantity += 1;
    console.log(this.carrinhoDes[index])
    //var result = this.carrinhoDes[index].price * this.carrinhoDes[index].quantity; 
    //this.valor = result
    var resultString = this.carrinhoDes[index].valorReal * this.carrinhoDes[index].quantity 
    this.carrinhoDes[index].valor = Number(resultString)
    var y = this.carrinhoDes.map(i => Number(i.valor));
    var result = y.reduce((acc, val) => acc += val);
    console.log(result);
    var z = Number(result) + Number(this.valorDelivery);
    this.valor = z.toFixed(2)
  }
  retirarQTD(index:number){
    console.log(index)
    this.carrinhoDes[index].quantity -= 1;
    console.log(this.carrinhoDes[index])
    //var result = this.carrinhoDes[index].price * this.carrinhoDes[index].quantity; 
    var resultString = this.carrinhoDes[index].valorReal * this.carrinhoDes[index].quantity;
    this.carrinhoDes[index].valor = Number(resultString)
    var y = this.carrinhoDes.map(i => Number(i.valor));
    var result = y.reduce((acc, val) => acc += val);
    console.log(result);
    var z = Number(result) + Number(this.valorDelivery);
    this.valor = z.toFixed(2)
    if(this.carrinhoDes[index].quantity === 0 ){
      alert('O item será retirado do seu carrinho!')
      this.carrinhoDes.splice(index, 1)
      this.produtos.splice(index,1)
      console.log(this.carrinhoDes)
      this.storage.remove('carrinhoUser').then(() =>{
        this.storage.set('carrinhoUser', this.carrinhoDes)
      })
    }else{
    }
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
