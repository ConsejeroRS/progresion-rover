import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCW2tYoUd-OuCpBDFsKkD5rPKNXofCZvo0",
  authDomain: "progresion-rover-g12.firebaseapp.com",
  projectId: "progresion-rover-g12",
  storageBucket: "progresion-rover-g12.firebasestorage.app",
  messagingSenderId: "220386285941",
  appId: "1:220386285941:web:9866d96e3e83f372ca9b3c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
