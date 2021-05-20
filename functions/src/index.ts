import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';




admin.initializeApp(functions.config().firebase);
/*
exports.clickEntregas= functions.https.onRequest(async(req,res) =>{
    const writeResult = await admin.firestore().collection('messages').add(
        {

            *Novo pedido! Tem cliente esperando!*\n\nCorre lá no App Axé Delivery e verifique o seu novo pedido!🚙💨\n\nLembre-se de atualizar o status, dessa forma cliente conseguirá acompanhar e ficará mais satisfeito ainda!Não se esqueça de utilizar o Chat em nosso aplicativo para tirar dúvidas com o cliente.\n Verifique por exemplo se ele precisará de troco, caso seja pagamento em dinheiro.\n\n*[Essa é uma mensagem automática do melhor aplicativo do mundo, Axé!]*'
            original: req.body.order,
            from:req.body.From,
            to: req.body.To
        }).then(data =>{
            
        });
})*/

exports.sendTwilio = functions.firestore.document('orcamento/{mUid}').onCreate(async (event) =>{
    const uid = event.get('idLoja');
    const numero = event.get('numeroLoja');
    const accountSid = 'AC70e5f4e0b458628e1fb7c2a14931317f';
    const authToken = '93973210e9958f84ef7bf14be1621a3c';
    const client = require('twilio')(accountSid, authToken);
    var original = '*Novo Orçamento!*\n\nPintou um novo cliente, olha lá no Axé Delivery! 💰🥳💰\nTem orçamento aguardando sua resposta lojista, corre lá pra responder o mais rápido possível!\n\n_Não esqueça de enviar os valores para o cliente!_\n*[Mensagem Automática]*'
    client.messages.create({
        from: "whatsapp:" + '+551149507137',
        body: original,
        to: "whatsapp:+" + numero
    })
    .then((res: { sid: any; }) => {    console.log(uid)
        console.log(res.sid)})
            .done();  

    
})
exports.sendTwilioOrcamentoUpd = functions.firestore.document('orcamento/{mUid}').onUpdate(async (event) =>{
    const uid = event.after.get('idLoja');
    const numero = event.after.get('numeroComprador');
    const accountSid = 'AC70e5f4e0b458628e1fb7c2a14931317f';
    const authToken = '93973210e9958f84ef7bf14be1621a3c';
    const client = require('twilio')(accountSid, authToken);
    var original = '*Se liga no Orçamento!*\n\n Olha lá no Axé Delivery a resposta da Loja! 💰🥳💰\n_Não esqueça de aprovar os valores para o o lojista e concluir sua compra!_\n*[Mensagem Automática]*'
    client.messages.create({
        from: "whatsapp:" + '+551149507137',
        body: original,
        to: "whatsapp:+" + numero
    })
    .then((res: { sid: any; }) => {    console.log(uid)
        console.log(res.sid)})
            .done();  

    
})

exports.sendTwilioVenda = functions.firestore.document('vendas/{mUid}').onCreate(async (event) =>{
    const uid = event.get('idLoja');
    const numero = event.get('telefoneLoja');
    const accountSid = 'AC70e5f4e0b458628e1fb7c2a14931317f';
    const authToken = '93973210e9958f84ef7bf14be1621a3c';
    const client = require('twilio')(accountSid, authToken);
    var original = '*Novo pedido! Tem cliente esperando!*\n\nCorre lá no App Axé Delivery e verifique o seu novo pedido!🚙💨\n\nLembre-se de atualizar o status, dessa forma cliente conseguirá acompanhar e ficará mais satisfeito ainda!Não se esqueça de utilizar o Chat em nosso aplicativo para tirar dúvidas com o cliente.\n Verifique por exemplo se ele precisará de troco, caso seja pagamento em dinheiro.\n\n*[Essa é uma mensagem automática do melhor aplicativo do mundo, Axé!]*'
    client.messages.create({
        from: "whatsapp:" + '+551149507137',
        body: original,
        to: "whatsapp:+" + numero
    })
    .then((res: { sid: any; }) => {    console.log(uid)
        console.log(res.sid)})
            .done();  

    
})
/*
exports.receiveTwilio = functions.https.onRequest( async(req,res) =>{
    const twilio = require('twilio');
    const authToken = '93973210e9958f84ef7bf14be1621a3c';
    let isValid = true;
    const MessagingResponse = twilio.twiml.MessagingResponse;
  

    if(req.method == 'POST'){
        //const accountSid = 'AC70e5f4e0b458628e1fb7c2a14931317f';
        isValid = twilio.validateExpressRequest(req, authToken, {
            url: 'https://us-central1-axedelivery-1.cloudfunctions.net/receiveTwilio'
          });

        // Halt early if the request was not sent from Twilio
        if (!isValid) {
            res
            .type('text/plain')
            .status(403)
            .send('Twilio Request Validation Failed.')
            .end();
            return;
        }  
        // Prepare a response to the SMS message
        const response = new MessagingResponse();
        // Add text to the response
        const writeResult = await admin.firestore().collection('messages').add(
            {
                original: req.body.Body,
                from:req.body.From,
                to: req.body.To
            }).then(data =>{
                
            });

        response.message();

        // Send the response
        res
            .status(200)
            .type('text/xml')
            .end(response.toString());
    
    }else{
        res.status(200).json({
            message: 'Funciona!'
        })
    }
   
})

*/
/*
exports.sendTwilio = functions.firestore.document('vendas/{mUid}').onCreate(async (event) =>{
    const uid = event.get('lojaUID');
    const loja = event.get('nomeLoja')
    const status = event.get('statusPag')
    const accountSid = 'AC70e5f4e0b458628e1fb7c2a14931317f';
    const authToken = '93973210e9958f84ef7bf14be1621a3c';
    const client = require('twilio')(accountSid, authToken);
    var original = '*Novo Pedido!*\n' + loja + ' olha lá no Axé Delivery!\nPagamento:' + status + '\nNão esqueça de atualizar o status para o cliente!\nAproveite e tire qualquer duvida com ele pelo Chat do APP!\n *[Mensagem Automática]*'
    client.messages.create({
        from: "whatsapp:" + '+551149507137',
        body: original,
        to: "whatsapp:" + '+5521974077896'
    })
    .then((res: { sid: any; }) => {    console.log(uid)
console.log(res.sid)})
    .done();  

    
})*/
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
exports.sendOrcamento = functions.firestore.document('orcamento/{mUid}').onCreate(async (event) => {
    const uid = event.get('idLoja');
    const title = 'Você tem um novo orçamento!🎉💰';
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
