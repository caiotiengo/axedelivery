import { Component, OnInit ,NgZone} from '@angular/core';
import {NavController,AlertController} from '@ionic/angular';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {HttpClient} from '@angular/common/http';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';

declare var google;

export interface Processo {
    nome: string ;
    endereco: string ;
    cidade: string ;
    bairro: string ;
    telefone: string ;
    LikeValue: number;
    DislikeValue: number;
    tellme: string;
    email: string;
    typeUser:string;
    lat:any;
    long:any;
}
@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})

export class UserPage implements OnInit {
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
    mainuser: AngularFirestoreDocument;
    nome: string ;
    endereco: string ;
    cidade: string ;
    bairro: string ;
    telefone: string ;
    email: string;
    zona: string;
    sub;
    proc;
    que: any;
    procUser;
    public goalList: any[];
    public loadedGoalList: any[];
    processos;
    typeUser;
    currentGoale;
    public products = new Array<Processo>();
    public proccessSubscription: Subscription;
    goalListFiltrado;
    loadedGoalListFiltrado;
    userID
    enderecoNew = '';
    bairroNew = '';
    cidadeNew = '';
    estadoNew = '';
    numeroENDNew = '';
    agenciaNew = '';
    contaNew = '';
    nomeContaNew = '';
    bancoNew = '';
    tipoContaNew = '';
    CEPNew = '';
    CPFconta
    hideMe = true
    hideMe2 = true
    newCadastro
    CEP:string
    estado:string
    lat
    newBanco
    newEntrega
    lng
    datou
    numero
    banco
    conta
    nomeNaConta
    tipoConta 
    agencia
    CPFcontaNew = '';
    type = '';
    FCM
    hideMe3 = true
    entrega
    seNao
    autocomplete: { input: string; };
    autocompleteItems: any[];
    location: any;
    placeid: any;
    GoogleAutocomplete: any;
    hide = false
    geocoder
    latitudeGoogle
    longitudeGoogle
    status
    hider = true
    numeroBank =''
    nomeBanco = ''
    complemento
    unidadeEnd 
    unidadeNum
    unidadeEstado
    unidadeCEP
    abrirUnidade
    unidadeBairro
    unidadeComple
    unidadeNumero
    unidadeCidade
    unidadez
  constructor(public navCtrl: NavController, private storage: Storage,
              public afStore: AngularFirestore, 
              public modalController: ModalController,
                public services: ServiceService,
                private formBuilder: FormBuilder,
                private geolocation: Geolocation,private http: HttpClient, public zone: NgZone, 
                public alertCtrl: AlertController,private push:Push) {
        this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
                  this.autocomplete = { input: '' };
                  this.autocompleteItems = [];
                  this.geocoder = new google.maps.Geocoder;


        this.newCadastro = this.formBuilder.group({
                  
                  enderecoNew: ['', Validators.required],
                  numeroENDNew: ['', Validators.required],
                  CEPNew: ['', Validators.required],
                  complemento: ['', Validators.required],
                  bairroNew: ['', Validators.required],
                  cidadeNew: ['', Validators.required],
                  estadoNew: ['', Validators.required],
                  
            });
        this.newBanco = this.formBuilder.group({
                  
                  bancoNew: ['', Validators.required],
                  contaNew: ['', Validators.required],
                  digitoNew: ['', Validators.required],
                  numeroBank:['', Validators.required],
                  agenciaNew: ['', Validators.required],
                  nomeContaNew: ['', Validators.required],
                  tipoContaNew: ['', Validators.required],
                  CPFcontaNew: ['', Validators.required]
                  
            }); 
            this.newEntrega = this.formBuilder.group({
                  
              entregas: ['', Validators.required],
              senaoEntregas: ['', Validators.required],

              
        });        
        this.geolocation.getCurrentPosition().then((resp) => {
              console.log(resp.coords.latitude)
              console.log(resp.coords.longitude)
              this.lat = resp.coords.latitude;
              this.lng = resp.coords.longitude;
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
    const user = firebase.auth().currentUser;
    console.log(user);
    if (user) {
            this.mainuser = this.afStore.doc(`users/${user.uid}`);
               this.userID = user.uid
                this.storage.set('usuarioUID', this.userID)
              } else {

      }
    this.proccessSubscription = this.services.getProccessos().subscribe(data => {
          this.goalListFiltrado = data.filter(i => i.email === user.email && i.noApp === "Sim");
          this.loadedGoalListFiltrado = data.filter(i => i.email === user.email && i.noApp === "Sim");
          console.log(this.goalList);


    });


    this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.nome = event.nome;
      this.endereco = event.endereco;
      this.cidade = event.cidade;
      this.email = event.email;
      this.bairro = event.bairro;
      this.telefone = event.telefone;
      this.zona = event.zona;
      this.typeUser = event.tipo;
      this.CEP = event.CEP;
      this.estado = event.estado;
      this.numero = event.numeroEND
      this.banco = event.banco
      this.agencia = event.agencia
      this.conta = event.conta
      this.nomeNaConta = event.nomeNaConta
      this.tipoConta = event.correnteoupou
      this.CPFconta = event.CPFconta
      this.entrega = event.entrega
      this.seNao = event.seNao
      this.status = event.status
      this.complemento = event.complemento
      this.unidadez = event.unidades
    });

   }

  

