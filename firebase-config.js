// firebase-config.js
const admin = require('firebase-admin');
const serviceAccount = require('./database-marabe-firebase-adminsdk-fbsvc-fdff12cd81.json'); 

admin.initializeApp({
credential: admin.credential.cert(serviceAccount)   
});
// Get a reference to the Firestore database.
const db = admin.firestore();
// Export the Firestore database instance so it can be used in other files (e.g., index.js).
module.exports = db;