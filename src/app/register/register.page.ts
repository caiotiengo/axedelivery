import { Component, OnInit } from '@angular/core';
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
    private cadastro : FormGroup;
    mainuser: AngularFirestoreDocument;
    userID
    sub;
    FCM
    public donwloadUrl: Observable<string>;
    public uploadPercent: Observable<number>;
    photos: Array<Foto> = [];

  constructor(public navCtrl: NavController, private storage: Storage,public loadingController: LoadingController,
              public afAuth: AngularFireAuth, private geolocation: Geolocation, public router: Router, public actRouter: ActivatedRoute,
              public services: ServiceService, public afStore: AngularFirestore, public alertCtrl: AlertController,
              private modalController: ModalController,private http: HttpClient,private afStorage: AngularFireStorage,
              private mediaCapture: MediaCapture,private platform: Platform,private camera: Camera,
              private file: File,private push:Push,
              private media: Media, private formBuilder: FormBuilder) {
             if(this.typeUser === 'Loja'){
                this.cadastro = this.formBuilder.group({
                  resumo: [''],
                  nome: ['', Validators.required],
                  endereco: ['', Validators.required],
                  telefone: ['', Validators.required],
                  bairro: ['', Validators.required],
                  cidade: [''],
                  estado: [''],
                  email: ['', Validators.required],
                  password: ['', Validators.required],
                  CEP: ['', Validators.required],
                  DOB: [''],
                  complemento:['', Validators.required],
                  banco:['', Validators.required],
                  CPF: ['', Validators.required],
                  agencia: ['', Validators.required],
                  nomeNaConta: ['', Validators.required],
                  conta: ['', Validators.required],                  
                  numeroEND: ['', Validators.required],
                  correnteoupou:['',Validators.required],
                  CPFconta:['', Validators.required],
                  ddd:['', Validators.required],
                  entregaDe:[''],
                  seNEntrega:['']

                });
             }else{
                this.cadastro = this.formBuilder.group({
                  resumo: [''],
                  nome: ['', Validators.required],
                  endereco: ['', Validators.required],
                  telefone: ['', Validators.required],
                  bairro: ['', Validators.required],
                  cidade: [''],
                  estado: [''],
                  email: ['', Validators.required],
                  password: ['', Validators.required],
                  CEP: ['', Validators.required],
                  DOB: [''],
                  complemento:['', Validators.required],
                  banco:[''],
                  CPF: ['', Validators.required],
                  agencia: [''],
                  nomeNaConta: [''],
                  conta: [''],                  
                  numeroEND: ['', Validators.required],
                  correnteoupou:[''],
                  CPFconta:[''],
                  ddd:['', Validators.required],
                  entregaDe:[''],
                  seNEntrega:['']

            });
             }
            
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

  }

  ngOnInit() {
    this.iniciarPush();
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

    if(this.cadastro.valid){
     return new Promise(resolve => {
            this.http.get<any[]>('https://nominatim.openstreetmap.org/search?q='+this.cadastro.value.endereco+','+
              this.cadastro.value.bairro+','+
               this.cadastro.value.numeroEND+','+ this.cadastro.value.cidade+','+ this.cadastro.value.estado +'&format=json').subscribe(data => {
                      resolve(data);
                      console.log(data.length);
                      if (data.length === 0){
                       this.showalert('Hm...', 'Parece que não encontramos seu endereço. Já tentou sem abreviações?')
                      }else{
                        this.datou = data[0].lat;

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
            lat: data[0].lat,
            lng: data[0].lon,
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
            fcm: this.FCM,
            FotoPerfil: String(this.url)
       }).then(() => {
          const user = firebase.auth().currentUser;

         this.mainuser = this.afStore.doc(`users/${user.uid}`);
         this.userID = user.uid

         this.sub = this.mainuser.valueChanges().subscribe(event => {
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
                       //Av. Ten-Cel. Muniz de Aragão 
                      }
                      
                  }, err => {
                   console.log(err);
          });
      });

  
  }else{
    this.showalert('Hm...', 'Preencha todos os campos!'+ this.cadastro.valid)
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
  		this.navCtrl.pop();
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
private iniciarPush(){
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
      console.log('Device registered', registration)
/*  this.afStore.collection('devices').add({
       idDevice: registration[0].registrationId,

    });
*/
} );
pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));



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
  testaCNPJ(event) {
    // Verifica se a variável cnpj é igua a "undefined", exibindo uma msg de erro
    if (this.cnpj === undefined) {
      this.cnpjAlert();
      return false;
    }

    // Esta função retira os caracteres . / - da string do cnpj, deixando apenas os números 
    var strCNPJ = this.cnpj.replace('.', '').replace('.', '').replace('/', '').replace('-', '');

    // Testa as sequencias que possuem todos os dígitos iguais e se o cnpj não tem 14 dígitos, retonando falso e exibindo uma msg de erro
    if (strCNPJ === '00000000000000' || strCNPJ === '11111111111111' || strCNPJ === '22222222222222' || strCNPJ === '33333333333333' ||
      strCNPJ === '44444444444444' || strCNPJ === '55555555555555' || strCNPJ === '66666666666666' || strCNPJ === '77777777777777' ||
      strCNPJ === '88888888888888' || strCNPJ === '99999999999999' || strCNPJ.length !== 14) {
      this.cnpjAlert();
      return false;
    }

    // A variável numeros pega o bloco com os números sem o DV, a variavel digitos pega apenas os dois ultimos numeros (Digito Verificador).
    var tamanho = strCNPJ.length - 2;
    var numeros = strCNPJ.substring(0, tamanho);
    var digitos = strCNPJ.substring(tamanho);
    var soma = 0;
    var pos = tamanho - 7;

    // Os quatro blocos seguintes de funções irá reaizar a validação do CNPJ propriamente dito, conferindo se o DV bate. Caso alguma das funções não consiga verificar
    // o DV corretamente, mostrará uma mensagem de erro ao usuário e retornará falso, para que o usário posso digitar novamente um número 
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }

    var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0)) {
      this.cnpjAlert();
      return false;
    }

    tamanho = tamanho + 1;
    numeros = strCNPJ.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let k = tamanho; k >= 1; k--) {
      soma += numeros.charAt(tamanho - k) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1)) {
      this.cnpjAlert();
      return false;
    }

    this.update();
    return true;
  }

  //Caso o CNPJ será valido, irá realizar a gravação do mesmo na variável strCNPJ
  async update() {
    await this.modalController.dismiss(this.strCNPJ);
  }

  //Exibe uma mensagem de alerta ao usuário, caso o número do CNPJ seja inválido
  async cnpjAlert() {
    const alert = await this.alertCtrl.create({
      header: 'CNPJ Inválido!',
      message: 'Digite um número de CNJP válido para prosseguir',
      buttons: ['OK']
    });
    await alert.present();
  }
}
