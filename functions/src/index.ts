import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);


exports.sendNotificationToFCMToken = functions.firestore.document('vendas/{mUid}').onWrite(async (event) => {
    const uid = event.after.get('lojaUID');
    const title = 'Você tem um novo pedido!';
    const content = 'Abra a página de status para mais informações.';
    let userDoc = await admin.firestore().doc(`users/${uid}`).get();
    let fcmToken = userDoc.get('fcm');

    var message = {
        notification: {
            title: title,
            body: content
        },
        token: fcmToken,
    }

    let response = await admin.messaging().send(message);
    console.log(response);
});
 /*
exports.sendNotificationUSER = functions.firestore.document('messages/{mUid}').onWrite(async (event) => {
    const uid = event.after.get('compradorUID');
    const statusEnt = event.after.get('statusEnt');

    var conditionOne = 'Preparando Entrega' in statusEnt;
    let userDoc = await admin.firestore().doc(`users/${uid}`).get();
    let fcmToken = userDoc.get('fcm');
		 var message = {
        		notification: {
            		title: 'Preparando seu pedido!',
            		body: 'A loja ja está preparando o seu pedido...',
        	},
        	token: fcmToken,
		    condition: conditionOne

    	}

    let response = await admin.messaging().send(message);
    console.log(response);
   if(status == 'Preparando Entrega'){
    	 
    }
     if(status == 'Saiu para Entrega'){
    	 const title = 'Seu pedido saiu!';
    	 const content = 'Fique atento a sua porta, já já deve chegar!';
    	 let userDoc = await admin.firestore().doc(`users/${uid}`).get();
    	 let fcmToken = userDoc.get('fcm');

    	 var message = {
        		notification: {
            		title: title,
            		body: content,
        	},
        	token: fcmToken,
    	}

    	let response = await admin.messaging().send(message);
    	console.log(response);
    }
     if(status == 'Entregue'){
    	 const title = 'Seu pedido foi entregue!';
    	 const content = 'Obrigado por comprar pelo Axé Delivery! Muito axé para você!';
    	 let userDoc = await admin.firestore().doc(`users/${uid}`).get();
    	 let fcmToken = userDoc.get('fcm');

    	 var message = {
        		notification: {
            		title: title,
            		body: content,
        	},
        	token: fcmToken,
    	}

    	let response = await admin.messaging().send(message);
    	console.log(response);
    }else {
    	 const title = 'Erro';
    	 const content = 'Vixi, moio';
    	 let userDoc = await admin.firestore().doc(`users/${uid}`).get();
    	 let fcmToken = userDoc.get('fcm');

    	 var message = {
        		notification: {
            		title: title,
            		body: content,
        	},
        	token: fcmToken,
    	}

    	let response = await admin.messaging().send(message);
    	console.log(response);
    }
});
*/
    

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
