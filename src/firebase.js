import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCvviVDDmhtczlcQwLIDUq2iwdmZ4jC6CI",
  authDomain: "hackathon-b5cd5.firebaseapp.com",
  projectId: "hackathon-b5cd5",
  storageBucket: "hackathon-b5cd5.firebasestorage.app",
  messagingSenderId: "824418926341",
  appId: "1:824418926341:web:9ec5eb9562daa2a49f016c",
  measurementId: "G-Y8B309ZF0L"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);