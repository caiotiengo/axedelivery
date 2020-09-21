import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import {AlertController} from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import {ServiceService} from '../service.service';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Platform } from '@ionic/angular';
import {Observable} from 'rxjs'
import {
  MediaCapture,
  MediaFile,
  CaptureError
} from '@ionic-native/media-capture/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import {finalize} from 'rxjs/operators';
export interface Foto {
    fotoN: string;
    link?: any;
}
@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  qtd ;
  nomePrd ;
  email = '';
  tellme ;
  valor: number;
  nomeLoja = '';
  LikeValue: number;
  DislikeValue: number;
  autor: string;
  type;
  resumo ;
  mainuser;
  sub;
  name;
  nome = '';
  boss;
  procUser: any ;
  que;
  url
  public donwloadUrl: Observable<string>;
  public uploadPercent: Observable<number>;
  private formulario : FormGroup;
  photos: Array<Foto> = [];
  

  constructor(public navCtrl: NavController, public afStore: AngularFirestore,
    public alertCtrl: AlertController,
    public services: ServiceService,
    private platform: Platform, private route: ActivatedRoute, private camera: Camera,
    private formBuilder: FormBuilder, private afStorage: AngularFireStorage,
    private mediaCapture: MediaCapture,
    private file: File,
    private media: Media) {
  // this.procUser = this.services.getProc(this.que);
  const user = firebase.auth().currentUser;
  console.log(user.email);
  if (user) {
    this.mainuser = this.afStore.doc(`users/${user.uid}`);

  } else {
    // No user is signed in.
  }
  this.sub = this.mainuser.valueChanges().subscribe(event => {
    this.email = event.email;
    this.nome = event.nome;
    //this.boss = event.boss;
  });

  this.que = this.route.snapshot.paramMap.get('id');

  console.log(this.que);
  this.procUser = this.services.getProdutos(this.que);
  //this.comments = this.services.comment(this.que);
  console.log(this.services.getProdutos(this.que));
  if (this.que) {
    this.procUser.subscribe(event =>{
      console.log(event)
      this.nomePrd = event.nomePrd;
      this.valor = event.valor;
      this.type = event.tipoPrd;
      this.qtd = event.qtd;
      this.resumo = event.resumo
    })
        //this.loadProduct();
        //this.loadComments();
    }
  console.log(this.services.getLikes(this.que));

  
  this.formulario = this.formBuilder.group({
    valor: ['', Validators.required],
    nomePrd: ['', Validators.required],
    resumo: ['', Validators.required],
    qtd:['', Validators.required]      

  });
}


  ngOnInit() {
  }
  voltar(){
  	this.navCtrl.pop();
  }
  update(){

  }

}
