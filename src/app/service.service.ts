import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//import {Produtos} from './item/item.page';
import * as firebase from 'firebase/app';
import { Platform } from '@ionic/angular';



export interface User {
    nome: string ;
    endereco: string ;
    cidade: string ;
    bairro: string ;
    telefone: string ;
    LikeValue?: number;
    DislikeValue?: number;
    tellme: string;
    email: string;
    type?: string;
    resumo?: string;
    lastEdit?: string;
    comments?:any;
    CEP?:any;
    CPFconta?:any
    numeroEND?:any;
    pontoREF?:any
    estado?:any
    lat?:any
    lng?:any
    banco?:any
    agencia?:any
    conta?:any
    correnteoupou?:any
    nomeNaConta?:any
    fcm?:any
    zona?:any
}
export interface Processo {
    // tslint:disable-next-line:indent
    nome?: string;
    LikeValue?: number;
    DislikeValue?: number;
    valor?: string;
    email?: string;
    type?: string;
    resumo?: string;
    lastEdit?: string;
}
export interface Vendas {
    nomeComprador?: string;
    endereco?: string;
    nomeLoja?: string;
    valor?: number;
    dia?: string;
    emailComprador?: string;
    produtos?: string;
    statusPag?: string;
    statusEnt?: string;
    emailLoja?:string;
    lojaUID?:any;
    nPedido?:Number;
    mensagens?:any;
}
export interface Comentario{
        comments?: string;
        loja?: string;
        lojaUID?: any;
        emailLoja?: string;
        nomeComprador?: any;
        nPedido?:Number;

}

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  LikeValue: number;
  DislikeValue: number;
  private userCollection: AngularFirestoreCollection<User>;
  private processoCollection: AngularFirestoreCollection<Processo>;
  public vendasCollection: AngularFirestoreCollection<Vendas>;
  public commentsCollection: AngularFirestoreCollection<Comentario>;

  users: Observable<User[]>;
  processos: Observable<Processo[]>;
  vendas: Observable<Vendas[]>;
  comentario: Observable<Comentario[]>;

  private user: User;
    likes: number;
    dislikes: number;
    proccesso;
    arrey: Array<Comentario> = [];

  constructor(private afs: AngularFirestore, public platform: Platform) {

      // tslint:disable-next-line:indent
  	 this.userCollection = afs.collection<User>('users');
  	 // this.users = this.userCollection.valueChanges();

    this.processoCollection = afs.collection<Processo>('produto');
  	 // this.processos = this.processoCollection.valueChanges();
    this.vendasCollection = afs.collection<Vendas>('vendas');
    this.commentsCollection = afs.collection<Comentario>('comments');

    this.getUsers();
      // tslint:disable-next-line:indent
    this.getProccessos();
    this.getVendas();


  }
  getUsers() {
     return this.users = this.userCollection.snapshotChanges().pipe(
          map(actions => actions.map(a => {
              const data = a.payload.doc.data() as User;
              const id = a.payload.doc.id;
              return { id, ...data };
          }))

      );
  }
  getProccessos() {
   return this.processos = this.processoCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Processo;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
   getComments() {
   return this.comentario = this.commentsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Comentario;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
    getVendas() {
        return this.vendas = this.vendasCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Vendas;
                const id = a.payload.doc.id;
                console.log('nova venda!')
                return { id, ...data };
            }))
        );
    }

 /* async getToken(){
    let token;

    if(this.platform.is('android')){
      token = await this.firebaseNative.getToken().then(token => console.log('PUSH_TOKEN: GET_TOKEN: ', token)).catch(err => console.log(err));
    }
    if(this.platform.is('ios')){
      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission().then(hasPermission => console.log(hasPermission ? 'granted' : 'denied'));;
    }
    if(this.platform.is('pwa')){
      token = this.firebaseNative.getToken().then(token => console.log('PUSH_TOKEN: GET_TOKEN: ', token))
.catch(err => console.log(err))
    }
    return this.saveToFirestore(token)
  }

  saveToFirestore(token){
    //if(!token) {return}
    //const {uid} = firebase.auth().currentUser;

    const devicesRef = this.afs.collection('devices')
    const data = {
      token,
      userId: 'Caio'

    }
    return devicesRef.doc(token).set(data)
  }

  listenToNotifications(){
    return this.firebaseNative.onMessageReceived()
  }*/
addUser(user: User) {
    this.userCollection.add(user);
  }
  addProc(processo: Processo) {
    this.processoCollection.add(processo);
  }
  update(id: string, user: User) {
    this.userCollection.doc<User>(id).update(user);
  }
  getEmail() {
  	return this.user.email;
  }
  getProc(id: string) {
    return this.userCollection.doc<User>(id).valueChanges();
  }
  getStatusProd(id: string) {
    return this.vendasCollection.doc<Vendas>(id).valueChanges();
  }
  getProdutos(id: string) {
    return this.processoCollection.doc<Processo>(id).valueChanges();
  }
 getLikes(id: string) {
    return this.userCollection.doc<User>(id).valueChanges().subscribe((data) => {
      this.likes = data.LikeValue;
      this.dislikes = data.DislikeValue;
      console.log(this.likes);
    });
 }

  like(id: string , loja: Processo) {
      this.likes++;
      return this.userCollection.doc<User>(id).update({LikeValue: Number(this.likes)});

  }
   comment(id: string) {
      return this.commentsCollection.doc<Comentario>(id).valueChanges();
 }
  
  dislike(id: string, loja: Processo) {
    this.dislikes++;
    return this.userCollection.doc<User>(id).update({DislikeValue: Number(this.dislikes)});
  }
  deletarItem(id){
      return this.processoCollection.doc<Processo>(id).delete();
  }
updateEnd(id: string, tipo:string, end: string, cep:string, bairro:string, numero:string, cidade:string, estado:string, lat:string,lng:string) {
    this.userCollection.doc<User>(id).update({endereco: end,zona:tipo,
                                              CEP:cep,
                                              bairro:bairro,
                                              numeroEND: numero,           
                                              cidade: cidade,
                                              estado: estado,
                                              lat:lat,
                                              lng:lng  });
  }
  updateBanco(id:string,banco:string, agencia:string,conta:string,correnteoupou:string, nomeNaConta:string, CPFconta:string) {
    this.userCollection.doc<User>(id).update({
      banco:banco,
      agencia:agencia,
      conta:conta,
      correnteoupou:correnteoupou,
      nomeNaConta:nomeNaConta,
      CPFconta: CPFconta
    });
  }
    updateFCM(id:string,FCM:string) {
    this.userCollection.doc<User>(id).update({fcm: FCM});
  }
  updateChat(id:string,conteudo:string){
      const {uid} = firebase.auth().currentUser;
      const data = {
         uid,
         id,
         conteudo,
         criadoEm: Date.now()
     }
      this.vendasCollection.doc<Vendas>(id).update({mensagens: firebase.firestore.FieldValue.arrayUnion(data)})  
  }

/*


.nomeNaConta}}</p>
      <p>{{loja.banco}}</p>
      <p>{{loja.agencia}}</p>
      <p>{{loja.conta}}</p>
      <p>{{loja.correnteoupou}}
 addProduct(product: Product) {
    return this.productsCollection.add(product);
  }

  getProduct(id: string) {
    return this.productsCollection.doc<Product>(id).valueChanges();
  }



  deleteProduct(id: string) {
    return this.productsCollection.doc(id).delete();
  }

*/

}
