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

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
