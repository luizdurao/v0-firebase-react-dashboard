// Script de diagnóstico completo para identificar problemas com os dados

import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs, limit, query } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

console.log("🔧 DIAGNÓSTICO COMPLETO - DADOS NÃO APARECEM")
console.log("=".repeat(60))

// 1. Verificar variáveis de ambiente
console.log("1️⃣ VERIFICANDO VARIÁVEIS DE AMBIENTE")
console.log("-".repeat(40))
console.log("API_KEY:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✅ Definida" : "❌ Não definida")
console.log("AUTH_DOMAIN:", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "✅ Definida" : "❌ Não definida")
console.log("PROJECT_ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "✅ Definida" : "❌ Não definida")
console.log("STORAGE_BUCKET:", process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "✅ Definida" : "❌ Não definida")
console.log(
  "MESSAGING_SENDER_ID:",
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? "✅ Definida" : "❌ Não definida",
)
console.log("APP_ID:", process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "✅ Definida" : "❌ Não definida")
console.log("")

async function diagnosticarProblema() {
  try {
    // 2. Testar conexão Firebase
    console.log("2️⃣ TESTANDO CONEXÃO FIREBASE")
    console.log("-".repeat(40))

    const app = initializeApp(firebaseConfig)
    console.log("✅ Firebase inicializado com sucesso")

    const db = getFirestore(app)
    console.log("✅ Firestore conectado")
    console.log("")

    // 3. Verificar se a coleção existe
    console.log("3️⃣ VERIFICANDO COLEÇÃO 'hospitais'")
    console.log("-".repeat(40))

    const hospitaisRef = collection(db, "hospitais")
    console.log("✅ Referência da coleção criada")

    // 4. Tentar buscar documentos
    console.log("4️⃣ BUSCANDO DOCUMENTOS")
    console.log("-".repeat(40))

    const snapshot = await getDocs(query(hospitaisRef, limit(5)))
    console.log(`📊 Documentos encontrados: ${snapshot.size}`)

    if (snapshot.empty) {
      console.log("❌ PROBLEMA: Coleção está vazia!")
      console.log("   Possíveis causas:")
      console.log("   - Coleção não existe")
      console.log("   - Regras de segurança bloqueando acesso")
      console.log("   - Projeto Firebase incorreto")
      return
    }

    // 5. Analisar estrutura dos documentos
    console.log("5️⃣ ANALISANDO ESTRUTURA DOS DOCUMENTOS")
    console.log("-".repeat(40))

    let docCount = 0
    snapshot.forEach((doc) => {
      docCount++
      const data = doc.data()

      console.log(`📄 Documento ${docCount}: ${doc.id}`)
      console.log(`   Campos disponíveis: ${Object.keys(data).join(", ")}`)

      // Verificar campos essenciais
      console.log(`   nome: ${data.nome ? "✅" : "❌"} (${data.nome || "N/A"})`)
      console.log(`   UF: ${data.UF ? "✅" : "❌"} (${data.UF || "N/A"})`)
      console.log(`   municipio: ${data.municipio ? "✅" : "❌"} (${data.municipio || "N/A"})`)
      console.log(`   historico: ${data.historico ? "✅" : "❌"}`)

      if (data.historico) {
        const anos = Object.keys(data.historico)
        console.log(`   Anos no histórico: ${anos.join(", ")}`)

        // Verificar primeiro ano
        if (anos.length > 0) {
          const primeiroAno = anos[0]
          const dadosAno = data.historico[primeiroAno]
          console.log(`   Estrutura ${primeiroAno}: ${Object.keys(dadosAno).join(", ")}`)

          if (dadosAno.leitos) {
            console.log(`   Leitos ${primeiroAno}: ${Object.keys(dadosAno.leitos).join(", ")}`)
            console.log(`   Total leitos: ${dadosAno.leitos.total || "N/A"}`)
          } else {
            console.log(`   ❌ Sem dados de leitos em ${primeiroAno}`)
          }
        }
      } else {
        console.log(`   ❌ Sem histórico`)
      }

      console.log("")
    })

    // 6. Testar API endpoint
    console.log("6️⃣ TESTANDO API ENDPOINT")
    console.log("-".repeat(40))

    try {
      const response = await fetch("http://localhost:3000/api/hospitais")
      console.log(`Status da API: ${response.status}`)

      if (response.ok) {
        const apiData = await response.json()
        console.log(`✅ API retornou ${apiData.length} hospitais`)

        if (apiData.length > 0) {
          console.log("📄 Primeiro hospital da API:")
          console.log(JSON.stringify(apiData[0], null, 2))
        }
      } else {
        console.log(`❌ API retornou erro: ${response.statusText}`)
      }
    } catch (apiError) {
      console.log(`❌ Erro ao chamar API: ${apiError.message}`)
      console.log("   Certifique-se de que o servidor está rodando")
    }

    console.log("")
    console.log("7️⃣ RESUMO DO DIAGNÓSTICO")
    console.log("-".repeat(40))
    console.log(`✅ Firebase conectado: Sim`)
    console.log(`✅ Documentos encontrados: ${snapshot.size}`)
    console.log(`✅ Estrutura de dados: ${docCount > 0 ? "Analisada" : "Não disponível"}`)
  } catch (error) {
    console.error("❌ ERRO CRÍTICO:", error)
    console.log("")
    console.log("🔍 POSSÍVEIS SOLUÇÕES:")
    console.log("1. Verificar se as variáveis de ambiente estão corretas")
    console.log("2. Verificar regras de segurança do Firestore")
    console.log("3. Verificar se o projeto Firebase está ativo")
    console.log("4. Verificar conexão com internet")
  }
}

// Executar diagnóstico
diagnosticarProblema()
