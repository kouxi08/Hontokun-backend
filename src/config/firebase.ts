import { credential, initializeApp } from 'firebase-admin';
import { GOOGLE_APPLICATION_CREDENTIALS } from './env';

const serviceAccount = GOOGLE_APPLICATION_CREDENTIALS;

const firebaseApp = initializeApp({
  credential: credential.cert(serviceAccount),
});

export { firebaseApp };
