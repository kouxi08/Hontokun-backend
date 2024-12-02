import admin from 'firebase-admin';
import { GOOGLE_APPLICATION_CREDENTIALS } from './env';

const serviceAccount = GOOGLE_APPLICATION_CREDENTIALS;

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export { firebaseApp };
