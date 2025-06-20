// Script para analisar a estrutura dos dados na coleção "hospitais"

import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDHJL2Qxl3pIlUfIzWs7hMdz6KFIrPaBPE",
  authDomain: "projetocnsaude.firebaseapp.com",
  projectId: "projetocnsaude",
  storageBucket: "projetocnsaude.firebasestorage.app",
  messagingSenderId: "814294290260",
  appId: "1:814294290260:web:08bf02614c6bdd2c1102c1",
  measurementId: "G-04EJ1RDZ1W",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function analyzeHospitalData() {
  try {
    console.log("🔍 Analisando dados da coleção 'hospitais'...")

    const snapshot = await getDocs(collection(db, "hospitais"))

    if (snapshot.empty) {
      console.log("❌ A coleção 'hospitais' está vazia ou não existe")
      return
    }

    const documents = snapshot.docs.map((doc) => {
      try {
        return {
          id: doc.id,
          ...doc.data(),
        }
      } catch (err) {
        console.warn(`⚠️  Erro ao processar documento ${doc.id}:`, err)
        return { id: doc.id, error: "Erro ao processar dados" }
      }
    })

    console.log(`\n📊 ANÁLISE DOS DADOS`)
    console.log(`Total de documentos: ${documents.length}`)

    if (documents.length === 0) {
      console.log("❌ Nenhum documento encontrado na coleção 'hospitais'")
      return
    }

    // Analisar estrutura dos campos
    const fieldAnalysis = {}
    documents.forEach((doc) => {
      Object.keys(doc).forEach((field) => {
        if (!fieldAnalysis[field]) {
          fieldAnalysis[field] = {
            count: 0,
            types: new Set(),
            samples: [],
          }
        }
        fieldAnalysis[field].count++
        fieldAnalysis[field].types.add(typeof doc[field])
        if (fieldAnalysis[field].samples.length < 3) {
          fieldAnalysis[field].samples.push(doc[field])
        }
      })
    })

    console.log(`\n📋 CAMPOS ENCONTRADOS:`)
    Object.entries(fieldAnalysis).forEach(([field, info]) => {
      console.log(`\n🔹 ${field}:`)
      console.log(`   Presente em: ${info.count}/${documents.length} documentos`)
      console.log(`   Tipos: ${Array.from(info.types).join(", ")}`)
      console.log(
        `   Exemplos: ${info.samples
          .slice(0, 2)
          .map((s) => (typeof s === "object" ? JSON.stringify(s).substring(0, 50) + "..." : s))
          .join(", ")}`,
      )
    })

    // Verificar se há campo 'type' para categorização
    const hasTypeField = documents.some((doc) => doc.type)
    if (hasTypeField) {
      const typeGroups = {}
      documents.forEach((doc) => {
        const type = doc.type || "sem_tipo"
        typeGroups[type] = (typeGroups[type] || 0) + 1
      })

      console.log(`\n🏷️  TIPOS DE DADOS:`)
      Object.entries(typeGroups).forEach(([type, count]) => {
        console.log(`   ${type}: ${count} documentos`)
      })
    }

    // Mostrar alguns exemplos completos
    console.log(`\n📄 EXEMPLOS DE DOCUMENTOS:`)
    documents.slice(0, 2).forEach((doc, index) => {
      console.log(`\nDocumento ${index + 1}:`)
      console.log(JSON.stringify(doc, null, 2))
    })
  } catch (error) {
    console.error("❌ Erro ao conectar com Firebase:", error)
    console.log("\n🔧 Possíveis soluções:")
    console.log("1. Verifique se as credenciais do Firebase estão corretas")
    console.log("2. Verifique se a coleção 'hospitais' existe")
    console.log("3. Verifique as regras de segurança do Firestore")
  }
}

analyzeHospitalData()
