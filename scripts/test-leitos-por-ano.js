// Script para testar se os leitos aparecem corretamente por ano
// Estrutura esperada: histórico -> ano -> leitos -> total

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

async function testLeitosPorAno() {
  try {
    console.log("🔍 TESTANDO LEITOS POR ANO")
    console.log("=".repeat(50))

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
    const anosEncontrados = new Set()
    const totalLeitosPorAno = {}
    let exemploDetalhado = null

    snapshot.forEach((doc) => {
      const hospital = { id: doc.id, ...doc.data() }
      const nome = hospital.nome || hospital.name || `Hospital ${hospital.id}`

      console.log(`🏥 ${nome}`)
      console.log(`   ID: ${hospital.id}`)

      if (hospital.historico) {
        hospitaisComHistorico++
        console.log(`   ✅ Tem histórico`)

        const anos = Object.keys(hospital.historico)
        console.log(`   📅 Anos disponíveis: ${anos.join(", ")}`)

        anos.forEach((ano) => {
          anosEncontrados.add(ano)
          const dadosAno = hospital.historico[ano]

          console.log(`   📊 Ano ${ano}:`)
          console.log(`      - Dados: ${JSON.stringify(dadosAno, null, 8)}`)

          if (dadosAno.leitos) {
            console.log(`      ✅ Tem dados de leitos`)
            console.log(`      🛏️ Estrutura leitos: ${JSON.stringify(dadosAno.leitos, null, 10)}`)

            if (dadosAno.leitos.total) {
              const totalLeitos = dadosAno.leitos.total
              console.log(`      🎯 Total de leitos: ${totalLeitos}`)

              if (!totalLeitosPorAno[ano]) {
                totalLeitosPorAno[ano] = 0
              }
              totalLeitosPorAno[ano] += totalLeitos

              hospitaisComLeitos++

              // Guardar exemplo detalhado
              if (!exemploDetalhado) {
                exemploDetalhado = {
                  hospital: nome,
                  ano: ano,
                  leitos: dadosAno.leitos,
                  total: totalLeitos,
                }
              }
            } else {
              console.log(`      ❌ Não tem campo 'total' em leitos`)
            }

            // Mostrar outros tipos de leitos
            const outrosLeitos = Object.entries(dadosAno.leitos)
              .filter(([key, value]) => key !== "total" && typeof value === "number")
              .map(([key, value]) => `${key}: ${value}`)

            if (outrosLeitos.length > 0) {
              console.log(`      📋 Outros tipos: ${outrosLeitos.join(", ")}`)
            }
          } else {
            console.log(`      ❌ Não tem dados de leitos`)
          }
        })
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
    console.log(`📊 Anos encontrados: ${Array.from(anosEncontrados).sort().join(", ")}`)
    console.log("")

    // Total de leitos por ano
    console.log("🛏️ TOTAL DE LEITOS POR ANO")
    console.log("-".repeat(30))
    Object.entries(totalLeitosPorAno)
      .sort(([a], [b]) => b.localeCompare(a))
      .forEach(([ano, total]) => {
        console.log(`${ano}: ${total.toLocaleString()} leitos`)
      })
    console.log("")

    // Exemplo detalhado
    if (exemploDetalhado) {
      console.log("🔍 EXEMPLO DETALHADO")
      console.log("-".repeat(30))
      console.log(`Hospital: ${exemploDetalhado.hospital}`)
      console.log(`Ano: ${exemploDetalhado.ano}`)
      console.log(`Total de leitos: ${exemploDetalhado.total}`)
      console.log(`Estrutura completa:`)
      console.log(JSON.stringify(exemploDetalhado.leitos, null, 2))
      console.log("")
    }

    // Teste da função getLeitos
    console.log("🧪 TESTE DA FUNÇÃO getLeitos()")
    console.log("-".repeat(30))

    const getLeitos = (hospital, ano) => {
      try {
        if (!hospital.historico) return 0

        const anoStr = ano
          ? ano.toString()
          : Object.keys(hospital.historico)
              .map(Number)
              .filter((n) => !isNaN(n))
              .sort((a, b) => b - a)[0]
              ?.toString()

        if (!anoStr) return 0

        const dadosAno = hospital.historico[anoStr]
        if (!dadosAno?.leitos) return 0

        return dadosAno.leitos.total || 0
      } catch {
        return 0
      }
    }

    // Testar função com dados reais
    snapshot.forEach((doc) => {
      const hospital = { id: doc.id, ...doc.data() }
      const nome = hospital.nome || hospital.name || `Hospital ${hospital.id}`

      if (hospital.historico) {
        const anos = Object.keys(hospital.historico)
          .map(Number)
          .filter((n) => !isNaN(n))
          .sort((a, b) => b - a)

        anos.forEach((ano) => {
          const leitos = getLeitos(hospital, ano)
          if (leitos > 0) {
            console.log(`${nome} (${ano}): ${leitos} leitos`)
          }
        })
      }
    })

    console.log("")
    console.log("✅ TESTE CONCLUÍDO!")
  } catch (error) {
    console.error("❌ Erro no teste:", error)
  }
}

// Executar teste
testLeitosPorAno()
