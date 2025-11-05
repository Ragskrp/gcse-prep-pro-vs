const admin = require('firebase-admin');
const path = require('path');

// IMPORTANT: Replace with the actual path to your Firebase service account key file.
const serviceAccount = require(path.join(__dirname, '..', 'serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { db };
