import { FirebaseOptions, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getMessaging } from "firebase/messaging";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyDbUunQTsOftgn9GsG8c2grVQn5WQKYFLo",
  authDomain: "zeebu-staking.firebaseapp.com",
  projectId: "zeebu-staking",
  storageBucket: "zeebu-staking.appspot.com",
  messagingSenderId: "796248911548",
  appId: "1:796248911548:web:69337b2a972225b34aeab9",
  measurementId: "G-ZRWP3GN7FE",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const messaging = getMessaging(app);
