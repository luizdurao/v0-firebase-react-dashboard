"use client"

import { useState } from "react"
import { Tooltip } from "react-tooltip"

// Definição das regiões do Brasil com suas cores
const regions = [
  { id: "north", name: "Norte", color: "#3B82F6" }, // Azul
  { id: "northeast", name: "Nordeste", color: "#34D399" }, // Verde
  { id: "central-west", name: "Centro-Oeste", color: "#FBBF24" }, // Amarelo
  { id: "southeast", name: "Sudeste", color: "#F97316" }, // Laranja
  { id: "south", name: "Sul", color: "#A78BFA" }, // Roxo
]

// Posições e tamanhos das bolhas
const bubblePositions = {
  north: { x: 340, y: 320, size: 280 },
  northeast: { x: 640, y: 600, size: 180 },
  "central-west": { x: 460, y: 750, size: 220 },
  southeast: { x: 590, y: 1040, size: 200 },
  south: { x: 530, y: 1220, size: 160 },
}

interface BrazilBubbleChartProps {
  selectedRegion: string
  onRegionSelect: (regionId: string) => void
  data: any[]
  activeTab: string
}

const BrazilBubbleChart = ({ selectedRegion, onRegionSelect, data, activeTab }: BrazilBubbleChartProps) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)

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
        return 1
    }
  }

  // Obter cor da região com base na seleção e hover
  const getRegionColor = (regionId) => {
    const region = regions.find((r) => r.id === regionId)
    if (!region) return "#cccccc"

    const isSelected = selectedRegion === regionId || selectedRegion === "all"
    const isHovered = hoveredRegion === regionId

    if (isHovered) {
      return region.color // Cor mais intensa no hover
    } else if (isSelected) {
      return region.color
    } else {
      // Versão mais clara da cor quando não selecionada
      return `${region.color}80` // 50% de opacidade
    }
  }

  // Formatar valores para exibição
  const formatValue = (value, type) => {
    if (value === undefined || value === null) return "N/A"

    // Converter para número se for string
    const numValue = typeof value === "string" ? Number.parseFloat(value) : value

    if (isNaN(numValue)) return "N/A"

    if (type === "doctors" || type === "beds") {
      if (numValue >= 1000000) return `${(numValue / 1000000).toFixed(1)}M`
      if (numValue >= 1000) return `${(numValue / 1000).toFixed(1)}k`
      return numValue.toLocaleString()
    }

    if (type === "access") return `${numValue.toFixed(1)}%`

    return numValue.toLocaleString()
  }

  // Gerar conteúdo do tooltip
  const generateTooltipContent = (regionId) => {
    const region = regions.find((r) => r.id === regionId)
    if (!region) return "Dados não disponíveis"

    const regionData = data.find((r) => r.id === regionId)
    if (!regionData) return `${region.name}: Sem dados disponíveis`

    const hospitals = regionData.hospitals || regionData.healthMetrics?.hospitals?.total || "N/A"
    const doctors =
      regionData.doctors?.toLocaleString() || regionData.healthMetrics?.doctors?.total?.toLocaleString() || "N/A"
    const beds = regionData.beds?.toLocaleString() || regionData.healthMetrics?.beds?.total?.toLocaleString() || "N/A"
    const urbanAccess = regionData.urbanAccessIndex || regionData.healthMetrics?.access?.urban || "N/A"
    const ruralAccess = regionData.ruralAccessIndex || regionData.healthMetrics?.access?.rural || "N/A"

    return `
      <div class="p-2">
        <div class="text-lg font-bold mb-1">${region.name}</div>
        <div class="grid grid-cols-2 gap-x-4 gap-y-1">
          <div class="font-medium">Hospitais:</div>
          <div>${hospitals}</div>
          <div class="font-medium">Médicos:</div>
          <div>${doctors}</div>
          <div class="font-medium">Leitos:</div>
          <div>${beds}</div>
          <div class="font-medium">Acesso Urbano:</div>
          <div>${urbanAccess}%</div>
          <div class="font-medium">Acesso Rural:</div>
          <div>${ruralAccess}%</div>
        </div>
      </div>
    `
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="mb-4 text-center text-sm font-medium">Distribuição Regional de Saúde</div>

      <div className="relative w-full" style={{ height: "600px" }}>
        <svg viewBox="0 0 800 1400" className="w-full h-full">
          {/* Círculo tracejado de fundo */}
          <circle
            cx="400"
            cy="700"
            r="650"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
            strokeDasharray="5,5"
            opacity="0.5"
          />

          {/* Legenda */}
          <rect x="30" y="30" width="230" height="180" rx="10" fill="white" stroke="#e5e7eb" strokeWidth="1" />
          <text x="145" y="60" textAnchor="middle" fontWeight="bold" fontSize="18">
            Legenda
          </text>

          {regions.map((region, index) => (
            <g key={region.id}>
              <rect
                x="50"
                y={90 + index * 30}
                width="20"
                height="20"
                fill={region.color}
                rx="4"
                stroke="#fff"
                strokeWidth="1"
              />
              <text x="80" y={105 + index * 30} dominantBaseline="middle" fontSize="16" fontWeight="normal">
                {region.name}
              </text>
            </g>
          ))}

          {/* Bolhas para cada região */}
          {regions.map((region) => {
            const position = bubblePositions[region.id]
            const value = getDisplayValue(region.id)
            const displayValue = formatValue(value, activeTab)

            return (
              <g key={region.id}>
                <circle
                  cx={position.x}
                  cy={position.y}
                  r={position.size}
                  fill={getRegionColor(region.id)}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  onClick={() => onRegionSelect(region.id)}
                  onMouseEnter={() => setHoveredRegion(region.id)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  data-tooltip-id="tooltip-region"
                  data-tooltip-html={generateTooltipContent(region.id)}
                  style={{ cursor: "pointer" }}
                  opacity={selectedRegion === region.id || selectedRegion === "all" ? 1 : 0.8}
                />
                <text
                  x={position.x}
                  y={position.y}
                  fill="#FFFFFF"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontSize="24"
                  pointerEvents="none"
                  className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
                >
                  {region.name}
                </text>
                <text
                  x={position.x}
                  y={position.y + 35}
                  fill="#FFFFFF"
                  textAnchor="middle"
                  fontSize="22"
                  pointerEvents="none"
                  className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
                >
                  {displayValue}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <Tooltip id="tooltip-region" className="z-50" />

      {/* Valores por região */}
      <div className="mt-4 grid grid-cols-5 gap-2">
        {regions.map((region) => {
          const value = getDisplayValue(region.id)
          return (
            <div key={region.id} className="text-center">
              <div
                className="h-2 rounded-full"
                style={{
                  backgroundColor: region.color,
                  opacity: selectedRegion === region.id || selectedRegion === "all" ? 1 : 0.5,
                }}
              ></div>
              <div className="text-xs mt-1">{formatValue(value, activeTab)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BrazilBubbleChart
