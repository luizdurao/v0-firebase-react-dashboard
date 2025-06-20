import { initializeApp, getApps } from "firebase/app"
import { getFirestore, collection, getDocs, limit, query } from "firebase/firestore"

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDHJL2Qxl3pIlUfIzWs7hMdz6KFIrPaBPE",
  authDomain: "projetocnsaude.firebaseapp.com",
  projectId: "projetocnsaude",
  storageBucket: "projetocnsaude.firebasestorage.app",
  messagingSenderId: "814294290260",
  appId: "1:814294290260:web:08bf02614c6bdd2c1102c1",
  measurementId: "G-04EJ1RDZ1W",
}

if (getApps().length === 0) {
  initializeApp(firebaseConfig)
}

const db = getFirestore()

async function debugHospitalData() {
  try {
    console.log("🔍 Analisando dados da coleção 'hospitais'...")

    // Buscar alguns documentos para análise
    const snap = await getDocs(query(collection(db, "hospitais"), limit(3)))

    if (snap.empty) {
      console.log("❌ Nenhum documento encontrado na coleção 'hospitais'")
      return
    }

    console.log(`✅ Encontrados ${snap.size} documentos para análise`)

    snap.docs.forEach((doc, index) => {
      console.log(`\n📄 Documento ${index + 1} (ID: ${doc.id}):`)
      const data = doc.data()

      // Mostrar estrutura do documento
      console.log("Campos disponíveis:", Object.keys(data))

      // Mostrar alguns campos importantes
      console.log("Nome:", data.nome || "❌ Campo 'nome' não encontrado")
      console.log("UF:", data.UF || "❌ Campo 'UF' não encontrado")
      console.log("Município:", data.municipio || "❌ Campo 'municipio' não encontrado")
      console.log("Tipo Unidade:", data.tipo_unidade || "❌ Campo 'tipo_unidade' não encontrado")
      console.log("Vínculo SUS:", data.vinculo_sus || "❌ Campo 'vinculo_sus' não encontrado")

      // Verificar dados_agrupados
      if (data.dados_agrupados) {
        console.log("Dados Agrupados:", data.dados_agrupados)
        console.log("Total Leitos:", data.dados_agrupados.total_leitos || "❌ Campo 'total_leitos' não encontrado")
      } else {
        console.log("❌ Campo 'dados_agrupados' não encontrado")
      }

      // Mostrar estrutura completa do primeiro documento
      if (index === 0) {
        console.log("\n📋 Estrutura completa do primeiro documento:")
        console.log(JSON.stringify(data, null, 2))
      }
    })
  } catch (error) {
    console.error("❌ Erro ao analisar dados:", error)
  }
}

// Executar análise
debugHospitalData()
