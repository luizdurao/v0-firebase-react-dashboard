import { NextResponse } from "next/server"
import { initializeApp, getApps, getApp } from "firebase/app" // getApp para evitar reinicialização
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Garante que o Firebase seja inicializado apenas uma vez
let app
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApp()
}

const db = getFirestore(app)

export async function GET() {
  try {
    const q = query(collection(db, "hospitais"), orderBy("nome", "asc"))
    const snap = await getDocs(q)

    const hospitais = snap.docs.map((doc) => {
      const data = doc.data()
      // Validação básica do histórico
      const historico = Array.isArray(data.historico)
        ? data.historico.filter((h) => h && typeof h.ano === "number" && h.leitos && typeof h.leitos.total === "number")
        : []

      return {
        id: doc.id,
        _id: data._id,
        nome: data.nome || "Nome Indisponível",
        uf: data.uf || "N/A",
        municipio: data.municipio || "N/A", // Ainda pode ser retornado pela API
        tipo_unidade: data.tipo_unidade || "N/A",
        vinculo_sus: data.vinculo_sus || "N/A",
        ...data,
        historico,
      }
    })

    return NextResponse.json(hospitais)
  } catch (err) {
    console.error("API /hospitais error:", err)
    const errorMessage = err instanceof Error ? err.message : "Falha ao consultar hospitais"
    return NextResponse.json({ error: errorMessage, details: String(err) }, { status: 500 })
  }
}
