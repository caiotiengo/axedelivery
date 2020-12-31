import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

exports.sendTwilio = functions.firestore.document('vendas/{mUid}').onUpdate(async (event) =>{
    const accountSid = 'AC70e5f4e0b458628e1fb7c2a14931317f';
    const authToken = '93973210e9958f84ef7bf14be1621a3c';
    const client = require('twilio')(accountSid, authToken);
    var original = 'Obrigado pela compra *Caio*!'
    client.messages.create({
        from: "whatsapp:" + '+14155238886',
        body: original,
        to: "whatsapp:" + '+5521974077896'
    })
    .then((res: { sid: any; }) => console.log(res.sid))
    .done();  

    
})
exports.sendNotificationToFCMToken = functions.firestore.document('vendas/{mUid}').onCreate(async (event) => {
    const uid = event.get('lojaUID');
    const title = 'Você tem um novo pedido!🎉💰';
    const content = 'Abra a página de pedidos para mais informações.';
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
exports.chatParaLoja = functions.firestore.document('chats/{mUid}').onUpdate(async (event) => {
    //pegar o sender id e o receiver id
    const uid = event.after.get('idLoja');
    const title = 'Você tem uma nova mensagem!🗣📩';
    const content = 'Abra a página de pedidos e entre no chat para mais informações.';
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
exports.chatParaUsuario = functions.firestore.document('chats/{mUid}').onUpdate(async (event) => {
    //pegar o sender id e o receiver id
    const uid = event.after.get('idComprador');
    const title = 'Você tem uma nova mensagem!🗣📩';
    const content = 'Abra a página de pedidos e entre no chat para mais informações.';
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

exports.comentarioLoja = functions.firestore.document('comments/{mUid}').onCreate(async (event) => {
    //pegar o sender id e o receiver id
    const uid = event.get('lojaUID');
    const title = 'Você tem um novo comentário!😍';
    const content = 'Tem gente dando feedback! corre lá pra ver!';
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

exports.sendNotificationToFCMTokenMSG = functions.firestore.document('vendas/{mUid}').onUpdate(async(event)=>{

    const uid = event.after.get('compradorUID');
    const statusEnt = event.after.get('statusEnt');
    let userDoc = await admin.firestore().doc(`users/${uid}`).get();
    let fcmToken = userDoc.get('fcm');
    const title = 'O status do seu pedido mudou!🥰';
    const content = '🚗💨 ' + statusEnt; 

    var message = {
        notification:{
            title: title,
            body: content
        },
        token:fcmToken
    }

    let response = await admin.messaging().send(message)
    console.log(response)

})

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
