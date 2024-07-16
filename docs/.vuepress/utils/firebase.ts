import { FirebaseOptions, initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getMessaging } from "firebase/messaging";

console.log('API Key:', process.env.VUE_APP_FIREBASE_API_KEY);

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
export { functions, httpsCallable };
