import { NextResponse } from "next/server"
import { initializeApp, getApps } from "firebase/app"
import { getFirestore, collection, getDocs, orderBy, query } from "firebase/firestore"

// -- Inicializa Firebase também no ambiente "server"
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

if (getApps().length === 0) {
  initializeApp(firebaseConfig)
}

const db = getFirestore()

export async function GET() {
  try {
    const snap = await getDocs(query(collection(db, "hospitais"), orderBy("nome", "asc")))

    const hospitais = snap.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
      }
    })

    return NextResponse.json(hospitais)
  } catch (err) {
    console.error("API /hospitais error:", err)
    return NextResponse.json({ error: "Falha ao consultar hospitais" }, { status: 500 })
  }
}
