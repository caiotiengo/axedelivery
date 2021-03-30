import { Component, OnInit, NgZone } from '@angular/core';
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
import { MoipCreditCard } from 'moip-sdk-js';
import moipSdk from 'moip-sdk-node'
import {
  MediaCapture,
  MediaFile,
  CaptureError
} from '@ionic-native/media-capture/ngx';
import {finalize} from 'rxjs/operators';
import {Observable} from 'rxjs'
import { File, FileEntry } from '@ionic-native/File/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { PoliticaPage } from '../politica/politica.page';
declare var google;

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
  bancos = [
    {
      "value": "001",
      "label": "Banco do Brasil S.A."
    },
    {
      "value": "003",
      "label": "Banco da Amazônia S.A."
    },
    {
      "value": "004",
      "label": "Banco do Nordeste do Brasil S.A."
    },
    {
      "value": "007",
      "label": "Banco Nacional de Desenvolvimento Econômico e Social BNDES"
    },
    {
      "value": "010",
      "label": "Credicoamo Crédito Rural Cooperativa"
    },
    {
      "value": "011",
      "label": "Credit Suisse Hedging-Griffo Corretora de Valores S.A."
    },
    {
      "value": "012",
      "label": "Banco Inbursa S.A."
    },
    {
      "value": "014",
      "label": "Natixis Brasil S.A. Banco Múltiplo"
    },
    {
      "value": "015",
      "label": "UBS Brasil Corretora de Câmbio, Títulos e Valores Mobiliários S.A."
    },
    {
      "value": "016",
      "label": "Coop de Créd. Mútuo dos Despachantes de Trânsito de SC e Rio Grande do Sul"
    },
    {
      "value": "017",
      "label": "BNY Mellon Banco S.A."
    },
    {
      "value": "018",
      "label": "Banco Tricury S.A."
    },
    {
      "value": "021",
      "label": "Banestes S.A. Banco do Estado do Espírito Santo"
    },
    {
      "value": "024",
      "label": "Banco Bandepe S.A."
    },
    {
      "value": "025",
      "label": "Banco Alfa S.A."
    },
    {
      "value": "029",
      "label": "Banco Itaú Consignado S.A."
    },
    {
      "value": "033",
      "label": "Banco Santander (Brasil) S. A."
    },
    {
      "value": "036",
      "label": "Banco Bradesco BBI S.A."
    },
    {
      "value": "037",
      "label": "Banco do Estado do Pará S.A."
    },
    {
      "value": "040",
      "label": "Banco Cargill S.A."
    },
    {
      "value": "041",
      "label": "Banco do Estado do Rio Grande do Sul S.A."
    },
    {
      "value": "047",
      "label": "Banco do Estado de Sergipe S.A."
    },
    {
      "value": "060",
      "label": "Confidence Corretora de Câmbio S.A."
    },
    {
      "value": "062",
      "label": "Hipercard Banco Múltiplo S.A."
    },
    {
      "value": "063",
      "label": "Banco Bradescard S.A."
    },
    {
      "value": "064",
      "label": "Goldman Sachs do Brasil  Banco Múltiplo S. A."
    },
    {
      "value": "065",
      "label": "Banco AndBank (Brasil) S.A."
    },
    {
      "value": "066",
      "label": "Banco Morgan Stanley S. A."
    },
    {
      "value": "069",
      "label": "Banco Crefisa S.A."
    },
    {
      "value": "070",
      "label": "Banco de Brasília S.A."
    },
    {
      "value": "074",
      "label": "Banco J. Safra S.A."
    },
    {
      "value": "075",
      "label": "Banco ABN Amro S.A."
    },
    {
      "value": "076",
      "label": "Banco KDB do Brasil S.A."
    },
    {
      "value": "077",
      "label": "Banco Inter S.A."
    },
    {
      "value": "078",
      "label": "Haitong Banco de Investimento do Brasil S.A."
    },
    {
      "value": "079",
      "label": "Banco Original do Agronegócio S.A."
    },
    {
      "value": "080",
      "label": "BT Corretora de Câmbio Ltda."
    },
    {
      "value": "081",
      "label": "BBN Banco Brasileiro de Negocios S.A."
    },
    {
      "value": "082",
      "label": "Banco Topazio S.A."
    },
    {
      "value": "083",
      "label": "Banco da China Brasil S.A."
    },
    {
      "value": "084",
      "label": "Uniprime Norte do Paraná - Cooperativa de Crédito Ltda."
    },
    {
      "value": "085",
      "label": "Cooperativa Central de Crédito Urbano - Cecred"
    },
    {
      "value": "089",
      "label": "Cooperativa de Crédito Rural da Região da Mogiana"
    },
    {
      "value": "091",
      "label": "Central de Cooperativas de Economia e Crédito Mútuo do Est RS - Unicred"
    },
    {
      "value": "092",
      "label": "BRK S.A. Crédito, Financiamento e Investimento"
    },
    {
      "value": "093",
      "label": "Pólocred Sociedade de Crédito ao Microempreendedor e à Empresa de Pequeno Porte"
    },
    {
      "value": "094",
      "label": "Banco Finaxis S.A."
    },
    {
      "value": "095",
      "label": "Banco Confidence de Câmbio S.A."
    },
    {
      "value": "096",
      "label": "Banco BMFBovespa de Serviços de Liquidação e Custódia S/A"
    },
    {
      "value": "097",
      "label": "Cooperativa Central de Crédito Noroeste Brasileiro Ltda - CentralCredi"
    },
    {
      "value": "098",
      "label": "Credialiança Cooperativa de Crédito Rural"
    },
    {
      "value": "099",
      "label": "Uniprime Central – Central Interestadual de Cooperativas de Crédito Ltda."
    },
    {
      "value": "100",
      "label": "Planner Corretora de Valores S.A."
    },
    {
      "value": "101",
      "label": "Renascença Distribuidora de Títulos e Valores Mobiliários Ltda."
    },
    {
      "value": "102",
      "label": "XP Investimentos Corretora de Câmbio Títulos e Valores Mobiliários S.A."
    },
    {
      "value": "104",
      "label": "Caixa Econômica Federal"
    },
    {
      "value": "105",
      "label": "Lecca Crédito, Financiamento e Investimento S/A"
    },
    {
      "value": "107",
      "label": "Banco Bocom BBM S.A."
    },
    {
      "value": "108",
      "label": "PortoCred S.A. Crédito, Financiamento e Investimento"
    },
    {
      "value": "111",
      "label": "Oliveira Trust Distribuidora de Títulos e Valores Mobiliários S.A."
    },
    {
      "value": "113",
      "label": "Magliano S.A. Corretora de Cambio e Valores Mobiliarios"
    },
    {
      "value": "114",
      "label": "Central Cooperativa de Crédito no Estado do Espírito Santo - CECOOP"
    },
    {
      "value": "117",
      "label": "Advanced Corretora de Câmbio Ltda."
    },
    {
      "value": "118",
      "label": "Standard Chartered Bank (Brasil) S.A. Banco de Investimento"
    },
    {
      "value": "119",
      "label": "Banco Western Union do Brasil S.A."
    },
    {
      "value": "120",
      "label": "Banco Rodobens SA"
    },
    {
      "value": "121",
      "label": "Banco Agibank S.A."
    },
    {
      "value": "122",
      "label": "Banco Bradesco BERJ S.A."
    },
    {
      "value": "124",
      "label": "Banco Woori Bank do Brasil S.A."
    },
    {
      "value": "125",
      "label": "Brasil Plural S.A. Banco Múltiplo"
    },
    {
      "value": "126",
      "label": "BR Partners Banco de Investimento S.A."
    },
    {
      "value": "127",
      "label": "Codepe Corretora de Valores e Câmbio S.A."
    },
    {
      "value": "128",
      "label": "MS Bank S.A. Banco de Câmbio"
    },
    {
      "value": "129",
      "label": "UBS Brasil Banco de Investimento S.A."
    },
    {
      "value": "130",
      "label": "Caruana S.A. Sociedade de Crédito, Financiamento e Investimento"
    },
    {
      "value": "131",
      "label": "Tullett Prebon Brasil Corretora de Valores e Câmbio Ltda."
    },
    {
      "value": "132",
      "label": "ICBC do Brasil Banco Múltiplo S.A."
    },
    {
      "value": "133",
      "label": "Confederação Nacional das Cooperativas Centrais de Crédito e Economia Familiar e"
    },
    {
      "value": "134",
      "label": "BGC Liquidez Distribuidora de Títulos e Valores Mobiliários Ltda."
    },
    {
      "value": "135",
      "label": "Gradual Corretora de Câmbio, Títulos e Valores Mobiliários S.A."
    },
    {
      "value": "136",
      "label": "Confederação Nacional das Cooperativas Centrais Unicred Ltda – Unicred do Brasil"
    },
    {
      "value": "137",
      "label": "Multimoney Corretora de Câmbio Ltda"
    },
    {
      "value": "138",
      "label": "Get Money Corretora de Câmbio S.A."
    },
    {
      "value": "139",
      "label": "Intesa Sanpaolo Brasil S.A. - Banco Múltiplo"
    },
    {
      "value": "140",
      "label": "Easynvest - Título Corretora de Valores SA"
    },
    {
      "value": "142",
      "label": "Broker Brasil Corretora de Câmbio Ltda."
    },
    {
      "value": "143",
      "label": "Treviso Corretora de Câmbio S.A."
    },
    {
      "value": "144",
      "label": "Bexs Banco de Câmbio S.A."
    },
    {
      "value": "145",
      "label": "Levycam - Corretora de Câmbio e Valores Ltda."
    },
    {
      "value": "146",
      "label": "Guitta Corretora de Câmbio Ltda."
    },
    {
      "value": "149",
      "label": "Facta Financeira S.A. - Crédito Financiamento e Investimento"
    },
    {
      "value": "157",
      "label": "ICAP do Brasil Corretora de Títulos e Valores Mobiliários Ltda."
    },
    {
      "value": "159",
      "label": "Casa do Crédito S.A. Sociedade de Crédito ao Microempreendedor"
    },
    {
      "value": "163",
      "label": "Commerzbank Brasil S.A. - Banco Múltiplo"
    },
    {
      "value": "169",
      "label": "Banco Olé Bonsucesso Consignado S.A."
    },
    {
      "value": "172",
      "label": "Albatross Corretora de Câmbio e Valores S.A"
    },
    {
      "value": "173",
      "label": "BRL Trust Distribuidora de Títulos e Valores Mobiliários S.A."
    },
    {
      "value": "174",
      "label": "Pernambucanas Financiadora S.A. Crédito, Financiamento e Investimento"
    },
    {
      "value": "177",
      "label": "Guide Investimentos S.A. Corretora de Valores"
    },
    {
      "value": "180",
      "label": "CM Capital Markets Corretora de Câmbio, Títulos e Valores Mobiliários Ltda."
    },
    {
      "value": "182",
      "label": "Dacasa Financeira S/A - Sociedade de Crédito, Financiamento e Investimento"
    },
    {
      "value": "183",
      "label": "Socred S.A. - Sociedade de Crédito ao Microempreendedor"
    },
    {
      "value": "184",
      "label": "Banco Itaú BBA S.A."
    },
    {
      "value": "188",
      "label": "Ativa Investimentos S.A. Corretora de Títulos Câmbio e Valores"
    },
    {
      "value": "189",
      "label": "HS Financeira S/A Crédito, Financiamento e Investimentos"
    },
    {
      "value": "190",
      "label": "Cooperativa de Economia e Crédito Mútuo dos Servidores Públicos Estaduais do Rio"
    },
    {
      "value": "191",
      "label": "Nova Futura Corretora de Títulos e Valores Mobiliários Ltda."
    },
    {
      "value": "194",
      "label": "Parmetal Distribuidora de Títulos e Valores Mobiliários Ltda."
    },
    {
      "value": "196",
      "label": "Fair Corretora de Câmbio S.A."
    },
    {
      "value": "197",
      "label": "Stone Pagamentos S.A."
    },
    {
      "value": "204",
      "label": "Banco Bradesco Cartões S.A."
    },
    {
      "value": "208",
      "label": "Banco BTG Pactual S.A."
    },
    {
      "value": "212",
      "label": "Banco Original S.A."
    },
    {
      "value": "213",
      "label": "Banco Arbi S.A."
    },
    {
      "value": "217",
      "label": "Banco John Deere S.A."
    },
    {
      "value": "218",
      "label": "Banco BS2 S.A."
    },
    {
      "value": "222",
      "label": "Banco Credit Agrícole Brasil S.A."
    },
    {
      "value": "224",
      "label": "Banco Fibra S.A."
    },
    {
      "value": "233",
      "label": "Banco Cifra S.A."
    },
    {
      "value": "237",
      "label": "Banco Bradesco S.A."
    },
    {
      "value": "241",
      "label": "Banco Clássico S.A."
    },
    {
      "value": "243",
      "label": "Banco Máxima S.A."
    },
    {
      "value": "246",
      "label": "Banco ABC Brasil S.A."
    },
    {
      "value": "249",
      "label": "Banco Investcred Unibanco S.A."
    },
    {
      "value": "250",
      "label": "BCV - Banco de Crédito e Varejo S/A"
    },
    {
      "value": "253",
      "label": "Bexs Corretora de Câmbio S/A"
    },
    {
      "value": "254",
      "label": "Parana Banco S. A."
    },
    {
      "value": "260",
      "label": "Nu Pagamentos S.A."
    },
    {
      "value": "265",
      "label": "Banco Fator S.A."
    },
    {
      "value": "266",
      "label": "Banco Cédula S.A."
    },
    {
      "value": "268",
      "label": "Barigui Companhia Hipotecária"
    },
    {
      "value": "269",
      "label": "HSBC Brasil S.A. Banco de Investimento"
    },
    {
      "value": "271",
      "label": "IB Corretora de Câmbio, Títulos e Valores Mobiliários Ltda."
    },
    {
      "value": "300",
      "label": "Banco de la Nacion Argentina"
    },
    {
      "value": "318",
      "label": "Banco BMG S.A."
    },
    {
      "value": "320",
      "label": "China Construction Bank (Brasil) Banco Múltiplo S/A"
    },
    {
      "value": "341",
      "label": "Itaú Unibanco  S.A."
    },
    {
      "value": "366",
      "label": "Banco Société Générale Brasil S.A."
    },
    {
      "value": "370",
      "label": "Banco Mizuho do Brasil S.A."
    },
    {
      "value": "376",
      "label": "Banco J. P. Morgan S. A."
    },
    {
      "value": "389",
      "label": "Banco Mercantil do Brasil S.A."
    },
    {
      "value": "394",
      "label": "Banco Bradesco Financiamentos S.A."
    },
    {
      "value": "399",
      "label": "Kirton Bank S.A. - Banco Múltiplo"
    },
    {
      "value": "412",
      "label": "Banco Capital S. A."
    },
    {
      "value": "422",
      "label": "Banco Safra S.A."
    },
    {
      "value": "456",
      "label": "Banco MUFG Brasil S.A."
    },
    {
      "value": "464",
      "label": "Banco Sumitomo Mitsui Brasileiro S.A."
    },
    {
      "value": "473",
      "label": "Banco Caixa Geral - Brasil S.A."
    },
    {
      "value": "477",
      "label": "Citibank N.A."
    },
    {
      "value": "479",
      "label": "Banco ItauBank S.A."
    },
    {
      "value": "487",
      "label": "Deutsche Bank S.A. - Banco Alemão"
    },
    {
      "value": "488",
      "label": "JPMorgan Chase Bank, National Association"
    },
    {
      "value": "492",
      "label": "ING Bank N.V."
    },
    {
      "value": "494",
      "label": "Banco de La Republica Oriental del Uruguay"
    },
    {
      "value": "495",
      "label": "Banco de La Provincia de Buenos Aires"
    },
    {
      "value": "505",
      "label": "Banco Credit Suisse (Brasil) S.A."
    },
    {
      "value": "545",
      "label": "Senso Corretora de Câmbio e Valores Mobiliários S.A."
    },
    {
      "value": "600",
      "label": "Banco Luso Brasileiro S.A."
    },
    {
      "value": "604",
      "label": "Banco Industrial do Brasil S.A."
    },
    {
      "value": "610",
      "label": "Banco VR S.A."
    },
    {
      "value": "611",
      "label": "Banco Paulista S.A."
    },
    {
      "value": "612",
      "label": "Banco Guanabara S.A."
    },
    {
      "value": "613",
      "label": "Omni Banco S.A."
    },
    {
      "value": "623",
      "label": "Banco Pan S.A."
    },
    {
      "value": "626",
      "label": "Banco Ficsa S. A."
    },
    {
      "value": "630",
      "label": "Banco Intercap S.A."
    },
    {
      "value": "633",
      "label": "Banco Rendimento S.A."
    },
    {
      "value": "634",
      "label": "Banco Triângulo S.A."
    },
    {
      "value": "637",
      "label": "Banco Sofisa S. A."
    },
    {
      "value": "641",
      "label": "Banco Alvorada S.A."
    },
    {
      "value": "643",
      "label": "Banco Pine S.A."
    },
    {
      "value": "652",
      "label": "Itaú Unibanco Holding S.A."
    },
    {
      "value": "653",
      "label": "Banco Indusval S. A."
    },
    {
      "value": "654",
      "label": "Banco A. J. Renner S.A."
    },
    {
      "value": "655",
      "label": "Banco Votorantim S.A."
    },
    {
      "value": "707",
      "label": "Banco Daycoval S.A."
    },
    {
      "value": "712",
      "label": "Banco Ourinvest S.A."
    },
    {
      "value": "719",
      "label": "Banif - Bco Internacional do Funchal (Brasil) S.A."
    },
    {
      "value": "735",
      "label": "Banco Neon S.A."
    },
    {
      "value": "739",
      "label": "Banco Cetelem S.A."
    },
    {
      "value": "741",
      "label": "Banco Ribeirão Preto S.A."
    },
    {
      "value": "743",
      "label": "Banco Semear S.A."
    },
    {
      "value": "745",
      "label": "Banco Citibank S.A."
    },
    {
      "value": "746",
      "label": "Banco Modal S.A."
    },
    {
      "value": "747",
      "label": "Banco Rabobank International Brasil S.A."
    },
    {
      "value": "748",
      "label": "Banco Cooperativo Sicredi S. A."
    },
    {
      "value": "751",
      "label": "Scotiabank Brasil S.A. Banco Múltiplo"
    },
    {
      "value": "752",
      "label": "Banco BNP Paribas Brasil S.A."
    },
    {
      "value": "753",
      "label": "Novo Banco Continental S.A. - Banco Múltiplo"
    },
    {
      "value": "754",
      "label": "Banco Sistema S.A."
    },
    {
      "value": "755",
      "label": "Bank of America Merrill Lynch Banco Múltiplo S.A."
    },
    {
      "value": "756",
      "label": "Banco Cooperativo do Brasil S/A - Bancoob"
    },
    {
      "value": "757",
      "label": "Banco Keb Hana do Brasil S. A."
    }
  ]
  banks = [
    {
      "value": "001",
      "label": "Banco do Brasil S.A."
    },
    {
      "value": "003",
      "label": "Banco da Amazônia S.A."
    },
    {
      "value": "004",
      "label": "Banco do Nordeste do Brasil S.A."
    },
    {
      "value": "007",
      "label": "Banco Nacional de Desenvolvimento Econômico e Social BNDES"
    },
    {
      "value": "010",
      "label": "Credicoamo Crédito Rural Cooperativa"
    },
    {
      "value": "011",
      "label": "Credit Suisse Hedging-Griffo Corretora de Valores S.A."
    },
    {
      "value": "012",
      "label": "Banco Inbursa S.A."
    },
    {
      "value": "014",
      "label": "Natixis Brasil S.A. Banco Múltiplo"
    },
    {
      "value": "015",
      "label": "UBS Brasil Corretora de Câmbio, Títulos e Valores Mobiliários S.A."
    },
    {
      "value": "016",
      "label": "Coop de Créd. Mútuo dos Despachantes de Trânsito de SC e Rio Grande do Sul"
    },
    {
      "value": "017",
      "label": "BNY Mellon Banco S.A."
    },
    {
      "value": "018",
      "label": "Banco Tricury S.A."
    },
    {
      "value": "021",
      "label": "Banestes S.A. Banco do Estado do Espírito Santo"
    },
    {
      "value": "024",
      "label": "Banco Bandepe S.A."
    },
    {
      "value": "025",
      "label": "Banco Alfa S.A."
    },
    {
      "value": "029",
      "label": "Banco Itaú Consignado S.A."
    },
    {
      "value": "033",
      "label": "Banco Santander (Brasil) S. A."
    },
    {
      "value": "036",
      "label": "Banco Bradesco BBI S.A."
    },
    {
      "value": "037",
      "label": "Banco do Estado do Pará S.A."
    },
    {
      "value": "040",
      "label": "Banco Cargill S.A."
    },
    {
      "value": "041",
      "label": "Banco do Estado do Rio Grande do Sul S.A."
    },
    {
      "value": "047",
      "label": "Banco do Estado de Sergipe S.A."
    },
    {
      "value": "060",
      "label": "Confidence Corretora de Câmbio S.A."
    },
    {
      "value": "062",
      "label": "Hipercard Banco Múltiplo S.A."
    },
    {
      "value": "063",
      "label": "Banco Bradescard S.A."
    },
    {
      "value": "064",
      "label": "Goldman Sachs do Brasil  Banco Múltiplo S. A."
    },
    {
      "value": "065",
      "label": "Banco AndBank (Brasil) S.A."
    },
    {
      "value": "066",
      "label": "Banco Morgan Stanley S. A."
    },
    {
      "value": "069",
      "label": "Banco Crefisa S.A."
    },
    {
      "value": "070",
      "label": "Banco de Brasília S.A."
    },
    {
      "value": "074",
      "label": "Banco J. Safra S.A."
    },
    {
      "value": "075",
      "label": "Banco ABN Amro S.A."
    },
    {
      "value": "076",
      "label": "Banco KDB do Brasil S.A."
    },
    {
      "value": "077",
      "label": "Banco Inter S.A."
    },
    {
      "value": "078",
      "label": "Haitong Banco de Investimento do Brasil S.A."
    },
    {
      "value": "079",
      "label": "Banco Original do Agronegócio S.A."
    },
    {
      "value": "080",
      "label": "BT Corretora de Câmbio Ltda."
    },
    {
      "value": "081",
      "label": "BBN Banco Brasileiro de Negocios S.A."
    },
    {
      "value": "082",
      "label": "Banco Topazio S.A."
    },
    {
      "value": "083",
      "label": "Banco da China Brasil S.A."
    },
    {
      "value": "084",
      "label": "Uniprime Norte do Paraná - Cooperativa de Crédito Ltda."
    },
    {
      "value": "085",
      "label": "Cooperativa Central de Crédito Urbano - Cecred"
    },
    {
      "value": "089",
      "label": "Cooperativa de Crédito Rural da Região da Mogiana"
    },
    {
      "value": "091",
      "label": "Central de Cooperativas de Economia e Crédito Mútuo do Est RS - Unicred"
    },
    {
      "value": "092",
      "label": "BRK S.A. Crédito, Financiamento e Investimento"
    },
    {
      "value": "093",
      "label": "Pólocred Sociedade de Crédito ao Microempreendedor e à Empresa de Pequeno Porte"
    },
    {
      "value": "094",
      "label": "Banco Finaxis S.A."
    },
    {
      "value": "095",
      "label": "Banco Confidence de Câmbio S.A."
    },
    {
      "value": "096",
      "label": "Banco BMFBovespa de Serviços de Liquidação e Custódia S/A"
    },
    {
      "value": "097",
      "label": "Cooperativa Central de Crédito Noroeste Brasileiro Ltda - CentralCredi"
    },
    {
      "value": "098",
      "label": "Credialiança Cooperativa de Crédito Rural"
    },
    {
      "value": "099",
      "label": "Uniprime Central – Central Interestadual de Cooperativas de Crédito Ltda."
    },
    {
      "value": "100",
      "label": "Planner Corretora de Valores S.A."
    },
    {
      "value": "101",
      "label": "Renascença Distribuidora de Títulos e Valores Mobiliários Ltda."
    },
    {
      "value": "102",
      "label": "XP Investimentos Corretora de Câmbio Títulos e Valores Mobiliários S.A."
    },
    {
      "value": "104",
      "label": "Caixa Econômica Federal"
    },
    {
      "value": "105",
      "label": "Lecca Crédito, Financiamento e Investimento S/A"
    },
    {
      "value": "107",
      "label": "Banco Bocom BBM S.A."
    },
    {
      "value": "108",
      "label": "PortoCred S.A. Crédito, Financiamento e Investimento"
    },
    {
      "value": "111",
      "label": "Oliveira Trust Distribuidora de Títulos e Valores Mobiliários S.A."
    },
    {
      "value": "113",
      "label": "Magliano S.A. Corretora de Cambio e Valores Mobiliarios"
    },
    {
      "value": "114",
      "label": "Central Cooperativa de Crédito no Estado do Espírito Santo - CECOOP"
    },
    {
      "value": "117",
      "label": "Advanced Corretora de Câmbio Ltda."
    },
    {
      "value": "118",
      "label": "Standard Chartered Bank (Brasil) S.A. Banco de Investimento"
    },
    {
      "value": "119",
      "label": "Banco Western Union do Brasil S.A."
    },
    {
      "value": "120",
      "label": "Banco Rodobens SA"
    },
    {
      "value": "121",
      "label": "Banco Agibank S.A."
    },
    {
      "value": "122",
      "label": "Banco Bradesco BERJ S.A."
    },
    {
      "value": "124",
      "label": "Banco Woori Bank do Brasil S.A."
    },
    {
      "value": "125",
      "label": "Brasil Plural S.A. Banco Múltiplo"
    },
    {
      "value": "126",
      "label": "BR Partners Banco de Investimento S.A."
    },
    {
      "value": "127",
      "label": "Codepe Corretora de Valores e Câmbio S.A."
    },
    {
      "value": "128",
      "label": "MS Bank S.A. Banco de Câmbio"
    },
    {
      "value": "129",
      "label": "UBS Brasil Banco de Investimento S.A."
    },
    {
      "value": "130",
      "label": "Caruana S.A. Sociedade de Crédito, Financiamento e Investimento"
    },
    {
      "value": "131",
      "label": "Tullett Prebon Brasil Corretora de Valores e Câmbio Ltda."
    },
    {
      "value": "132",
      "label": "ICBC do Brasil Banco Múltiplo S.A."
    },
    {
      "value": "133",
      "label": "Confederação Nacional das Cooperativas Centrais de Crédito e Economia Familiar e"
    },
    {
      "value": "134",
      "label": "BGC Liquidez Distribuidora de Títulos e Valores Mobiliários Ltda."
    },
    {
      "value": "135",
      "label": "Gradual Corretora de Câmbio, Títulos e Valores Mobiliários S.A."
    },
    {
      "value": "136",
      "label": "Confederação Nacional das Cooperativas Centrais Unicred Ltda – Unicred do Brasil"
    },
    {
      "value": "137",
      "label": "Multimoney Corretora de Câmbio Ltda"
    },
    {
      "value": "138",
      "label": "Get Money Corretora de Câmbio S.A."
    },
    {
      "value": "139",
      "label": "Intesa Sanpaolo Brasil S.A. - Banco Múltiplo"
    },
    {
      "value": "140",
      "label": "Easynvest - Título Corretora de Valores SA"
    },
    {
      "value": "142",
      "label": "Broker Brasil Corretora de Câmbio Ltda."
    },
    {
      "value": "143",
      "label": "Treviso Corretora de Câmbio S.A."
    },
    {
      "value": "144",
      "label": "Bexs Banco de Câmbio S.A."
    },
    {
      "value": "145",
      "label": "Levycam - Corretora de Câmbio e Valores Ltda."
    },
    {
      "value": "146",
      "label": "Guitta Corretora de Câmbio Ltda."
    },
    {
      "value": "149",
      "label": "Facta Financeira S.A. - Crédito Financiamento e Investimento"
    },
    {
      "value": "157",
      "label": "ICAP do Brasil Corretora de Títulos e Valores Mobiliários Ltda."
    },
    {
      "value": "159",
      "label": "Casa do Crédito S.A. Sociedade de Crédito ao Microempreendedor"
    },
    {
      "value": "163",
      "label": "Commerzbank Brasil S.A. - Banco Múltiplo"
    },
    {
      "value": "169",
      "label": "Banco Olé Bonsucesso Consignado S.A."
    },
    {
      "value": "172",
      "label": "Albatross Corretora de Câmbio e Valores S.A"
    },
    {
      "value": "173",
      "label": "BRL Trust Distribuidora de Títulos e Valores Mobiliários S.A."
    },
    {
      "value": "174",
      "label": "Pernambucanas Financiadora S.A. Crédito, Financiamento e Investimento"
    },
    {
      "value": "177",
      "label": "Guide Investimentos S.A. Corretora de Valores"
    },
    {
      "value": "180",
      "label": "CM Capital Markets Corretora de Câmbio, Títulos e Valores Mobiliários Ltda."
    },
    {
      "value": "182",
      "label": "Dacasa Financeira S/A - Sociedade de Crédito, Financiamento e Investimento"
    },
    {
      "value": "183",
      "label": "Socred S.A. - Sociedade de Crédito ao Microempreendedor"
    },
    {
      "value": "184",
      "label": "Banco Itaú BBA S.A."
    },
    {
      "value": "188",
      "label": "Ativa Investimentos S.A. Corretora de Títulos Câmbio e Valores"
    },
    {
      "value": "189",
      "label": "HS Financeira S/A Crédito, Financiamento e Investimentos"
    },
    {
      "value": "190",
      "label": "Cooperativa de Economia e Crédito Mútuo dos Servidores Públicos Estaduais do Rio"
    },
    {
      "value": "191",
      "label": "Nova Futura Corretora de Títulos e Valores Mobiliários Ltda."
    },
    {
      "value": "194",
      "label": "Parmetal Distribuidora de Títulos e Valores Mobiliários Ltda."
    },
    {
      "value": "196",
      "label": "Fair Corretora de Câmbio S.A."
    },
    {
      "value": "197",
      "label": "Stone Pagamentos S.A."
    },
    {
      "value": "204",
      "label": "Banco Bradesco Cartões S.A."
    },
    {
      "value": "208",
      "label": "Banco BTG Pactual S.A."
    },
    {
      "value": "212",
      "label": "Banco Original S.A."
    },
    {
      "value": "213",
      "label": "Banco Arbi S.A."
    },
    {
      "value": "217",
      "label": "Banco John Deere S.A."
    },
    {
      "value": "218",
      "label": "Banco BS2 S.A."
    },
    {
      "value": "222",
      "label": "Banco Credit Agrícole Brasil S.A."
    },
    {
      "value": "224",
      "label": "Banco Fibra S.A."
    },
    {
      "value": "233",
      "label": "Banco Cifra S.A."
    },
    {
      "value": "237",
      "label": "Banco Bradesco S.A."
    },
    {
      "value": "241",
      "label": "Banco Clássico S.A."
    },
    {
      "value": "243",
      "label": "Banco Máxima S.A."
    },
    {
      "value": "246",
      "label": "Banco ABC Brasil S.A."
    },
    {
      "value": "249",
      "label": "Banco Investcred Unibanco S.A."
    },
    {
      "value": "250",
      "label": "BCV - Banco de Crédito e Varejo S/A"
    },
    {
      "value": "253",
      "label": "Bexs Corretora de Câmbio S/A"
    },
    {
      "value": "254",
      "label": "Parana Banco S. A."
    },
    {
      "value": "260",
      "label": "Nu Pagamentos S.A."
    },
    {
      "value": "265",
      "label": "Banco Fator S.A."
    },
    {
      "value": "266",
      "label": "Banco Cédula S.A."
    },
    {
      "value": "268",
      "label": "Barigui Companhia Hipotecária"
    },
    {
      "value": "269",
      "label": "HSBC Brasil S.A. Banco de Investimento"
    },
    {
      "value": "271",
      "label": "IB Corretora de Câmbio, Títulos e Valores Mobiliários Ltda."
    },
    {
      "value": "300",
      "label": "Banco de la Nacion Argentina"
    },
    {
      "value": "318",
      "label": "Banco BMG S.A."
    },
    {
      "value": "320",
      "label": "China Construction Bank (Brasil) Banco Múltiplo S/A"
    },
    {
      "value": "341",
      "label": "Itaú Unibanco  S.A."
    },
    {
      "value": "366",
      "label": "Banco Société Générale Brasil S.A."
    },
    {
      "value": "370",
      "label": "Banco Mizuho do Brasil S.A."
    },
    {
      "value": "376",
      "label": "Banco J. P. Morgan S. A."
    },
    {
      "value": "389",
      "label": "Banco Mercantil do Brasil S.A."
    },
    {
      "value": "394",
      "label": "Banco Bradesco Financiamentos S.A."
    },
    {
      "value": "399",
      "label": "Kirton Bank S.A. - Banco Múltiplo"
    },
    {
      "value": "412",
      "label": "Banco Capital S. A."
    },
    {
      "value": "422",
      "label": "Banco Safra S.A."
    },
    {
      "value": "456",
      "label": "Banco MUFG Brasil S.A."
    },
    {
      "value": "464",
      "label": "Banco Sumitomo Mitsui Brasileiro S.A."
    },
    {
      "value": "473",
      "label": "Banco Caixa Geral - Brasil S.A."
    },
    {
      "value": "477",
      "label": "Citibank N.A."
    },
    {
      "value": "479",
      "label": "Banco ItauBank S.A."
    },
    {
      "value": "487",
      "label": "Deutsche Bank S.A. - Banco Alemão"
    },
    {
      "value": "488",
      "label": "JPMorgan Chase Bank, National Association"
    },
    {
      "value": "492",
      "label": "ING Bank N.V."
    },
    {
      "value": "494",
      "label": "Banco de La Republica Oriental del Uruguay"
    },
    {
      "value": "495",
      "label": "Banco de La Provincia de Buenos Aires"
    },
    {
      "value": "505",
      "label": "Banco Credit Suisse (Brasil) S.A."
    },
    {
      "value": "545",
      "label": "Senso Corretora de Câmbio e Valores Mobiliários S.A."
    },
    {
      "value": "600",
      "label": "Banco Luso Brasileiro S.A."
    },
    {
      "value": "604",
      "label": "Banco Industrial do Brasil S.A."
    },
    {
      "value": "610",
      "label": "Banco VR S.A."
    },
    {
      "value": "611",
      "label": "Banco Paulista S.A."
    },
    {
      "value": "612",
      "label": "Banco Guanabara S.A."
    },
    {
      "value": "613",
      "label": "Omni Banco S.A."
    },
    {
      "value": "623",
      "label": "Banco Pan S.A."
    },
    {
      "value": "626",
      "label": "Banco Ficsa S. A."
    },
    {
      "value": "630",
      "label": "Banco Intercap S.A."
    },
    {
      "value": "633",
      "label": "Banco Rendimento S.A."
    },
    {
      "value": "634",
      "label": "Banco Triângulo S.A."
    },
    {
      "value": "637",
      "label": "Banco Sofisa S. A."
    },
    {
      "value": "641",
      "label": "Banco Alvorada S.A."
    },
    {
      "value": "643",
      "label": "Banco Pine S.A."
    },
    {
      "value": "652",
      "label": "Itaú Unibanco Holding S.A."
    },
    {
      "value": "653",
      "label": "Banco Indusval S. A."
    },
    {
      "value": "654",
      "label": "Banco A. J. Renner S.A."
    },
    {
      "value": "655",
      "label": "Banco Votorantim S.A."
    },
    {
      "value": "707",
      "label": "Banco Daycoval S.A."
    },
    {
      "value": "712",
      "label": "Banco Ourinvest S.A."
    },
    {
      "value": "719",
      "label": "Banif - Bco Internacional do Funchal (Brasil) S.A."
    },
    {
      "value": "735",
      "label": "Banco Neon S.A."
    },
    {
      "value": "739",
      "label": "Banco Cetelem S.A."
    },
    {
      "value": "741",
      "label": "Banco Ribeirão Preto S.A."
    },
    {
      "value": "743",
      "label": "Banco Semear S.A."
    },
    {
      "value": "745",
      "label": "Banco Citibank S.A."
    },
    {
      "value": "746",
      "label": "Banco Modal S.A."
    },
    {
      "value": "747",
      "label": "Banco Rabobank International Brasil S.A."
    },
    {
      "value": "748",
      "label": "Banco Cooperativo Sicredi S. A."
    },
    {
      "value": "751",
      "label": "Scotiabank Brasil S.A. Banco Múltiplo"
    },
    {
      "value": "752",
      "label": "Banco BNP Paribas Brasil S.A."
    },
    {
      "value": "753",
      "label": "Novo Banco Continental S.A. - Banco Múltiplo"
    },
    {
      "value": "754",
      "label": "Banco Sistema S.A."
    },
    {
      "value": "755",
      "label": "Bank of America Merrill Lynch Banco Múltiplo S.A."
    },
    {
      "value": "756",
      "label": "Banco Cooperativo do Brasil S/A - Bancoob"
    },
    {
      "value": "757",
      "label": "Banco Keb Hana do Brasil S. A."
    }
  ]
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
        "message": "O usuário não encontrado."
    },
    {
        "code": "auth/weak-password",
        "message": "A senha é muito fraca."
    },
    {
        "code": "auth/email-already-in-use",
        "message": "Já existe uma conta com o endereço de email fornecido."
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
    nome = '';
    endereco = '';
    telefone = '';
    Prinome = '';
    Segnome = '';
    CPFRES ='';
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
    digitoConta ='';
    check:boolean
    lat 
    url
    long
    cnpj: any;
    strCNPJ: any;
    datou
    public cadastro : FormGroup;
    mainuser: AngularFirestoreDocument;
    userID
    sub;
    FCM
    public donwloadUrl: Observable<string>;
    public uploadPercent: Observable<number>;
    photos: Array<Foto> = [];
    autocomplete: { input: string; };
    autocompleteItems: any[];
    location: any;
    placeid: any;
    GoogleAutocomplete: any;
    hide = false
    geocoder
    hide2 = false
    latitudeGoogle
    longitudeGoogle
    autocomplete2: { input: string; };
    autocompleteItems2: any[];
    hider = true
    numeroBank =''
    nomeBanco = ''
    entregaDe = '';
    seNEntrega = '';
    moip: any;
  pubKey: any;
  hash: string;
  Es
  states
  cidades: Array<any> = [];
  constructor(public navCtrl: NavController, private storage: Storage,public loadingController: LoadingController,
              public afAuth: AngularFireAuth, private geolocation: Geolocation, public router: Router, public actRouter: ActivatedRoute,
              public services: ServiceService, public afStore: AngularFirestore, public alertCtrl: AlertController,
              private modalController: ModalController,private http: HttpClient,private afStorage: AngularFireStorage,
              private mediaCapture: MediaCapture,private platform: Platform,private camera: Camera,
              private file: File,private push:Push,
              private media: Media, private formBuilder: FormBuilder, public zone: NgZone) {
                this.cadastro = this.formBuilder.group({
                  resumo: [''],
                  nome: ['', [Validators.required]],
                  endereco: ['',[Validators.required]],
                  telefone: ['', [Validators.required]],
                  bairro: ['', [Validators.required]],
                  cidade: ['', [Validators.required]],
                  estado: [''],
                  email: ['', [Validators.required]],
                  password: ['',[Validators.required]],
                  CEP: ['',[Validators.required]],
                  //DOB: [''],
                  complemento:[''],
                  banco:[''],
                  CPF: ['',[Validators.required]],
                  agencia: [''],
                  nomeNaConta: [''],
                  conta: [''],                  
                  numeroEND: ['',],
                  correnteoupou:[''],
                  CPFconta:[''],
                  ddd:[''],
                  entregaDe:[''],
                  seNEntrega:[''],
                  numeroBank:[''],
                  digitoConta:[''],
                  Prinome:[''],
                  Segnome:[''],
                  CPFRES:['']   
   
   

            });

            
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
          this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
          this.autocomplete = { input: '' };
          this.autocompleteItems = [];
          this.geocoder = new google.maps.Geocoder;

          this.moip = moipSdk({
            /*
            token: 'C5LQHXVYGJLN0XYSTRZCQY6LRQZVV6AR',
            key: 'LNRERY9ULDQSPBXYR2BTJLNKRKLWTPEIUKAV9E1Z',
            production: false
                 idmoip account "MPA-CC3641B4B904"
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
  }

  ngOnInit() {
    this.services.data().then(x =>{
      this.states = x;
      console.log(this.states)
    })
  }
  city(evt){
    console.log(evt.srcElement.value)
    this.estado = evt.srcElement.value;
  let estado =  this.states.estados.filter(i => i.sigla === this.estado)
      console.log(estado[0].cidades)
      this.cidades =[];
      estado[0].cidades.forEach(element => {

        this.cidades.push({
          nome:element,
          estado:this.estado
        })
      });
  }
/**
 Registro wirecard
 */
contaWirecard(){
  this.presentLoading() 

  this.moip.account.create({
    email: {
        address: this.email
    },
    person: {
        name: this.Prinome,
        lastName: this.Segnome,
        taxDocument: {
            type: "CPF",
            number: this.CPFRES
        },
        identityDocument: {
            type : "CNPJ",
            number: this.CPF,
            issuer: "JUCERJA",
            issueDate: "2000-12-12"
        },
        birthDate: "1990-01-01",
        phone: {
            countryCode: "55",
            areaCode: this.ddd,
            number: this.telefone
        },
        address: {
            street: this.endereco,
            streetNumber: this.numeroEND,
            district: this.bairro,
            zipCode: this.CEP,
            city: this.cidade,
            state: "RJ",
            country: "BRA"
        }
    },
    type: "MERCHANT",
    transparentAccount: true
}).then((response) => {
    console.log(response.body)
    this.registrarLoja(response.body.id, response.body.accessToken)
}).catch((err) => {
    console.log(err)
})
}



/*
Autocomplete
*/
  updateBusca(item){
    console.log(item)
    this.hider = true
    this.numeroBank = item.value
    this.nomeBanco = item.label

  }
  initializeItems(): void {
    this.bancos = this.banks;
    this.hider = false


  }
  buscaBanco(evt){

    this.initializeItems();

    

    const searchTerm = evt.srcElement.value;
    console.log(searchTerm)
    
    if (!searchTerm) { 
      return;
     }
    this.bancos = this.banks.filter(currentGoal => {
       if (currentGoal.label && searchTerm) {
          
        if (currentGoal.label.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
           // this.hider = true;
            
            return true;
           } else {   
             return false;
           }
       }
     });
  }

  UpdateSearchResults(){
    this.hide = false

    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ 
      input: this.autocomplete.input,
      componentRestrictions: {
        country: 'br'
      }
    },
    (predictions, status) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        });
      });
    });
  }
  SelectSearchResult(item) {
    this.hide = true

    ///WE CAN CONFIGURE MORE COMPLEX FUNCTIONS SUCH AS UPLOAD DATA TO FIRESTORE OR LINK IT TO SOMETHING
    console.log(String(item.terms[0].value))      
    console.log(String(item.terms[1].value))      
    console.log(String(item.terms[2].value))      
    console.log(String(item.terms[3].value))   
    console.log(JSON.stringify(item))
    
    this.endereco = String(item.terms[0].value)
    this.bairro = String(item.terms[1].value)
    this.endereco = String(item.terms[0].value)
    this.bairro = String(item.terms[1].value)
    //this.cidade = String(item.terms[2].value)
    //this.Es = String(item.terms[3].value)

    console.log(this.endereco)
    this.placeid = item.place_id
    this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
      if(status === 'OK' && results[0]){
        let position = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
        };
        console.log(position)
        this.latitudeGoogle =results[0].geometry.location.lat()
        this.longitudeGoogle = results[0].geometry.location.lng()
        console.log(results[0].geometry.location)
        console.log(results)
        //let marker = new google.maps.Marker({
        //  position: results[0].geometry.location,
        //  map: this.map,
        //});
        //this.markers.push(marker);
        //this.map.setCenter(results[0].geometry.location);
      }
    })
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
async registrarLoja(idmoip, accessToken) {
    console.log(idmoip)
    console.log(accessToken)
   this.presentLoading() 
   try{
     const res = await this.afAuth.createUserWithEmailAndPassword(this.email, this.password)
     if(this.FCM === undefined){
       this.FCM === '1'
     }
     setTimeout(() => {

      if(res.user){
      const userid = res.user.uid
      this.afStore.doc(`users/${userid}`).set({
             nome: this.nome,
             email: this.email,
             endereco: this.endereco,
             telefone:  this.telefone,
             bairro: this.bairro,
             cidade: this.cidade,
             zona: this.type,
             tipo: this.typeUser,
             LikeValue: 0,
             DislikeValue: 0,
             lat: this.latitudeGoogle,
             lng: this.longitudeGoogle,
             aprovado: "Nao avaliado",
             banco: this.banco,
             CPFconta:this.CPFconta,
             agencia: Number(this.agencia),
             nomeNaConta: this.nomeNaConta,
             conta: Number(this.conta),
             correnteoupou:this.correnteoupou,
             resumo: this.resumo,
             numeroEND: this.numeroEND,
             CPFCNPJ: this.CPF,
             CEP: this.CEP,
             status: 'Offline',
             estado: this.estado,
             ddd:this.ddd,
             complemento: this.complemento,
             entrega: this.entregaDe,
             seNao: this.seNEntrega,
             fcm: '1',
             FotoPerfil: String(this.url),
             idmoip: idmoip,
             porcentagemLoja: 87,
             porcentagemAxe: 13,
             numeroBank: Number(this.numeroBank),
             digitoConta: Number(this.digitoConta),
             accessToken: accessToken,
             unidades:[{
              FotoPerfil: String(this.url),
              aprovado: "Sim",
              bairro: this.bairro,
              cep: this.CEP,
              cidade: this.cidade,
              complemento: this.complemento,
              endereco: this.endereco,
              entrega: this.entregaDe,
              estado: this.estado,
              lat: this.latitudeGoogle,
              lng: this.longitudeGoogle,
              nome: this.nome,
              numero: this.numeroEND,
              seNao: this.seNEntrega,
              status: 'Online',
              tipo: this.type,
              uid: res.user.uid
             }]

        }).then(() => {
           const user = firebase.auth().currentUser;
           if(this.FCM === undefined){
            this.FCM === '1'
          }
          this.mainuser = this.afStore.doc(`users/${user.uid}`);
          this.userID = user.uid
 
          this.sub = this.mainuser.valueChanges().subscribe(event => {
            if(this.FCM === undefined){
              this.FCM === '1'
            }
            this.storage.set('usuario', event) 
                              this.storage.set('email', user.email);
                
               this.navCtrl.navigateRoot('/user');
               console.log(user);
               this.showalert('Bem-vindo ao Axé Delivery!', 'Agora vamos aproveitar!')
               this.showalert('Não esqueça!', 'Lembre-se de ativar as notificações clicando no botão "Habilitar notificações"!')
            });
 
        });
      }else{
        alert('Verifique a sua conexão com a internet e tente novamente mais tarde.') 
       }
     }, 1200);
 
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


async registrarUsuario(){
    this.presentLoading() 
    try{
      const res = await this.afAuth.createUserWithEmailAndPassword(this.email, this.password)
      if(this.FCM === undefined){
        this.FCM === '1'
      }
      setTimeout(() => {

      if(res.user){
          const userid = res.user.uid
          this.afStore.doc(`users/${userid}`).set({
             nome: this.nome,
             email: this.email,
             endereco: this.endereco,
             telefone:  this.telefone,
             bairro: this.bairro,
             cidade: this.cidade,
             zona: this.type,
             tipo: this.typeUser,
             LikeValue: 0,
             DislikeValue: 0,
             lat: this.latitudeGoogle,
             lng: this.longitudeGoogle,
             aprovado: "Nao avaliado",
             numeroEND: this.numeroEND,
             CPFCNPJ: this.CPF,
             CEP: this.CEP,
             status: 'Offline', 
             complemento: this.complemento,
             estado: this.estado,
             ddd: this.ddd,
             fcm: '1',          
        }).then(() => {
          if(this.FCM === undefined){
            this.FCM === '1'
          }
           const user = firebase.auth().currentUser;
   
          this.mainuser = this.afStore.doc(`users/${user.uid}`);
          this.userID = user.uid
   
          this.sub = this.mainuser.valueChanges().subscribe(event => {
               this.storage.set('usuario', event) 
                              this.storage.set('email', user.email);
                              if(this.FCM === undefined){
                                this.FCM === '1'
                              }
               this.navCtrl.navigateRoot('/user');
               console.log(user);
               this.showalert('Bem-vindo ao Axé Delivery!', 'Agora vamos aproveitar!')
               this.showalert('Não esqueça!', 'Lembre-se de ativar as notificações clicando no botão "Habilitar notificações"!')
   
             });
   
        })       
      }else{
       alert('Verifique a sua conexão com a internet e tente novamente mais tarde.') 
      }
    }, 1200);

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
  		this.navCtrl.navigateForward('/');
  }
  politica(){
    this.presentModal();
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: PoliticaPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
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

checklistLoja(){
  if(this.type !=''){
    if(this.typeUser != ''){
      if(this.email !=''){
        if(this.password !=''){
          if(this.Prinome !=''){
            if(this.Segnome !=''){
              if(this.CPFRES !=''){
                if(this.nome != ''){
                  if(this.entregaDe !=''){
                    if(this.seNEntrega !=''){
                        if(this.CPF !=''){
                          console.log('ok cpf')
                          if(this.endereco !=''){
                            console.log('ok end')
                            if(this.numeroEND != null){
                              console.log('ok num')
                              if(this.CEP !=''){
                                console.log('ok Cep')
                                if(this.complemento !=''){
                                  console.log('ok com')
                                  if(this.bairro !=''){
                                    console.log('ok bairro')
                                    if(this.cidade !=''){
                                      console.log('ok cid')
                                      if(this.ddd !=''){
                                        console.log('ok ddd')
                                        if(this.telefone !=''){
                                          console.log('ok Tel')
                                          if(this.resumo != ''){
                                            if(this.correnteoupou !=''){
                                              console.log('ok corrente ou pou')
                                              if(this.banco !=''){
                                                if(this.nomeNaConta != ''){
                                                  console.log('ok nome conta')
                                                  if(this.CPFconta != ''){
                                                    console.log('okCPf conta')
                                                    if(this.agencia!=''){
                                                      console.log('ok agencia')
                                                      if(this.conta != ''){
                                                        console.log('ok conta')
                                                        if(this.digitoConta != ''){
                                                          console.log('ok digito')
                                                          this.contaWirecard()
      
                                                        }else{
                                                          alert('Preencha o campo "Digito"')
                                                        }
                                                      }else{
                                                        alert('Preencha o campo "Conta"')
                                                      }
                                                    }else{
                                                      alert('Preencha o campo "Agência"')
                                                    }
                                                  }else{
                                                    alert('Preencha o campo "CNPJ da conta", se não tiver conta atrelada ao CNPJ, informe o CPF da conta. ')
                                                  }
                                                }else{
                                                  alert('Preencha o campo "Nome na conta"')
                                                }
                                              }else{
                                                alert('Selecione o seu Banco')
                                              }
                                              
                                            }else{
                                              alert('Selecione o tipo de Conta')
                                            }
                                          }else{
                                            alert('Preencha o campo "Descrição"')
                                          }
                                          
                                        }else{
                                          alert('Preencha o campo "Telefone"')
                                        }
                                      }else{
                                        alert('Preencha o campo "DDD"')
                                      }
                                
                                    }else{
                                      alert('Preencha o campo "Cidade"')
                                    }
                                  }else{
                                    alert('Preencha o campo "Bairro"')
                                  }
                            
                                }else{
                                  alert('Preencha o campo "Complemento"')
                                }
                              }else{
                                alert('Preencha o campo "CEP"')
                              }
                            }else{
                              alert('Preencha o campo "Número"')
                            }
                          }else{
                            alert('Preencha o campo "Endereço"')
                          }
                        }else{
                          alert('Preencha o campo "CPF"')
                        }
                    }else{
                      alert('Preencha o campo "Se não, entrega quando?"')
                    }
                  }else{
                    alert('Preencha o campo "Entrega de:", com o seu horário de entrega.')
                  }
                }else{
                  alert('Preencha o campo "Nome da Loja"')
                }

              }else{
                alert('Preencha o campo "CPF do Responsavél"')
              }
            }else{
              alert('Preencha o campo "Segundo Nome"')
            }
          }else{
            alert('Preencha o campo "Primeiro Nome"')
          }
        }else{
          alert('Preencha o campo "Senha"')
        }
      }else{
        alert('Preencha o campo "Email"')
      }
    }else{
      alert('Selecione o campo "Tipo de Usuário"')
    }
  }else{
    alert('Selecione o campo "Sua Região"')
  }


}

checklistUsuario(){
  if(this.type !=''){
    if(this.typeUser != ''){
      if(this.email !=''){
        if(this.password !=''){
          if(this.nome !=''){
            console.log('ok nome')
            if(this.CPF !=''){
              console.log('ok cpf')
              if(this.endereco !=''){
                console.log('ok end')
                if(this.numeroEND != null){
                  console.log('ok num')
                  if(this.CEP !=''){
                    console.log('ok Cep')
                    if(this.complemento !=''){
                      console.log('ok com')
                      if(this.bairro !=''){
                        console.log('ok bairro')
                        if(this.cidade !=''){
                          console.log('ok cid')
                          if(this.ddd !=''){
                            console.log('ok ddd')
                            if(this.telefone !=''){
                              console.log('ok Tel')
                              this.registrarUsuario()
                            }else{
                              alert('Preencha o campo "Telefone"')
                            }
                          }else{
                            alert('Preencha o campo "DDD"')
                          }
                    
                        }else{
                          alert('Preencha o campo "Cidade"')
                        }
                      }else{
                        alert('Preencha o campo "Bairro"')
                      }
                
                    }else{
                      alert('Preencha o campo "Complemento"')
                    }
                  }else{
                    alert('Preencha o campo "CEP"')
                  }
                }else{
                  alert('Preencha o campo "Número"')
                }
              }else{
                alert('Preencha o campo "Endereço"')
              }
            }else{
              alert('Preencha o campo "CPF"')
            }
          }else{
            alert('Preencha o campo "Nome Completo"')
          }
        }else{
          alert('Preencha o campo "Senha"')
        }
      }else{
        alert('Preencha o campo "Email"')
      }
    }else{
      alert('Selecione o campo "Tipo de Usuário"')
    }
  }else{
    alert('Selecione o campo "Sua Região"')
  }


}

}
