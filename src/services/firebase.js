import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA2x5S2kRpEqlsts82XhmZehCz5GF3ok4w",
  authDomain: "eventapp-88b33.firebaseapp.com",
  projectId: "eventapp-88b33",
  storageBucket: "eventapp-88b33.firebasestorage.app",
  messagingSenderId: "888341394512",
  appId: "1:888341394512:web:c4672fd740a420a5244d55",
  measurementId: "G-FTL1BT7LCP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);