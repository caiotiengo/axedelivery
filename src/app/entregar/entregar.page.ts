import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { HTTP } from '@ionic-native/http/ngx';
import Lalamove from 'lalamove-js'
@Component({
  selector: 'app-entregar',
  templateUrl: './entregar.page.html',
  styleUrls: ['./entregar.page.scss'],
})
export class EntregarPage implements OnInit {
  lala
  body = {
    'serviceType': 'MOTORCYCLE',
    'scheduleAt': '2018-06-13T12:00:00:00Z', // Note: This is in UTC Timezone
    'specialRequests': [],
    'requesterContact': {
        'name': 'Draco Yam',
        'phone': '+6592344758'
    },
    'stops': [
        {
            'location': {'lat': '1.284318', 'lng': '103.851335'},
            'addresses': {
                'en_SG': {
                    'displayString': '1 Raffles Place #04-00, One Raffles Place Shopping Mall, Singapore',
                    'country': 'SG'
                }
            }
        },
        {
            'location': {'lat': '1.278578', 'lng': '103.851860'},
            'addresses': {
                'en_SG': {
                    'displayString': 'Asia Square Tower 1, 8 Marina View, Singapore',
                    'country': 'SG'
                }
            }
        }
    ],
    'deliveries': [
        {
            'toStop': 1,
            'toContact': {
                'name': 'Brian Garcia',
                'phone': '+6592344837'
            },
            'remarks': 'ORDER #: 1234, ITEM 1 x 1, ITEM 2 x 2'
        }
    ]
  }
  constructor(public http: HTTP) { 


   /* this.lala = require('lalamove-js') ({
      host: 'https://sandbox-rest.lalamove.com',
      key: '201751069b814964a2585b9a299426e1',      // Obtained from Lalamove Sales Team
      secret: 'MC4CAQACBQDn1/a/AgMBAAECBQDD0/8RAgMA9psCAwDwrQIDAJiNAgMAzAEC',   // Obtained from Lalamove Sales Team
      country: 'BR'
    })
    console.log(this.lala)*/
  }

  ngOnInit() {
  }
  entregar(){
    /*this.lala.quotation(this.body)
    .then(function (response) {
      return response
    })*/
  }
  
 
}
