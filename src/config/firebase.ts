import admin from 'firebase-admin';

const serviceAccount = '/app/service-account-file.json';

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export { firebaseApp };
