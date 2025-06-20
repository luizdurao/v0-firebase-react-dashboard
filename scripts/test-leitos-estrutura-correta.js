// Script para testar a estrutura correta: histórico -> id -> leitos -> total

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

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function testEstruturaCorreta() {
  try {
    console.log("🔍 TESTANDO ESTRUTURA CORRETA: histórico -> id -> leitos -> total")
    console.log("=".repeat(60))

    // Buscar alguns hospitais para teste
    const hospitaisRef = collection(db, "hospitais")
    const q = query(hospitaisRef, limit(10))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      console.log("❌ Nenhum hospital encontrado na coleção")
      return
    }

    console.log(`📊 Testando ${snapshot.size} hospitais...`)
    console.log("")

    let hospitaisComHistorico = 0
    let hospitaisComLeitos = 0
    let totalLeitos = 0
    let exemploDetalhado = null

    snapshot.forEach((doc) => {
      const hospital = { id: doc.id, ...doc.data() }
      const nome = hospital.nome || hospital.name || `Hospital ${hospital.id}`

      console.log(`🏥 ${nome}`)
      console.log(`   ID: ${hospital.id}`)

      if (hospital.historico) {
        hospitaisComHistorico++
        console.log(`   ✅ Tem histórico`)

        const idsNoHistorico = Object.keys(hospital.historico)
        console.log(`   📋 IDs no histórico: ${idsNoHistorico.join(", ")}`)

        // Verificar se o próprio ID do hospital está no histórico
        if (hospital.historico[hospital.id]) {
          console.log(`   ✅ Encontrou dados para o próprio ID (${hospital.id})`)

          const dadosHospital = hospital.historico[hospital.id]
          console.log(`   📊 Estrutura dos dados: ${Object.keys(dadosHospital).join(", ")}`)

          if (dadosHospital.leitos) {
            console.log(`   ✅ Tem dados de leitos`)
            console.log(`   🛏️ Estrutura leitos: ${JSON.stringify(dadosHospital.leitos, null, 4)}`)

            if (dadosHospital.leitos.total) {
              const leitosTotal = dadosHospital.leitos.total
              console.log(`   🎯 Total de leitos: ${leitosTotal}`)

              hospitaisComLeitos++
              totalLeitos += leitosTotal

              // Guardar exemplo detalhado
              if (!exemploDetalhado) {
                exemploDetalhado = {
                  hospital: nome,
                  id: hospital.id,
                  leitos: dadosHospital.leitos,
                  total: leitosTotal,
                }
              }
            } else {
              console.log(`   ❌ Não tem campo 'total' em leitos`)
            }

            // Mostrar outros tipos de leitos
            const outrosLeitos = Object.entries(dadosHospital.leitos)
              .filter(([key, value]) => key !== "total" && typeof value === "number")
              .map(([key, value]) => `${key}: ${value}`)

            if (outrosLeitos.length > 0) {
              console.log(`   📋 Outros tipos: ${outrosLeitos.join(", ")}`)
            }
          } else {
            console.log(`   ❌ Não tem dados de leitos para o ID ${hospital.id}`)
          }
        } else {
          console.log(`   ❌ Não encontrou dados para o próprio ID (${hospital.id})`)
          console.log(`   📋 IDs disponíveis: ${idsNoHistorico.join(", ")}`)
        }
      } else {
        console.log(`   ❌ Não tem histórico`)
      }

      console.log("")
    })

    // Resumo dos testes
    console.log("📈 RESUMO DOS TESTES")
    console.log("=".repeat(50))
    console.log(`🏥 Hospitais testados: ${snapshot.size}`)
    console.log(`📅 Hospitais com histórico: ${hospitaisComHistorico}`)
    console.log(`🛏️ Hospitais com leitos: ${hospitaisComLeitos}`)
    console.log(`📊 Total de leitos encontrados: ${totalLeitos.toLocaleString()}`)
    console.log("")

    // Exemplo detalhado
    if (exemploDetalhado) {
      console.log("🔍 EXEMPLO DETALHADO")
      console.log("-".repeat(30))
      console.log(`Hospital: ${exemploDetalhado.hospital}`)
      console.log(`ID: ${exemploDetalhado.id}`)
      console.log(`Total de leitos: ${exemploDetalhado.total}`)
      console.log(`Estrutura completa:`)
      console.log(JSON.stringify(exemploDetalhado.leitos, null, 2))
      console.log("")
    }

    // Teste da função getLeitos atualizada
    console.log("🧪 TESTE DA FUNÇÃO getLeitos() ATUALIZADA")
    console.log("-".repeat(40))

    const getLeitos = (hospital) => {
      try {
        if (!hospital.historico) return 0

        const dadosHospital = hospital.historico[hospital.id]
        if (!dadosHospital?.leitos) return 0

        return dadosHospital.leitos.total || 0
      } catch {
        return 0
      }
    }

    // Testar função com dados reais
    snapshot.forEach((doc) => {
      const hospital = { id: doc.id, ...doc.data() }
      const nome = hospital.nome || hospital.name || `Hospital ${hospital.id}`
      const leitos = getLeitos(hospital)

      if (leitos > 0) {
        console.log(`${nome}: ${leitos} leitos`)
      }
    })

    console.log("")
    console.log("✅ TESTE CONCLUÍDO!")
  } catch (error) {
    console.error("❌ Erro no teste:", error)
  }
}

// Executar teste
testEstruturaCorreta()
