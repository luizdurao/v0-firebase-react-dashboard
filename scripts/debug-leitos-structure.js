// Script para analisar a estrutura dos dados de leitos
const admin = require("firebase-admin")

// Inicializar Firebase Admin (se ainda não foi inicializado)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  })
}

const db = admin.firestore()

async function debugLeitosStructure() {
  try {
    console.log("🔍 Analisando estrutura dos dados de leitos...\n")

    const hospitaisRef = db.collection("hospitais")
    const snapshot = await hospitaisRef.limit(5).get()

    if (snapshot.empty) {
      console.log("❌ Nenhum hospital encontrado")
      return
    }

    let hospitalCount = 0

    snapshot.forEach((doc) => {
      hospitalCount++
      const data = doc.data()

      console.log(`\n📋 HOSPITAL ${hospitalCount}: ${data.nome || doc.id}`)
      console.log(`UF: ${data.UF}, Município: ${data.municipio}`)

      if (data.historico) {
        console.log("\n📅 HISTÓRICO DISPONÍVEL:")

        Object.keys(data.historico).forEach((ano) => {
          console.log(`\n  📆 ANO ${ano}:`)
          const dadosAno = data.historico[ano]

          if (dadosAno.leitos) {
            console.log("    🛏️  LEITOS:")
            console.log("    Estrutura completa:", JSON.stringify(dadosAno.leitos, null, 6))

            // Analisar tipos de leitos
            if (typeof dadosAno.leitos === "object") {
              Object.keys(dadosAno.leitos).forEach((tipo) => {
                const valor = dadosAno.leitos[tipo]
                console.log(`      - ${tipo}: ${valor}`)

                if (tipo === "total" && valor === 14) {
                  console.log("        ⭐ ENCONTRADO: total = 14")
                }
              })
            }
          } else {
            console.log("    ❌ Sem dados de leitos")
          }
        })
      } else {
        console.log("❌ Sem histórico disponível")
      }

      console.log("\n" + "=".repeat(80))
    })

    // Análise estatística dos tipos de leitos
    console.log("\n\n📊 ANÁLISE ESTATÍSTICA DOS TIPOS DE LEITOS:")

    const allSnapshot = await hospitaisRef.get()
    const tiposLeitos = new Map()
    let hospitaisComLeitos = 0
    let totalHospitais = 0

    allSnapshot.forEach((doc) => {
      totalHospitais++
      const data = doc.data()

      if (data.historico) {
        Object.keys(data.historico).forEach((ano) => {
          const dadosAno = data.historico[ano]

          if (dadosAno.leitos && typeof dadosAno.leitos === "object") {
            hospitaisComLeitos++

            Object.keys(dadosAno.leitos).forEach((tipo) => {
              if (!tiposLeitos.has(tipo)) {
                tiposLeitos.set(tipo, {
                  count: 0,
                  valores: [],
                  exemplos: [],
                })
              }

              const info = tiposLeitos.get(tipo)
              info.count++
              info.valores.push(dadosAno.leitos[tipo])

              if (info.exemplos.length < 5) {
                info.exemplos.push({
                  hospital: data.nome || doc.id,
                  ano: ano,
                  valor: dadosAno.leitos[tipo],
                })
              }
            })
          }
        })
      }
    })

    console.log(`\nTotal de hospitais: ${totalHospitais}`)
    console.log(`Hospitais com dados de leitos: ${hospitaisComLeitos}`)
    console.log("\nTipos de leitos encontrados:")

    Array.from(tiposLeitos.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .forEach(([tipo, info]) => {
        console.log(`\n🏷️  ${tipo.toUpperCase()}:`)
        console.log(`   Ocorrências: ${info.count}`)
        console.log(`   Valores únicos: ${[...new Set(info.valores)].length}`)
        console.log(`   Exemplos:`, info.exemplos.slice(0, 3))

        if (tipo === "total") {
          const valores = info.valores.filter((v) => typeof v === "number")
          if (valores.length > 0) {
            const min = Math.min(...valores)
            const max = Math.max(...valores)
            const media = valores.reduce((a, b) => a + b, 0) / valores.length
            console.log(`   📈 Estatísticas: Min=${min}, Max=${max}, Média=${Math.round(media)}`)

            // Contar quantos têm total = 14
            const total14 = valores.filter((v) => v === 14).length
            if (total14 > 0) {
              console.log(`   ⭐ Hospitais com total=14: ${total14}`)
            }
          }
        }
      })
  } catch (error) {
    console.error("❌ Erro ao analisar estrutura:", error)
  }
}

// Executar análise
debugLeitosStructure()
