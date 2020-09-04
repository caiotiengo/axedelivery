import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-entregar',
  templateUrl: './entregar.page.html',
  styleUrls: ['./entregar.page.scss'],
})
export class EntregarPage implements OnInit {

  constructor(public http: HTTP) { }

  ngOnInit() {
  }
  entregar(){
    let headers = new Headers(
      { 
        'X-DV-Auth-Token':'3DC9BC4A5EF965B466436DEF6375B188E2AB3083',
        'Content-Type' : 'application/json'
      });
      let options = new RequestOptions({ headers: headers });
      let data = JSON.stringify({
        "is_successful": true, 
        "order": { 
            "order_id": 1250032, 
            "order_name": "50032", 
            "vehicle_type_id": 8, 
            "created_datetime": "2020-09-03T12:56:23-03:00", 
            "finish_datetime": null, 
            "status": "available", 
            "status_description": "available", 
            "matter": "Documents", 
            "total_weight_kg": 0, 
            "is_client_notification_enabled": false, 
            "is_contact_person_notification_enabled": false, 
            "loaders_count": 0, 
            "backpayment_details": null, 
            "points": [{ 
                "point_id": 202685, 
                "client_order_id": null, 
                "address": "R. Guamiranga, 1140 - Vila Independencia, São Paulo - SP, 04220-020", 
                "latitude": "-23.5962988", 
                "longitude": "-46.5858049", 
                "required_start_datetime": "2020-09-03T13:26:23-03:00", 
                "required_finish_datetime": "2020-09-03T13:56:23-03:00", 
                "arrival_start_datetime": null, 
                "arrival_finish_datetime": null, 
                "estimated_arrival_datetime": null, 
                "courier_visit_datetime": null, 
                "contact_person": { 
                    "name": null, 
                    "phone": "5511900000001" 
                }, 
                "taking_amount": "0.00", 
                "buyout_amount": "0.00", 
                "note": null, 
                "packages": [], 
                "is_cod_cash_voucher_required": false, 
                "is_order_payment_here": false, 
                "building_number": null, 
                "entrance_number": null, 
                "intercom_code": null, 
                "floor_number": null, 
                "apartment_number": null, 
                "invisible_mile_navigation_instructions": null, 
                "place_photo_url": null, 
                "sign_photo_url": null, 
                "checkin": null, 
                "tracking_url": null 
            }, { 
                "point_id": 202686, 
                "client_order_id": null, 
                "address": "Av. Paulista, 1439 - 12 - Bela Vista, São Paulo - SP, 01310-100", 
                "latitude": "-23.562747", 
                "longitude": "-46.6576753", 
                "required_start_datetime": "2020-09-03T14:26:23-03:00", 
                "required_finish_datetime": "2020-09-03T14:56:23-03:00", 
                "arrival_start_datetime": null, 
                "arrival_finish_datetime": null, 
                "estimated_arrival_datetime": null, 
                "courier_visit_datetime": null, 
                "contact_person": { 
                    "name": null, 
                    "phone": "5511900000001" 
                }, 
                "taking_amount": "0.00", 
                "buyout_amount": "0.00", 
                "note": null, 
                "packages": [], 
                "is_cod_cash_voucher_required": false, 
                "is_order_payment_here": false, 
                "building_number": null, 
                "entrance_number": null, 
                "intercom_code": null, 
                "floor_number": null, 
                "apartment_number": null, 
                "invisible_mile_navigation_instructions": null, 
                "place_photo_url": null, 
                "sign_photo_url": null, 
                "checkin": null, 
                "tracking_url": null 
            }], 
            "payment_amount": "18.00", 
            "delivery_fee_amount": "18.00", 
            "weight_fee_amount": "0.00", 
            "insurance_amount": "0.00", 
            "insurance_fee_amount": "0.00", 
            "loading_fee_amount": "0.00", 
            "money_transfer_fee_amount": "0.00", 
            "suburban_delivery_fee_amount": "0.00", 
            "overnight_fee_amount": "0.00", 
            "discount_amount": "0.00", 
            "backpayment_amount": "0.00", 
            "cod_fee_amount": "0.00", 
            "backpayment_photo_url": null, 
            "itinerary_document_url": null, 
            "waybill_document_url": null, 
            "courier": null, 
            "is_motobox_required": false, 
            "payment_method": "cash", 
            "bank_card_id": null 
        } 
      });
      
    this.http.post('https://robotapitest.clickentregas.com/api/business/1.1/create-order',data, options).then(data => {
      console.log(data);

    console.log(data.status);
    console.log(data.data); // data received by server
    console.log(data.headers);

  })
  .catch(error => {
    console.log(error);

    console.log(error.status);
    console.log(error.error); // error message as string
    console.log(error.headers);

  });
}
    /*let headers = new Headers(
      { "Access-Control-Allow-Origin": "*",
        'X-DV-Auth-Token':'3DC9BC4A5EF965B466436DEF6375B188E2AB3083',
        'Content-Type' : 'application/json'
      });
      let options = new RequestOptions({ headers: headers });
      
      let data = JSON.stringify({
        cardToken: 'data',
        amount: 500
      });
      
      return new Promise((resolve, reject) => {
        this.http.post('https://robotapitest.clickentregas.com/api/business/1.1', data, options)
        .toPromise()
        .then((response) =>
        {
          console.log('API Response : ', response.json());
          resolve(response.json());
        })
        .catch((error) =>
        {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
        });
      });
  }*/
 
}
