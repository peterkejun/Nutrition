const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.getNutrientsConsumption = functions.https.onCall((data, context) => {
    const uid = context.auth.uid;
    const today = new Date();
    let month = String(today.getMonth() + 1);
    let day = String(today.getDate());
    let year = today.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    const date_string = [year, month, day].join('');
    const path = 'nutrition_history/' + uid + '/' + date_string;
    console.log(date_string);
    return admin.database().ref(path).once('value').then(function (snapshot) {
            console.log(snapshot.val());
            if (snapshot.val() === null) return {};
            return snapshot.val();
        }).catch(error => {
            return error;
    })
});
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


