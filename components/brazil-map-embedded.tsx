"use client"

import { useState } from "react"
import { Tooltip } from "react-tooltip"

// Definição das regiões do Brasil com suas cores
const regions = [
  { id: "north", name: "Norte", color: "#0088FE" },
  { id: "northeast", name: "Nordeste", color: "#00C49F" },
  { id: "central-west", name: "Centro-Oeste", color: "#FFBB28" },
  { id: "southeast", name: "Sudeste", color: "#FF8042" },
  { id: "south", name: "Sul", color: "#8884D8" },
]

// GeoJSON simplificado do Brasil com apenas os contornos das regiões
const brazilGeoJSON = {
  // Coordenadas simplificadas para cada região
  north: "M100,100 L200,80 L250,120 L230,180 L180,220 L120,200 L80,150 Z",
  northeast: "M230,180 L280,150 L320,170 L330,220 L290,250 L250,240 L230,200 Z",
  centralWest: "M180,220 L230,200 L250,240 L240,280 L200,300 L160,280 L150,240 Z",
  southeast: "M240,280 L290,250 L310,280 L300,320 L260,340 L220,320 L200,300 Z",
  south: "M220,320 L260,340 L270,380 L240,400 L200,380 L190,350 Z",
}

interface BrazilMapProps {
  selectedRegion: string
  onRegionSelect: (regionId: string) => void
  data: any[]
  activeTab: string
}

