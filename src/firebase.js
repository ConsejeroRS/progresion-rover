// ─── FIREBASE CONFIG ────────────────────────────────────────────────────────
// Proyecto: progresionroverg12
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDNRn8JKmSri2y3C8Arv-AuBd13Kc8902A",
  authDomain: "progresionroverg12.firebaseapp.com",
  databaseURL: "https://progresionroverg12-default-rtdb.firebaseio.com",
  projectId: "progresionroverg12",
  storageBucket: "progresionroverg12.firebasestorage.app",
  messagingSenderId: "109731940713",
  appId: "1:109731940713:web:f1c80d57ec21aa74e955f8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);