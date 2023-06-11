import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  projectId: "",
  measurementId: "",
  messagingSenderId: "",
  storageBucket: "",
  authDomain: "",
  apiKey: "",
  appId: "",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

const db = getFirestore();
const storage = getStorage(app);
var provider = new GoogleAuthProvider();

export { db, auth, provider, storage };
