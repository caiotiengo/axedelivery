import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);



exports.notificacaoVenda = functions.firestore.document('vendas/{uid}').onWrite(async (event) =>{
	//let docID = event.after.id;
	let title = event.after.get('titulo')
	let content = event.after.get('conteudo')

	var message ={
		notification:{
			title: title,
			content: content
		},
		topic:'venda'
	};
	let response = await admin.messaging().send(message);
	console.log(response)
})


exports.sendNotificationToFCMToken = functions.firestore.document('vendas/{mUid}').onWrite(async (event) => {
    const uid = event.after.get('lojaUID');
    const title = 'Você tem um novo pedido!';
    const content = 'Abra a página de status para mais informações.';
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
});

exports.sendNotificationToFCMToken = functions.firestore.document('vendas/{mUid}').onUpdate(async (event) => {
    const uid = event.after.get('compradorUID');
    const status = event.after.get('statusEnt');
    if(status === 'Preparando Entrega'){
    	 const title = 'Preparando seu pedido!';
    	 const content = 'A loja ja está preparando tudo!';
    }
    const title = 'Você tem um novo pedido!';
    const content = 'Abra a página de status para mais informações.';
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
});
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
