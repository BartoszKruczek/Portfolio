import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDF7FcmiuKOXmND2ymjvRW565I00gQvA3A",
  authDomain: "my-shop-a087e.firebaseapp.com",
  projectId: "my-shop-a087e",
  storageBucket: "my-shop-a087e.firebasestorage.app",
  messagingSenderId: "562177672144",
  appId: "1:562177672144:web:a7031ce23c660c0f2fefd5",
  measurementId: "G-K5DP6YDLKZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);