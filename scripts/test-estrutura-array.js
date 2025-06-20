// Script para testar a estrutura correta: historico[] com ano e leitos

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

async function testEstruturaArray() {
  try {
    console.log("🔍 TESTANDO ESTRUTURA: historico[] com ano e leitos")
    console.log("📋 Exemplo: { ano: 2010, leitos: { total: 64, cirurgico: 19, ... } }")
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
    let totalLeitos2024 = 0
    let totalLeitos2010 = 0
    let exemploDetalhado = null

    snapshot.forEach((doc) => {
      const hospital = { _id: doc.id, ...doc.data() }
      const nome = hospital.nome || `Hospital ${hospital._id}`

      console.log(`🏥 ${nome}`)
      console.log(`   ID: ${hospital._id}`)
      console.log(`   UF: ${hospital.uf}`)
      console.log(`   Tipo: ${hospital.tipo_unidade}`)
      console.log(`   Vínculo: ${hospital.vinculo_sus}`)

      if (hospital.historico && Array.isArray(hospital.historico)) {
        hospitaisComHistorico++
        console.log(`   ✅ Tem histórico (${hospital.historico.length} registros)`)

        const anos = hospital.historico.map((h) => h.ano).sort((a, b) => a - b)
        console.log(`   📅 Anos disponíveis: ${anos.join(", ")}`)

        // Buscar dados de 2024 e 2010
        const dados2024 = hospital.historico.find((h) => h.ano === 2024)
        const dados2010 = hospital.historico.find((h) => h.ano === 2010)

        if (dados2024?.leitos?.total) {
          const leitos2024 = dados2024.leitos.total
          console.log(`   🛏️ Leitos 2024: ${leitos2024}`)
          totalLeitos2024 += leitos2024
          hospitaisComLeitos++

          // Mostrar detalhes dos tipos de leitos
          console.log(`   📊 Detalhes 2024:`)
          Object.entries(dados2024.leitos).forEach(([tipo, quantidade]) => {
            if (typeof quantidade === "number" && tipo !== "total") {
              console.log(`      ${tipo}: ${quantidade}`)
            }
          })
        }

        if (dados2010?.leitos?.total) {
          const leitos2010 = dados2010.leitos.total
          console.log(`   🛏️ Leitos 2010: ${leitos2010}`)
          totalLeitos2010 += leitos2010

          // Calcular evolução
          if (dados2024?.leitos?.total) {
            const evolucao = dados2024.leitos.total - leitos2010
            console.log(`   📈 Evolução 2010-2024: ${evolucao > 0 ? "+" : ""}${evolucao} leitos`)
          }
        }

        // Guardar exemplo detalhado
        if (!exemploDetalhado && hospital.historico.length > 1) {
          exemploDetalhado = {
            hospital: nome,
            id: hospital._id,
            anos: anos,
            historico: hospital.historico,
            evolucao:
              dados2024?.leitos?.total && dados2010?.leitos?.total
                ? dados2024.leitos.total - dados2010.leitos.total
                : null,
          }
        }
      } else {
        console.log(`   ❌ Não tem histórico ou formato inválido`)
      }

      console.log("")
    })

    // Resumo dos testes
    console.log("📈 RESUMO DOS TESTES")
    console.log("=".repeat(50))
    console.log(`🏥 Hospitais testados: ${snapshot.size}`)
    console.log(`📅 Hospitais com histórico: ${hospitaisComHistorico}`)
    console.log(`🛏️ Hospitais com leitos: ${hospitaisComLeitos}`)
    console.log(`📊 Total leitos 2010: ${totalLeitos2010.toLocaleString()}`)
    console.log(`📊 Total leitos 2024: ${totalLeitos2024.toLocaleString()}`)
    console.log(`📈 Crescimento: ${(totalLeitos2024 - totalLeitos2010).toLocaleString()} leitos`)
    console.log("")

    // Exemplo detalhado
    if (exemploDetalhado) {
      console.log("🔍 EXEMPLO DETALHADO DE EVOLUÇÃO")
      console.log("-".repeat(40))
      console.log(`Hospital: ${exemploDetalhado.hospital}`)
      console.log(`ID: ${exemploDetalhado.id}`)
      console.log(`Anos disponíveis: ${exemploDetalhado.anos.join(", ")}`)
      console.log(`Histórico completo:`)
      exemploDetalhado.historico.forEach((item, index) => {
        console.log(`  ${index + 1}. Ano ${item.ano}: ${item.leitos?.total || 0} leitos`)
        if (item.leitos && typeof item.leitos === "object") {
          Object.entries(item.leitos).forEach(([tipo, qtd]) => {
            if (tipo !== "total" && typeof qtd === "number") {
              console.log(`     ${tipo}: ${qtd}`)
            }
          })
        }
      })
      if (exemploDetalhado.evolucao !== null) {
        console.log(`Evolução total: ${exemploDetalhado.evolucao > 0 ? "+" : ""}${exemploDetalhado.evolucao} leitos`)
      }
      console.log("")
    }

    // Teste das funções atualizadas
    console.log("🧪 TESTE DAS FUNÇÕES ATUALIZADAS")
    console.log("-".repeat(40))

    const getLeitos = (hospital, ano) => {
      try {
        if (!hospital.historico || !Array.isArray(hospital.historico)) return 0

        let dadosAno
        if (ano) {
          dadosAno = hospital.historico.find((h) => h.ano === ano)
        } else {
          const anosOrdenados = hospital.historico.map((h) => h.ano).sort((a, b) => b - a)
          if (anosOrdenados.length === 0) return 0
          dadosAno = hospital.historico.find((h) => h.ano === anosOrdenados[0])
        }

        return dadosAno?.leitos?.total || 0
      } catch {
        return 0
      }
    }

    // Testar função com dados reais
    snapshot.forEach((doc) => {
      const hospital = { _id: doc.id, ...doc.data() }
      const nome = hospital.nome || `Hospital ${hospital._id}`
      const leitos2024 = getLeitos(hospital, 2024)
      const leitos2010 = getLeitos(hospital, 2010)
      const leitosRecente = getLeitos(hospital) // Mais recente

      if (leitos2024 > 0 || leitos2010 > 0 || leitosRecente > 0) {
        console.log(`${nome}:`)
        if (leitos2010 > 0) console.log(`  2010: ${leitos2010} leitos`)
        if (leitos2024 > 0) console.log(`  2024: ${leitos2024} leitos`)
        console.log(`  Mais recente: ${leitosRecente} leitos`)
        if (leitos2024 > 0 && leitos2010 > 0) {
          const diferenca = leitos2024 - leitos2010
          console.log(`  Evolução 2010-2024: ${diferenca > 0 ? "+" : ""}${diferenca} leitos`)
        }
      }
    })

    console.log("")
    console.log("✅ TESTE CONCLUÍDO!")
    console.log("📋 Estrutura confirmada: historico[] com { ano, leitos: { total, tipos... } }")
  } catch (error) {
    console.error("❌ Erro no teste:", error)
  }
}

// Executar teste
testEstruturaArray()
