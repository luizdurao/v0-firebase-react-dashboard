// Script para testar a estrutura correta: histórico -> índice sequencial -> leitos -> total

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

async function testEstruturaIndices() {
  try {
    console.log("🔍 TESTANDO ESTRUTURA: histórico -> índice sequencial -> leitos -> total")
    console.log("📋 Índices representam anos do mais antigo para o mais novo")
    console.log("=".repeat(70))

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
    let totalLeitosRecentes = 0
    let totalLeitosAntigos = 0
    let exemploDetalhado = null

    snapshot.forEach((doc) => {
      const hospital = { id: doc.id, ...doc.data() }
      const nome = hospital.nome || hospital.name || `Hospital ${hospital.id}`

      console.log(`🏥 ${nome}`)
      console.log(`   ID: ${hospital.id}`)

      if (hospital.historico) {
        hospitaisComHistorico++
        console.log(`   ✅ Tem histórico`)

        const indices = Object.keys(hospital.historico)
          .map(Number)
          .filter((n) => !isNaN(n))
          .sort((a, b) => a - b) // Do mais antigo para o mais novo

        console.log(`   📋 Índices encontrados: ${indices.join(", ")}`)
        console.log(`   📅 Total de períodos: ${indices.length}`)

        if (indices.length > 0) {
          const indiceAntigo = indices[0]
          const indiceRecente = indices[indices.length - 1]

          console.log(`   📊 Período mais antigo: índice ${indiceAntigo}`)
          console.log(`   📊 Período mais recente: índice ${indiceRecente}`)

          // Testar dados mais antigos
          const dadosAntigos = hospital.historico[indiceAntigo.toString()]
          if (dadosAntigos?.leitos?.total) {
            const leitosAntigos = dadosAntigos.leitos.total
            console.log(`   🛏️ Leitos (mais antigo): ${leitosAntigos}`)
            totalLeitosAntigos += leitosAntigos
          }

          // Testar dados mais recentes
          const dadosRecentes = hospital.historico[indiceRecente.toString()]
          if (dadosRecentes?.leitos?.total) {
            const leitosRecentes = dadosRecentes.leitos.total
            console.log(`   🛏️ Leitos (mais recente): ${leitosRecentes}`)
            totalLeitosRecentes += leitosRecentes
            hospitaisComLeitos++

            // Guardar exemplo detalhado
            if (!exemploDetalhado) {
              exemploDetalhado = {
                hospital: nome,
                id: hospital.id,
                indices: indices,
                dadosAntigos: dadosAntigos.leitos,
                dadosRecentes: dadosRecentes.leitos,
                evolucao: leitosRecentes - (dadosAntigos?.leitos?.total || 0),
              }
            }
          }

          // Mostrar evolução se houver múltiplos períodos
          if (indices.length > 1) {
            console.log(`   📈 Evolução disponível (${indices.length} períodos)`)
            indices.forEach((indice, index) => {
              const dados = hospital.historico[indice.toString()]
              const leitos = dados?.leitos?.total || 0
              const anoEstimado = 2010 + index // Estimativa
              console.log(`      Período ${indice} (~${anoEstimado}): ${leitos} leitos`)
            })
          }
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
    console.log(`📊 Total leitos (mais antigos): ${totalLeitosAntigos.toLocaleString()}`)
    console.log(`📊 Total leitos (mais recentes): ${totalLeitosRecentes.toLocaleString()}`)
    console.log(`📈 Diferença: ${(totalLeitosRecentes - totalLeitosAntigos).toLocaleString()}`)
    console.log("")

    // Exemplo detalhado
    if (exemploDetalhado) {
      console.log("🔍 EXEMPLO DETALHADO DE EVOLUÇÃO")
      console.log("-".repeat(40))
      console.log(`Hospital: ${exemploDetalhado.hospital}`)
      console.log(`ID: ${exemploDetalhado.id}`)
      console.log(`Índices disponíveis: ${exemploDetalhado.indices.join(", ")}`)
      console.log(`Dados mais antigos:`)
      console.log(JSON.stringify(exemploDetalhado.dadosAntigos, null, 2))
      console.log(`Dados mais recentes:`)
      console.log(JSON.stringify(exemploDetalhado.dadosRecentes, null, 2))
      console.log(`Evolução: ${exemploDetalhado.evolucao > 0 ? "+" : ""}${exemploDetalhado.evolucao} leitos`)
      console.log("")
    }

    // Teste das funções atualizadas
    console.log("🧪 TESTE DAS FUNÇÕES ATUALIZADAS")
    console.log("-".repeat(40))

    const getLeitos = (hospital, periodo = "latest") => {
      try {
        if (!hospital.historico) return 0

        const indices = Object.keys(hospital.historico)
          .map(Number)
          .filter((n) => !isNaN(n))
          .sort((a, b) => a - b)

        if (indices.length === 0) return 0

        let indiceEscolhido
        if (periodo === "latest") {
          indiceEscolhido = indices[indices.length - 1]
        } else if (periodo === "oldest") {
          indiceEscolhido = indices[0]
        }

        const dadosPeriodo = hospital.historico[indiceEscolhido.toString()]
        return dadosPeriodo?.leitos?.total || 0
      } catch {
        return 0
      }
    }

    // Testar função com dados reais
    snapshot.forEach((doc) => {
      const hospital = { id: doc.id, ...doc.data() }
      const nome = hospital.nome || hospital.name || `Hospital ${hospital.id}`
      const leitosRecentes = getLeitos(hospital, "latest")
      const leitosAntigos = getLeitos(hospital, "oldest")

      if (leitosRecentes > 0 || leitosAntigos > 0) {
        console.log(`${nome}:`)
        console.log(`  Mais antigo: ${leitosAntigos} leitos`)
        console.log(`  Mais recente: ${leitosRecentes} leitos`)
        if (leitosRecentes !== leitosAntigos) {
          const diferenca = leitosRecentes - leitosAntigos
          console.log(`  Evolução: ${diferenca > 0 ? "+" : ""}${diferenca} leitos`)
        }
      }
    })

    console.log("")
    console.log("✅ TESTE CONCLUÍDO!")
  } catch (error) {
    console.error("❌ Erro no teste:", error)
  }
}

// Executar teste
testEstruturaIndices()
