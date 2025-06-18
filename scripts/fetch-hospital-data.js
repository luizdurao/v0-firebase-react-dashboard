// Buscar e processar dados dos hospitais privados por região
const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Hospitais_Privados_por_Regi_o_-_2024-qrEw1JGXqsohqh2s1dXOfQ0m0wrS0s.csv"

async function fetchAndProcessHospitalData() {
  try {
    console.log("Buscando dados do CSV...")
    const response = await fetch(csvUrl)
    const csvText = await response.text()

    console.log("Dados CSV recebidos:")
    console.log(csvText)

    // Processar CSV manualmente
    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    console.log("Cabeçalhos:", headers)

    const data = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
      const row = {}

      headers.forEach((header, index) => {
        let value = values[index] || ""

        // Converter valores numéricos
        if (value && !isNaN(value)) {
          value = Number.parseFloat(value)
        }

        row[header] = value
      })

      data.push(row)
    }

    console.log("Dados processados:", data)

    // Transformar para formato usado no dashboard
    const regionalHospitalData = data.map((row) => ({
      id: row["Região"]?.toLowerCase().replace(/\s+/g, "-") || "",
      name: row["Região"] || "",
      hospitals: Number.parseInt(row["Número de Hospitais"]) || 0,
      hospitalDistribution: Number.parseFloat(row["Distribuição Hospitais (%)"]) || 0,
      beneficiaryDistribution: Number.parseFloat(row["Distribuição Beneficiários Planos (%)"]) || 0,
      nonProfitPercentage: Number.parseFloat(row["Sem Fins Lucrativos (%)"]) || 0,
      forProfitPercentage: Number.parseFloat(row["Com Fins Lucrativos (%)"]) || 0,
      beds: Number.parseInt(row["Número de Leitos"]) || 0,
      bedDistribution: Number.parseFloat(row["Distribuição Leitos (%)"]) || 0,
      bedBeneficiaryDistribution: Number.parseFloat(row["Distribuição Leitos Beneficiários (%)"]) || 0,
      nonProfitBeds: Number.parseFloat(row["Leitos Sem Fins Lucrativos (%)"]) || 0,
      forProfitBeds: Number.parseFloat(row["Leitos Com Fins Lucrativos (%)"]) || 0,
    }))

    console.log("Dados regionais formatados:", regionalHospitalData)

    // Calcular totais
    const totals = {
      totalHospitals: regionalHospitalData.reduce((sum, region) => sum + region.hospitals, 0),
      totalBeds: regionalHospitalData.reduce((sum, region) => sum + region.beds, 0),
      averageNonProfit:
        regionalHospitalData.reduce((sum, region) => sum + region.nonProfitPercentage, 0) / regionalHospitalData.length,
      averageForProfit:
        regionalHospitalData.reduce((sum, region) => sum + region.forProfitPercentage, 0) / regionalHospitalData.length,
    }

    console.log("Totais calculados:", totals)

    return { regionalHospitalData, totals }
  } catch (error) {
    console.error("Erro ao buscar dados:", error)
    throw error
  }
}

// Executar
fetchAndProcessHospitalData()
