import { NextResponse } from "next/server"
import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore, collection, getDocs, query } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let app
try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApp()
  }
} catch (e) {
  console.error("Firebase initialization error:", e)
  // Se a inicialização falhar, não podemos prosseguir.
  // Retornar um erro aqui pode ser uma opção, mas GET não será chamado.
}

const db = app ? getFirestore(app) : null

export async function GET() {
  if (!db) {
    console.error("Firestore DB is not initialized.")
    return NextResponse.json({ error: "Erro interno do servidor: DB não inicializado" }, { status: 500 })
  }

  try {
    console.log("API /hospitais: Iniciando busca de dados...")
    const q = query(collection(db, "hospitais"))
    const snap = await getDocs(q)
    console.log(`API /hospitais: ${snap.docs.length} documentos encontrados.`)

    const hospitais = snap.docs.map((doc) => {
      const data = doc.data()
      // Garante que 'historico' seja sempre um array.
      const historico = Array.isArray(data.historico)
        ? data.historico.filter((h) => h && typeof h.ano === "number" && h.leitos && typeof h.leitos.total === "number") // Filtra itens inválidos no histórico
        : []

      return {
        id: doc.id,
        _id: data._id, // Assumindo que _id existe e é o ID numérico original
        nome: data.nome || "Nome Indisponível",
        uf: data.uf || "N/A",
        tipo_unidade: data.tipo_unidade || "N/A",
        vinculo_sus: data.vinculo_sus || "N/A",
        ...data, // Inclui outros campos como cnpj, municipio, dependencia
        historico, // Usa o histórico limpo e garantido como array
      }
    })

    if (hospitais.length > 0) {
      console.log("API /hospitais: Exemplo de hospital processado:", hospitais[0])
    }

    return NextResponse.json(hospitais)
  } catch (err) {
    console.error("API /hospitais error:", err)
    const errorMessage = err instanceof Error ? err.message : "Falha ao consultar hospitais"
    return NextResponse.json({ error: errorMessage, details: String(err) }, { status: 500 })
  }
}
