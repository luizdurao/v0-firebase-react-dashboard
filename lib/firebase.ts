import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDHJL2Qxl3pIlUfIzWs7hMdz6KFIrPaBPE",
  authDomain: "projetocnsaude.firebaseapp.com",
  projectId: "projetocnsaude",
  storageBucket: "projetocnsaude.firebasestorage.app",
  messagingSenderId: "814294290260",
  appId: "1:814294290260:web:08bf02614c6bdd2c1102c1",
  measurementId: "G-04EJ1RDZ1W",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)
export const auth = getAuth(app)

// Enable offline persistence
import { enableNetwork, disableNetwork } from "firebase/firestore"

export { enableNetwork, disableNetwork }