  ngOnInit() {

  }
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

  
  entregaz(){
    this.services.updateEntrega(this.userID, this.newEntrega.value.entregas,
       this.newEntrega.value.senaoEntregas)
   this.showalert('Opa!', 'Dados atualizados!')
    this.hideMe3 = true;
  }
  habilitar(){
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
     this.services.updateFCM(this.userID, this.FCM);
      this.showalert('Opa!', 'Notificação habilitada.')
         console.log('Device registered', registration)

   } );
   pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
 
 

  }

  abrirLoja(){
    var opc = "Online"
    this.services.updateStatus(this.userID,opc)

  }
  fecharLoja(){
    var opc = "Offline"
    this.services.updateStatus(this.userID,opc)
    
  }

  updateEnd(){
      this.hideMe = false;
  }
  updateBank(){
    this.hideMe2 = false;
  }
  updateEntrega(){
    this.hideMe3 = false;
  }
  updateBanco(){

      this.services.updateBanco(this.userID, this.newBanco.value.bancoNew, this.newBanco.value.agenciaNew,
         this.newBanco.value.contaNew,this.newBanco.value.tipoContaNew,this.newBanco.value.nomeContaNew,
        this.newBanco.value.CPFcontaNew, this.newBanco.value.digitoNew, this.newBanco.value.numeroBank)
      this.showalert('Opa!', 'Dados atualizados!')
       this.hideMe2 = true;
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
    
    this.newCadastro.value.enderecoNew = String(item.terms[0].value)
    this.newCadastro.value.bairroNew = String(item.terms[1].value)
    this.newCadastro.value.cidadeNew = String(item.terms[2].value)
    this.newCadastro.value.estadoNew = String(item.terms[3].value)

    this.enderecoNew = String(item.terms[0].value)
    this.bairroNew = String(item.terms[1].value)
    this.cidadeNew = String(item.terms[2].value)
    this.estadoNew = String(item.terms[3].value)

    console.log(this.newCadastro.value.bairroNew)
    console.log(this.newCadastro.value.cidadeNew)
    console.log(this.bairroNew)
    console.log(this.cidadeNew)

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
  
  update(){
    this.services.updateEnd(this.userID,this.type,this.newCadastro.value.enderecoNew, 
      this.newCadastro.value.CEPNew,
                       this.bairroNew,this.newCadastro.value.complemento, this.newCadastro.value.numeroENDNew, 
                       this.cidadeNew,
                       this.newCadastro.value.estadoNew, this.latitudeGoogle, this.longitudeGoogle)
                       this.hideMe = true
                       this.storage.remove('usuario').then(() =>{
                        const user = firebase.auth().currentUser;
                        this.mainuser = this.afStore.doc(`users/${user.uid}`);
                        this.userID = user.uid
               
                        this.mainuser.valueChanges().subscribe(event => {
                           console.log(event)
                           this.FCM = event.fcm
                           this.storage.set('usuario', event).then(() =>{
                           this.showalert('Opa!', 'Dados atualizados!')
                           //this.navCtrl.navigateRoot('/list');
                              
                        })
                                 
                      })                        
                
          });
  }
    addUni(){
      this.navCtrl.navigateForward('/lala-move')
    }
    unidades(id){
      //this.services.updateUnidade(id, this.unidadeEnd, this.unidadeCEP, this.unidadeBairro,this.unidadeComple, this.unidadeNumero, this.unidadeCidade, this.unidadeEstado, this.latitudeGoogle, this.longitudeGoogle)
    }
  async presentAlertConfirm(items) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Quase apagando o seu item...',
      message: 'Você tem certeza disso?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Tenho',
          handler: () => {
            console.log('Confirm Okay');
            this.deletarItem(items)
          }
        }
      ]
    });

    await alert.present();
  }
  deletarItem(items){
    this.services.deletarItem(items.id).then(() =>{
      alert('Seu produto foi deletado com sucesso!');
    })
  }
 async showalert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['Ok']
    });

    await alert.present();
  }
  sair() {
    
    this.storage.clear();
    firebase.auth().signOut().then(() => {
      this.navCtrl.navigateRoot('/');
    });

  }
  home() {
   this.navCtrl.navigateForward('/list');
  }
perfilPage() {
  	this.navCtrl.navigateForward('/login');
  	console.log('Fine');
  }
  user() {
  	this.navCtrl.navigateForward('/user');
  	console.log('Fine');
  // Deletar quando tiver conexão com o firebase.

  }
  vaiProdutos(){
    this.navCtrl.navigateForward('/lista-produtos')
  }
  addProc() {
  	this.navCtrl.navigateForward('/add-proc');
  	console.log('Fine');
  // Deletar quando tiver conexão com o firebase.

  }
  pedirDele(item){
    this.services.deleteUnidade(item.uid,item)
    /*
    this.afStore.collection('produto').add(item).then(()=>{
      alert('Seu pedido para excluir a loja foi enviado e será processado em até 48 horas!')
    });
    */
  }
}
