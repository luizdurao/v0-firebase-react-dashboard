"use client"

import { useEffect, useRef, useState } from "react"
import { Chart, registerables } from "chart.js"
import { ChoroplethController, GeoFeature, ColorScale, ProjectionScale } from "chartjs-chart-geo"
import { Loader2 } from "lucide-react"

// Registrar os componentes necessários do Chart.js
Chart.register(...registerables, ChoroplethController, GeoFeature, ColorScale, ProjectionScale)

// Definição das regiões do Brasil com suas cores
const regions = [
  { id: "north", name: "Norte", color: "#0088FE" },
  { id: "northeast", name: "Nordeste", color: "#00C49F" },
  { id: "central-west", name: "Centro-Oeste", color: "#FFBB28" },
  { id: "southeast", name: "Sudeste", color: "#FF8042" },
  { id: "south", name: "Sul", color: "#8884D8" },
]

// Mapeamento de estados para regiões
const stateToRegion = {
  AC: "north",
  AM: "north",
  AP: "north",
  PA: "north",
  RO: "north",
  RR: "north",
  TO: "north",
  AL: "northeast",
  BA: "northeast",
  CE: "northeast",
  MA: "northeast",
  PB: "northeast",
  PE: "northeast",
  PI: "northeast",
  RN: "northeast",
  SE: "northeast",
  DF: "central-west",
  GO: "central-west",
  MT: "central-west",
  MS: "central-west",
  ES: "southeast",
  MG: "southeast",
  RJ: "southeast",
  SP: "southeast",
  PR: "south",
  RS: "south",
  SC: "south",
}

interface BrazilMapProps {
  selectedRegion: string
  onRegionSelect: (regionId: string) => void
  data: any[]
  activeTab: string
}

const BrazilMapChartJS = ({ selectedRegion, onRegionSelect, data, activeTab }: BrazilMapProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const [loading, setLoading] = useState(true)
  const [geoData, setGeoData] = useState<any>(null)

  // Obter valor para exibir com base na aba ativa
  const getDisplayValue = (regionId) => {
    const regionData = data.find((r) => r.id === regionId)
    if (!regionData) return 0

    switch (activeTab) {
      case "hospitals":
        return regionData.hospitals || regionData.healthMetrics?.hospitals?.total || 0
      case "doctors":
        return regionData.doctors || regionData.healthMetrics?.doctors?.total || 0
      case "beds":
        return regionData.beds || regionData.healthMetrics?.beds?.total || 0
      case "equipment":
        return regionData.medicalEquipment?.mri || 0
      case "access":
        return regionData.urbanAccessIndex || regionData.healthMetrics?.access?.urban || 0
      default:
        return 1 // Valor padrão para visualização
    }
  }

  // Obter título da métrica com base na aba ativa
  const getMetricTitle = () => {
    switch (activeTab) {
      case "hospitals":
        return "Hospitais"
      case "doctors":
        return "Médicos"
      case "beds":
        return "Leitos"
      case "equipment":
        return "Equipamentos"
      case "access":
        return "Acesso (%)"
      default:
        return "Regiões"
    }
  }

  // Carregar dados geográficos do Brasil
  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        // Carregar dados GeoJSON do Brasil
        const response = await fetch(
          "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson",
        )
        const data = await response.json()
        setGeoData(data)
        setLoading(false)
      } catch (error) {
        console.error("Erro ao carregar dados geográficos:", error)
        setLoading(false)
      }
    }

    fetchGeoData()
  }, [])

  // Inicializar e atualizar o gráfico quando os dados ou a seleção mudar
  useEffect(() => {
    if (!chartRef.current || !geoData || loading) return

    // Destruir o gráfico anterior se existir
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Preparar dados para o gráfico
    const chartData = geoData.features.map((feature) => {
      const stateCode = feature.properties.sigla
      const regionId = stateToRegion[stateCode]
      const value = getDisplayValue(regionId)

      return {
        feature: feature,
        value: value,
      }
    })

    // Criar novo gráfico
    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "choropleth",
      data: {
        labels: geoData.features.map((f) => f.properties.name),
        datasets: [
          {
            label: getMetricTitle(),
            data: chartData,
            borderColor: "#FFF",
            borderWidth: 1,
            backgroundColor: (context) => {
              if (!context.raw) return "#CCCCCC"

              const feature = context.raw.feature
              const stateCode = feature.properties.sigla
              const regionId = stateToRegion[stateCode]
              const region = regions.find((r) => r.id === regionId)

              // Verificar se a região está selecionada
              const isSelected = selectedRegion === regionId || selectedRegion === "all"

              // Retornar cor com opacidade baseada na seleção
              return isSelected ? region?.color || "#CCCCCC" : `${region?.color}80` || "#CCCCCC80"
            },
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          projection: {
            axis: "x",
            projection: "mercator",
          },
        },
        plugins: {
          legend: {
            display: true,
            position: "bottom",
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const feature = context.raw.feature
                const stateCode = feature.properties.sigla
                const regionId = stateToRegion[stateCode]
                const region = regions.find((r) => r.id === regionId)
                const regionData = data.find((r) => r.id === regionId)

                if (!regionData) return `${feature.properties.name}: Sem dados`

                const hospitals = regionData.hospitals || regionData.healthMetrics?.hospitals?.total || "N/A"
                const doctors = regionData.doctors || regionData.healthMetrics?.doctors?.total || "N/A"
                const beds = regionData.beds || regionData.healthMetrics?.beds?.total || "N/A"

                return [
                  `Estado: ${feature.properties.name} (${region?.name})`,
                  `Hospitais: ${hospitals}`,
                  `Médicos: ${doctors}`,
                  `Leitos: ${beds}`,
                ]
              },
            },
          },
        },
        onClick: (event, elements) => {
          if (!elements || elements.length === 0) return

          const element = elements[0]
          const feature = element.element.$context.raw.feature
          const stateCode = feature.properties.sigla
          const regionId = stateToRegion[stateCode]

          onRegionSelect(regionId)
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [geoData, data, selectedRegion, activeTab])

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Carregando mapa do Brasil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-white p-4 rounded-lg shadow-sm">
      <div className="aspect-[4/3] w-full">
        <canvas ref={chartRef} />
      </div>
      <div className="mt-4">
        <div className="flex flex-wrap gap-4 justify-center">
          {regions.map((region) => (
            <div
              key={region.id}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => onRegionSelect(region.id)}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  backgroundColor: region.color,
                  opacity: selectedRegion === region.id || selectedRegion === "all" ? 1 : 0.5,
                }}
              />
              <span className={`text-sm ${selectedRegion === region.id ? "font-bold" : ""}`}>{region.name}</span>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-500 text-center mt-4">
          Clique em uma região no mapa ou na legenda para filtrar os dados
        </div>
      </div>
    </div>
  )
}

export default BrazilMapChartJS
