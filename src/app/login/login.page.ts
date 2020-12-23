import { Component, OnInit, } from '@angular/core';
import {NavController} from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import {AlertController} from '@ionic/angular';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ModalController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import {Storage} from '@ionic/storage';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  errors = [
    {
        "code": "auth/app-deleted",
        "message": "O banco de dados não foi localizado."
    },
    {
        "code": "auth/expired-action-code",
        "message": "O código da ação o ou link expirou."
    },
    {
        "code": "auth/invalid-action-code",
        "message": "O código da ação é inválido. Isso pode acontecer se o código estiver malformado ou já tiver sido usado."
    },
    {
        "code": "auth/user-disabled",
        "message": "O usuário correspondente à credencial fornecida foi desativado."
    },
    {
        "code": "auth/user-not-found",
        "message": "O usuário não correponde à nenhuma credencial."
    },
    {
        "code": "auth/weak-password",
        "message": "A senha é muito fraca."
    },
    {
        "code": "auth/email-already-in-use",
        "message": "Já existi uma conta com o endereço de email fornecido."
    },
    {
        "code": "auth/invalid-email",
        "message": "O endereço de e-mail não é válido."
    },
    {
        "code": "auth/operation-not-allowed",
        "message": "O tipo de conta correspondente à esta credencial ainda não encontra-se ativada."
    },
    {
        "code": "auth/account-exists-with-different-credential",
        "message": "E-mail já associado a outra conta."
    },
    {
        "code": "auth/auth-domain-config-required",
        "message": "A configuração para autenticação não foi fornecida."
    },
    {
        "code": "auth/credential-already-in-use",
        "message": "Já existe uma conta para esta credencial."
    },
    {
        "code": "auth/operation-not-supported-in-this-environment",
        "message": "Esta operação não é suportada no ambiente que está sendo executada. Verifique se deve ser http ou https."
    },
    {
        "code": "auth/timeout",
        "message": "Excedido o tempo de resposta. O domínio pode não estar autorizado para realizar operações."
    },
    {
        "code": "auth/missing-android-pkg-name",
        "message": "Deve ser fornecido um nome de pacote para instalação do aplicativo Android."
    },
    {
        "code": "auth/missing-continue-uri",
        "message": "A próxima URL deve ser fornecida na solicitação."
    },
    {
        "code": "auth/missing-ios-bundle-id",
        "message": "Deve ser fornecido um nome de pacote para instalação do aplicativo iOS."
    },
    {
        "code": "auth/invalid-continue-uri",
        "message": "A próxima URL fornecida na solicitação é inválida."
    },
    {
        "code": "auth/unauthorized-continue-uri",
        "message": "O domínio da próxima URL não está na lista de autorizações."
    },
    {
        "code": "auth/invalid-dynamic-link-domain",
        "message": "O domínio de link dinâmico fornecido não está autorizado ou configurado no projeto atual."
    },
    {
        "code": "auth/argument-error",
        "message": "Verifique a configuração de link para o aplicativo."
    },
    {
        "code": "auth/invalid-persistence-type",
        "message": "O tipo especificado para a persistência dos dados é inválido."
    },
    {
        "code": "auth/unsupported-persistence-type",
        "message": "O ambiente atual não suportar o tipo especificado para persistência dos dados."
    },
    {
        "code": "auth/invalid-credential",
        "message": "A credencial expirou ou está mal formada."
    },
    {
        "code": "auth/wrong-password",
        "message": "Senha incorreta."
    },
    {
        "code": "auth/invalid-verification-code",
        "message": "O código de verificação da credencial não é válido."
    },
    {
        "code": "auth/invalid-verification-id",
        "message": "O ID de verificação da credencial não é válido."
    },
    {
        "code": "auth/custom-token-mismatch",
        "message": "O token está diferente do padrão solicitado."
    },
    {
        "code": "auth/invalid-custom-token",
        "message": "O token fornecido não é válido."
    },
    {
        "code": "auth/captcha-check-failed",
        "message": "O token de resposta do reCAPTCHA não é válido expirou ou o domínio não é permitido."
    },
    {
        "code": "auth/invalid-phone-number",
        "message": "O número de telefone está em um formato inválido (padrão E.164)."
    },
    {
        "code": "auth/missing-phone-number",
        "message": "O número de telefone é requerido."
    },
    {
        "code": "auth/quota-exceeded",
        "message": "A cota de SMS foi excedida."
    },
    {
        "code": "auth/cancelled-popup-request",
        "message": "Somente uma solicitação de janela pop-up é permitida de uma só vez."
    },
    {
        "code": "auth/popup-blocked",
        "message": "A janela pop-up foi bloqueado pelo navegador."
    },
    {
        "code": "auth/popup-closed-by-user",
        "message": "A janela pop-up foi fechada pelo usuário sem concluir o login no provedor."
    },
    {
        "code": "auth/unauthorized-domain",
        "message": "O domínio do aplicativo não está autorizado para realizar operações."
    },
    {
        "code": "auth/invalid-user-token",
        "message": "O usuário atual não foi identificado."
    },
    {
        "code": "auth/user-token-expired",
        "message": "O token do usuário atual expirou."
    },
    {
        "code": "auth/null-user",
        "message": "O usuário atual é nulo."
    },
    {
        "code": "auth/app-not-authorized",
        "message": "Aplicação não autorizada para autenticar com a chave informada."
    },
    {
        "code": "auth/invalid-api-key",
        "message": "A chave da API fornecida é inválida."
    },
    {
        "code": "auth/network-request-failed",
        "message": "Falha de conexão com a rede."
    },
    {
        "code": "auth/requires-recent-login",
        "message": "O último horário de acesso do usuário não atende ao limite de segurança."
    },
    {
        "code": "auth/too-many-requests",
        "message": "As solicitações foram bloqueadas devido a atividades incomuns. Tente novamente depois que algum tempo."
    },
    {
        "code": "auth/web-storage-unsupported",
        "message": "O navegador não suporta armazenamento ou se o usuário desativou este recurso."
    },
    {
        "code": "auth/invalid-claims",
        "message": "Os atributos de cadastro personalizado são inválidos."
    },
    {
        "code": "auth/claims-too-large",
        "message": "O tamanho da requisição excede o tamanho máximo permitido de 1 Megabyte."
    },
    {
        "code": "auth/id-token-expired",
        "message": "O token informado expirou."
    },
    {
        "code": "auth/id-token-revoked",
        "message": "O token informado perdeu a validade."
    },
    {
        "code": "auth/invalid-argument",
        "message": "Um argumento inválido foi fornecido a um método."
    },
    {
        "code": "auth/invalid-creation-time",
        "message": "O horário da criação precisa ser uma data UTC válida."
    },
    {
        "code": "auth/invalid-disabled-field",
        "message": "A propriedade para usuário desabilitado é inválida."
    },
    {
        "code": "auth/invalid-display-name",
        "message": "O nome do usuário é inválido."
    },
    {
        "code": "auth/invalid-email-verified",
        "message": "O e-mail é inválido."
    },
    {
        "code": "auth/invalid-hash-algorithm",
        "message": "O algoritmo de HASH não é uma criptografia compatível."
    },
    {
        "code": "auth/invalid-hash-block-size",
        "message": "O tamanho do bloco de HASH não é válido."
    },
    {
        "code": "auth/invalid-hash-derived-key-length",
        "message": "O tamanho da chave derivada do HASH não é válido."
    },
    {
        "code": "auth/invalid-hash-key",
        "message": "A chave de HASH precisa ter um buffer de byte válido."
    },
    {
        "code": "auth/invalid-hash-memory-cost",
        "message": "O custo da memória HASH não é válido."
    },
    {
        "code": "auth/invalid-hash-parallelization",
        "message": "O carregamento em paralelo do HASH não é válido."
    },
    {
        "code": "auth/invalid-hash-rounds",
        "message": "O arredondamento de HASH não é válido."
    },
    {
        "code": "auth/invalid-hash-salt-separator",
        "message": "O campo do separador de SALT do algoritmo de geração de HASH precisa ser um buffer de byte válido."
    },
    {
        "code": "auth/invalid-id-token",
        "message": "O código do token informado não é válido."
    },
    {
        "code": "auth/invalid-last-sign-in-time",
        "message": "O último horário de login precisa ser uma data UTC válida."
    },
    {
        "code": "auth/invalid-page-token",
        "message": "A próxima URL fornecida na solicitação é inválida."
    },
    {
        "code": "auth/invalid-password",
        "message": "A senha é inválida precisa ter pelo menos 6 caracteres."
    },
    {
        "code": "auth/invalid-password-hash",
        "message": "O HASH da senha não é válida."
    },
    {
        "code": "auth/invalid-password-salt",
        "message": "O SALT da senha não é válido."
    },
    {
        "code": "auth/invalid-photo-url",
        "message": "A URL da foto de usuário é inválido."
    },
    {
        "code": "auth/invalid-provider-id",
        "message": "O identificador de provedor não é compatível."
    },
    {
        "code": "auth/invalid-session-cookie-duration",
        "message": "A duração do COOKIE da sessão precisa ser um número válido em milissegundos entre 5 minutos e 2 semanas."
    },
    {
        "code": "auth/invalid-uid",
        "message": "O identificador fornecido deve ter no máximo 128 caracteres."
    },
    {
        "code": "auth/invalid-user-import",
        "message": "O registro do usuário a ser importado não é válido."
    },
    {
        "code": "auth/invalid-provider-data",
        "message": "O provedor de dados não é válido."
    },
    {
        "code": "auth/maximum-user-count-exceeded",
        "message": "O número máximo permitido de usuários a serem importados foi excedido."
    },
    {
        "code": "auth/missing-hash-algorithm",
        "message": "É necessário fornecer o algoritmo de geração de HASH e seus parâmetros para importar usuários."
    },
    {
        "code": "auth/missing-uid",
        "message": "Um identificador é necessário para a operação atual."
    },
    {
        "code": "auth/reserved-claims",
        "message": "Uma ou mais propriedades personalizadas fornecidas usaram palavras reservadas."
    },
    {
        "code": "auth/session-cookie-revoked",
        "message": "O COOKIE da sessão perdeu a validade."
    },
    {
        "code": "auth/uid-alread-exists",
        "message": "O indentificador fornecido já está em uso."
    },
    {
        "code": "auth/email-already-exists",
        "message": "O e-mail fornecido já está em uso."
    },
    {
        "code": "auth/phone-number-already-exists",
        "message": "O telefone fornecido já está em uso."
    },
    {
        "code": "auth/project-not-found",
        "message": "Nenhum projeto foi encontrado."
    },
    {
        "code": "auth/insufficient-permission",
        "message": "A credencial utilizada não tem permissão para acessar o recurso solicitado."
    },
    {
        "code": "auth/internal-error",
        "message": "O servidor de autenticação encontrou um erro inesperado ao tentar processar a solicitação."
    }
]
  email = '';
  password = '';
  paypalConfig
  valor = '';
  mainuser: AngularFirestoreDocument;
  userID
  sub;
  usuarior
  FCM
  constructor(public navCtrl: NavController, private storage: Storage,public loadingController: LoadingController,
              public router: Router, public alertCtrl: AlertController, public afAuth: AngularFireAuth,
              public services: ServiceService,private push:Push, public modalController: ModalController,public afStore: AngularFirestore) {
        const user = firebase.auth().currentUser;
    console.log(user);
    if (user) {
            this.mainuser = this.afStore.doc(`users/${user.uid}`);
            this.userID = user.uid
              //this.showalert('Bem-vindo de volta!', 'Vamos macumbar!');
              this.mainuser.valueChanges().subscribe(event => {
                  console.log(event)
                  this.storage.set('usuario', event)

                })
               this.navCtrl.navigateRoot('/list');
              //console.log(this.userID)
              //this.navCtrl.navigateRoot('/tabs/tab1')
      } else {
          console.log('No user')
      }

  } 


  ngOnInit(){
        this.iniciarPush();
            
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


async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Aguarde...',
      duration: 3000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }
 
  registrar() {

  	this.navCtrl.navigateForward('/register');
  	console.log('Fine');
   // saudade do meu amor
  }
  entrega(){
    this.navCtrl.navigateForward('/entregar')
  }
 async entrar() {
    const{email, password } = this;
      this.presentLoading() 

    try {
      const res = await this.afAuth.signInWithEmailAndPassword(email, password);
      if (res.user) {
         const user = firebase.auth().currentUser;
         this.mainuser = this.afStore.doc(`users/${user.uid}`);
         this.userID = user.uid

         this.mainuser.valueChanges().subscribe(event => {
            console.log(event)
            if(this.FCM === undefined){
              this.FCM === event.fcm
            }else{
              this.services.updateFCM(this.userID, this.FCM)

            }
            this.storage.set('usuario', event).then(() =>{
              //this.showalert('Bem-vindo de volta!', 'Vamos as compras!?');
              this.navCtrl.navigateRoot('/list');
               
            })
                  
         })
             

      }

    } catch(e){
      console.dir(e)
      var erro = this.errors.filter(i => i.code === e.code)
      console.log(erro[0].message)
      if(erro.length > 0){
        this.showalert('Ops!',erro[0].message )

      }else{
        this.showalert('Ops!',e )
      }

    }
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
    this.navCtrl.pop()
  }
  senhaEsquecida(){
    console.log(this.email)
    if(this.email){
      console.log(this.email)
      var auth = firebase.auth()
      var emailAddress = this.email;
      auth.sendPasswordResetEmail(emailAddress).then((res)=>{
        console.log(res)
        this.showalert('Tudo certo!', 'Corre no seu email agora para resetar a senha!')
      })
    }else{
      this.showalert('Opa!','Digite por favor o seu email no campo "Email" e clique em "Esqueceu a senha?" novamente.')
    }

  }
  
}
