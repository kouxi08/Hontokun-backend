import admin from 'firebase-admin';

const serviceAccount = '/app/service-account-file.json';

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const deleteFirebaseUser = async (uid: string) => {
  try {
    await firebaseApp.auth().deleteUser(uid);
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

export { firebaseApp, deleteFirebaseUser };
