const db = require('./firebase');

async function testFirebase() {
    const docRef = db.collection('test').doc('hello');
    await docRef.set({ message: "Firebase connected!" });
    console.log("Document written successfully.");
}

testFirebase();
