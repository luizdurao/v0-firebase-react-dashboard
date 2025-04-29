"use client"

import { useState } from "react"

// Definição das regiões do Brasil com suas cores
const regions = [
  { id: "north", name: "Norte", color: "#0088FE" },
  { id: "northeast", name: "Nordeste", color: "#00C49F" },
  { id: "central-west", name: "Centro-Oeste", color: "#FFBB28" },
  { id: "southeast", name: "Sudeste", color: "#FF8042" },
  { id: "south", name: "Sul", color: "#8884D8" },
]

// Mapeamento simplificado de estados para regiões
const stateToRegion = {
  // Norte
  AC: "north",
  AM: "north",
  AP: "north",
  PA: "north",
  RO: "north",
  RR: "north",
  TO: "north",
  // Nordeste
  AL: "northeast",
  BA: "northeast",
  CE: "northeast",
  MA: "northeast",
  PB: "northeast",
  PE: "northeast",
  PI: "northeast",
  RN: "northeast",
  SE: "northeast",
  // Centro-Oeste
  DF: "central-west",
  GO: "central-west",
  MT: "central-west",
  MS: "central-west",
  // Sudeste
  ES: "southeast",
  MG: "southeast",
  RJ: "southeast",
  SP: "southeast",
  // Sul
  PR: "south",
  RS: "south",
  SC: "south",
}

// Coordenadas simplificadas dos estados para o SVG
const stateCoordinates = {
  AC: { x: 100, y: 200, width: 40, height: 30, label: { x: 120, y: 215 } },
  AM: { x: 150, y: 150, width: 80, height: 70, label: { x: 190, y: 185 } },
  AP: { x: 250, y: 120, width: 30, height: 30, label: { x: 265, y: 135 } },
  PA: { x: 280, y: 170, width: 70, height: 60, label: { x: 315, y: 200 } },
  RO: { x: 180, y: 230, width: 40, height: 40, label: { x: 200, y: 250 } },
  RR: { x: 180, y: 100, width: 40, height: 40, label: { x: 200, y: 120 } },
  TO: { x: 280, y: 240, width: 30, height: 50, label: { x: 295, y: 265 } },

  AL: { x: 400, y: 220, width: 20, height: 20, label: { x: 410, y: 230 } },
  BA: { x: 350, y: 230, width: 50, height: 60, label: { x: 375, y: 260 } },
  CE: { x: 380, y: 180, width: 30, height: 30, label: { x: 395, y: 195 } },
  MA: { x: 320, y: 190, width: 40, height: 40, label: { x: 340, y: 210 } },
  PB: { x: 410, y: 200, width: 20, height: 20, label: { x: 420, y: 210 } },
  PE: { x: 390, y: 210, width: 30, height: 20, label: { x: 405, y: 220 } },
  PI: { x: 340, y: 200, width: 30, height: 40, label: { x: 355, y: 220 } },
  RN: { x: 410, y: 180, width: 20, height: 20, label: { x: 420, y: 190 } },
  SE: { x: 400, y: 240, width: 15, height: 15, label: { x: 407, y: 247 } },

  DF: { x: 300, y: 280, width: 15, height: 15, label: { x: 307, y: 287 } },
  GO: { x: 280, y: 290, width: 40, height: 40, label: { x: 300, y: 310 } },
  MT: { x: 230, y: 270, width: 50, height: 50, label: { x: 255, y: 295 } },
  MS: { x: 230, y: 330, width: 40, height: 40, label: { x: 250, y: 350 } },

  ES: { x: 360, y: 310, width: 20, height: 30, label: { x: 370, y: 325 } },
  MG: { x: 320, y: 310, width: 50, height: 50, label: { x: 345, y: 335 } },
  RJ: { x: 350, y: 350, width: 30, height: 20, label: { x: 365, y: 360 } },
  SP: { x: 280, y: 350, width: 50, height: 40, label: { x: 305, y: 370 } },

  PR: { x: 260, y: 390, width: 40, height: 30, label: { x: 280, y: 405 } },
  RS: { x: 240, y: 450, width: 50, height: 40, label: { x: 265, y: 470 } },
  SC: { x: 260, y: 420, width: 40, height: 30, label: { x: 280, y: 435 } },
}