const BrazilMapEmbedded = ({ selectedRegion, onRegionSelect, data, activeTab }: BrazilMapProps) => {
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

  // Posições dos textos para cada região
  const textPositions = {
    north: { x: 150, y: 150 },
    northeast: { x: 280, y: 200 },
    "central-west": { x: 200, y: 260 },
    southeast: { x: 260, y: 300 },
    south: { x: 230, y: 360 },
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="mb-4 text-center text-sm font-medium">Mapa do Brasil - Regiões</div>

      <div className="aspect-[4/3] w-full">
        <svg viewBox="0 0 400 450" className="w-full h-full border border-gray-200 rounded-lg">
          {/* Fundo do mapa */}
          <rect x="0" y="0" width="400" height="450" fill="#f8f9fa" />

          {/* Contorno do Brasil */}
          <path
            d="M80,80 C120,60 180,50 240,60 C300,70 340,100 360,150 
               C380,200 380,260 360,310 C340,360 300,400 240,420 
               C180,440 120,430 80,400 C40,370 20,320 20,260 
               C20,200 40,140 80,80 Z"
            fill="#f0f0f0"
            stroke="#cccccc"
            strokeWidth="1"
          />

          {/* Regiões do Brasil */}
          <path
            d={brazilGeoJSON.north}
            fill={getRegionColor("north")}
            stroke="#FFFFFF"
            strokeWidth="2"
            onClick={() => onRegionSelect("north")}
            onMouseEnter={() => setHoveredRegion("north")}
            onMouseLeave={() => setHoveredRegion(null)}
            data-tooltip-id="tooltip-region"
            data-tooltip-html={generateTooltipContent("north")}
            style={{ cursor: "pointer" }}
          />
          <text
            x={textPositions.north.x}
            y={textPositions.north.y}
            fill="#FFFFFF"
            fontWeight="bold"
            textAnchor="middle"
            fontSize="14"
            pointerEvents="none"
          >
            Norte
          </text>
          <text
            x={textPositions.north.x}
            y={textPositions.north.y + 20}
            fill="#FFFFFF"
            textAnchor="middle"
            fontSize="12"
            pointerEvents="none"
          >
            {formatValue(getDisplayValue("north"), activeTab)}
          </text>

          <path
            d={brazilGeoJSON.northeast}
            fill={getRegionColor("northeast")}
            stroke="#FFFFFF"
            strokeWidth="2"
            onClick={() => onRegionSelect("northeast")}
            onMouseEnter={() => setHoveredRegion("northeast")}
            onMouseLeave={() => setHoveredRegion(null)}
            data-tooltip-id="tooltip-region"
            data-tooltip-html={generateTooltipContent("northeast")}
            style={{ cursor: "pointer" }}
          />
          <text
            x={textPositions.northeast.x}
            y={textPositions.northeast.y}
            fill="#FFFFFF"
            fontWeight="bold"
            textAnchor="middle"
            fontSize="14"
            pointerEvents="none"
          >
            Nordeste
          </text>
          <text
            x={textPositions.northeast.x}
            y={textPositions.northeast.y + 20}
            fill="#FFFFFF"
            textAnchor="middle"
            fontSize="12"
            pointerEvents="none"
          >
            {formatValue(getDisplayValue("northeast"), activeTab)}
          </text>

          <path
            d={brazilGeoJSON.centralWest}
            fill={getRegionColor("central-west")}
            stroke="#FFFFFF"
            strokeWidth="2"
            onClick={() => onRegionSelect("central-west")}
            onMouseEnter={() => setHoveredRegion("central-west")}
            onMouseLeave={() => setHoveredRegion(null)}
            data-tooltip-id="tooltip-region"
            data-tooltip-html={generateTooltipContent("central-west")}
            style={{ cursor: "pointer" }}
          />
          <text
            x={textPositions["central-west"].x}
            y={textPositions["central-west"].y}
            fill="#FFFFFF"
            fontWeight="bold"
            textAnchor="middle"
            fontSize="14"
            pointerEvents="none"
          >
            Centro-Oeste
          </text>
          <text
            x={textPositions["central-west"].x}
            y={textPositions["central-west"].y + 20}
            fill="#FFFFFF"
            textAnchor="middle"
            fontSize="12"
            pointerEvents="none"
          >
            {formatValue(getDisplayValue("central-west"), activeTab)}
          </text>

          <path
            d={brazilGeoJSON.southeast}
            fill={getRegionColor("southeast")}
            stroke="#FFFFFF"
            strokeWidth="2"
            onClick={() => onRegionSelect("southeast")}
            onMouseEnter={() => setHoveredRegion("southeast")}
            onMouseLeave={() => setHoveredRegion(null)}
            data-tooltip-id="tooltip-region"
            data-tooltip-html={generateTooltipContent("southeast")}
            style={{ cursor: "pointer" }}
          />
          <text
            x={textPositions.southeast.x}
            y={textPositions.southeast.y}
            fill="#FFFFFF"
            fontWeight="bold"
            textAnchor="middle"
            fontSize="14"
            pointerEvents="none"
          >
            Sudeste
          </text>
          <text
            x={textPositions.southeast.x}
            y={textPositions.southeast.y + 20}
            fill="#FFFFFF"
            textAnchor="middle"
            fontSize="12"
            pointerEvents="none"
          >
            {formatValue(getDisplayValue("southeast"), activeTab)}
          </text>

          <path
            d={brazilGeoJSON.south}
            fill={getRegionColor("south")}
            stroke="#FFFFFF"
            strokeWidth="2"
            onClick={() => onRegionSelect("south")}
            onMouseEnter={() => setHoveredRegion("south")}
            onMouseLeave={() => setHoveredRegion(null)}
            data-tooltip-id="tooltip-region"
            data-tooltip-html={generateTooltipContent("south")}
            style={{ cursor: "pointer" }}
          />
          <text
            x={textPositions.south.x}
            y={textPositions.south.y}
            fill="#FFFFFF"
            fontWeight="bold"
            textAnchor="middle"
            fontSize="14"
            pointerEvents="none"
          >
            Sul
          </text>
          <text
            x={textPositions.south.x}
            y={textPositions.south.y + 20}
            fill="#FFFFFF"
            textAnchor="middle"
            fontSize="12"
            pointerEvents="none"
          >
            {formatValue(getDisplayValue("south"), activeTab)}
          </text>

          {/* Legenda */}
          <rect x="20" y="380" width="160" height="150" rx="5" fill="white" fillOpacity="0.8" stroke="#ccc" />
          <text x="100" y="400" textAnchor="middle" fontWeight="bold" fontSize="14">
            Legenda
          </text>

          {regions.map((region, index) => (
            <g key={region.id}>
              <rect
                x="40"
                y={420 + index * 20}
                width="16"
                height="16"
                fill={region.color}
                fillOpacity={selectedRegion === region.id || selectedRegion === "all" ? 1 : 0.5}
                rx="3"
                stroke="#fff"
                strokeWidth="1"
                onClick={() => onRegionSelect(region.id)}
                style={{ cursor: "pointer" }}
              />
              <text
                x="65"
                y={432 + index * 20}
                dominantBaseline="middle"
                fontSize="12"
                onClick={() => onRegionSelect(region.id)}
                style={{ cursor: "pointer" }}
                fontWeight={selectedRegion === region.id ? "bold" : "normal"}
              >
                {region.name}
              </text>
            </g>
          ))}
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

export default BrazilMapEmbedded