interface BrazilMapProps {
  selectedRegion: string
  onRegionSelect: (regionId: string) => void
  data: any[]
  activeTab: string
}

const BrazilMapSimple = ({ selectedRegion, onRegionSelect, data, activeTab }: BrazilMapProps) => {
  const [hoveredState, setHoveredState] = useState<string | null>(null)

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

  // Obter cor do estado com base na região
  const getStateColor = (stateCode) => {
    const regionId = stateToRegion[stateCode]
    if (!regionId) return "#cccccc"

    const region = regions.find((r) => r.id === regionId)
    if (!region) return "#cccccc"

    const isSelected = selectedRegion === regionId || selectedRegion === "all"
    const isHovered = hoveredState === stateCode

    if (isHovered) {
      return region.color // Cor completa quando hover
    }

    return isSelected ? region.color : `${region.color}80` // 50% de opacidade se não selecionado
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

  // Gerar tooltip para o estado
  const generateTooltip = (stateCode) => {
    const regionId = stateToRegion[stateCode]
    if (!regionId) return `${stateCode}: Região não mapeada`

    const region = regions.find((r) => r.id === regionId)
    const regionData = data.find((r) => r.id === regionId)

    if (!regionData) return `${stateCode}: Sem dados disponíveis`

    const value = getDisplayValue(regionId)
    const formattedValue = formatValue(value, activeTab)

    return `${stateCode} (${region?.name}): ${formattedValue}`
  }

  // Renderizar legenda de cores
  const renderColorLegend = () => {
    return (
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
    )
  }

  return (
    <div className="relative bg-white p-4 rounded-lg shadow-sm">
      <div className="aspect-[4/3] w-full bg-gray-50 rounded-lg overflow-hidden">
        <svg viewBox="0 0 500 500" className="w-full h-full">
          {/* Renderizar cada estado como um retângulo arredondado */}
          {Object.entries(stateCoordinates).map(([stateCode, coords]) => {
            const regionId = stateToRegion[stateCode]
            const isSelected = selectedRegion === regionId || selectedRegion === "all"

            return (
              <g key={stateCode}>
                <rect
                  x={coords.x}
                  y={coords.y}
                  width={coords.width}
                  height={coords.height}
                  rx={8}
                  ry={8}
                  fill={getStateColor(stateCode)}
                  stroke="#FFFFFF"
                  strokeWidth={1}
                  onClick={() => onRegionSelect(stateToRegion[stateCode])}
                  onMouseEnter={() => setHoveredState(stateCode)}
                  onMouseLeave={() => setHoveredState(null)}
                  className="cursor-pointer"
                  data-tooltip-content={generateTooltip(stateCode)}
                />
                <text
                  x={coords.label.x}
                  y={coords.label.y}
                  textAnchor="middle"
                  fill="#000000"
                  fontSize={10}
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {stateCode}
                </text>

                {/* Mostrar valor se o estado estiver selecionado */}
                {isSelected && (
                  <text
                    x={coords.label.x}
                    y={coords.label.y + 12}
                    textAnchor="middle"
                    fill="#000000"
                    fontSize={9}
                    fontWeight="bold"
                    pointerEvents="none"
                    style={{
                      textShadow: "0px 0px 2px white, 0px 0px 2px white, 0px 0px 2px white",
                    }}
                  >
                    {formatValue(getDisplayValue(regionId), activeTab)}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {renderColorLegend()}

      <div className="mt-4 p-2 bg-gray-50 rounded-md">
        <h3 className="text-sm font-medium mb-2">{getMetricTitle()}</h3>
        <div className="grid grid-cols-5 gap-2">
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
    </div>
  )
}

export default BrazilMapSimple
