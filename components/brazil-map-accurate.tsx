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

interface BrazilMapProps {
  selectedRegion: string
  onRegionSelect: (regionId: string) => void
  data: any[]
  activeTab: string
}

const BrazilMapAccurate = ({ selectedRegion, onRegionSelect, data, activeTab }: BrazilMapProps) => {
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
    north: { x: 300, y: 180 },
    northeast: { x: 450, y: 220 },
    "central-west": { x: 350, y: 300 },
    southeast: { x: 400, y: 380 },
    south: { x: 350, y: 450 },
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="mb-4 text-center text-sm font-medium">Mapa do Brasil - Regiões</div>

      <div className="aspect-[4/3] w-full">
        <svg viewBox="0 0 600 650" className="w-full h-full border border-gray-200 rounded-lg">
          {/* Fundo do mapa */}
          <rect x="0" y="0" width="600" height="650" fill="#f8f9fa" />

          {/* Norte - Forma mais precisa */}
          <path
            d="M150,100 C200,80 250,70 300,80 C350,90 390,120 410,160 
               C430,200 430,250 410,290 C390,330 350,360 300,370 
               C250,380 200,370 160,340 C120,310 100,260 100,210 
               C100,160 120,120 150,100 Z"
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
            fontSize="18"
            pointerEvents="none"
            className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
          >
            Norte
          </text>
          <text
            x={textPositions.north.x}
            y={textPositions.north.y + 25}
            fill="#FFFFFF"
            textAnchor="middle"
            fontSize="16"
            pointerEvents="none"
            className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
          >
            {formatValue(getDisplayValue("north"), activeTab)}
          </text>

          {/* Nordeste - Forma mais precisa */}
          <path
            d="M410,290 C430,270 450,260 470,270 C490,280 500,300 500,320 
               C500,340 490,360 470,370 C450,380 430,380 410,370 
               C390,360 380,340 380,320 
               C380,300 390,280 410,290 Z"
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
            fontSize="16"
            pointerEvents="none"
            className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
          >
            Nordeste
          </text>
          <text
            x={textPositions.northeast.x}
            y={textPositions.northeast.y + 25}
            fill="#FFFFFF"
            textAnchor="middle"
            fontSize="14"
            pointerEvents="none"
            className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
          >
            {formatValue(getDisplayValue("northeast"), activeTab)}
          </text>

          {/* Centro-Oeste - Forma mais precisa */}
          <path
            d="M300,370 C330,360 360,360 380,370 C400,380 410,400 410,420 
               C410,440 400,460 380,470 C360,480 330,480 300,470 
               C270,460 250,440 240,420 C230,400 230,380 240,370 
               C250,360 270,360 300,370 Z"
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
            fontSize="16"
            pointerEvents="none"
            className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
          >
            Centro-Oeste
          </text>
          <text
            x={textPositions["central-west"].x}
            y={textPositions["central-west"].y + 25}
            fill="#FFFFFF"
            textAnchor="middle"
            fontSize="14"
            pointerEvents="none"
            className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
          >
            {formatValue(getDisplayValue("central-west"), activeTab)}
          </text>

          {/* Sudeste - Forma mais precisa */}
          <path
            d="M380,470 C400,460 420,460 440,470 C460,480 470,500 470,520 
               C470,540 460,560 440,570 C420,580 400,580 380,570 
               C360,560 350,540 350,520 C350,500 360,480 380,470 Z"
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
            fontSize="16"
            pointerEvents="none"
            className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
          >
            Sudeste
          </text>
          <text
            x={textPositions.southeast.x}
            y={textPositions.southeast.y + 25}
            fill="#FFFFFF"
            textAnchor="middle"
            fontSize="14"
            pointerEvents="none"
            className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
          >
            {formatValue(getDisplayValue("southeast"), activeTab)}
          </text>

          {/* Sul - Forma mais precisa */}
          <path
            d="M350,520 C365,510 380,510 395,520 C410,530 420,545 420,560 
               C420,575 410,590 395,600 C380,610 365,610 350,600 
               C335,590 325,575 325,560 C325,545 335,530 350,520 Z"
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
            fontSize="16"
            pointerEvents="none"
            className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
          >
            Sul
          </text>
          <text
            x={textPositions.south.x}
            y={textPositions.south.y + 25}
            fill="#FFFFFF"
            textAnchor="middle"
            fontSize="14"
            pointerEvents="none"
            className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
          >
            {formatValue(getDisplayValue("south"), activeTab)}
          </text>

          {/* Legenda */}
          <rect x="20" y="520" width="160" height="120" rx="5" fill="white" fillOpacity="0.9" stroke="#ccc" />
          <text x="100" y="540" textAnchor="middle" fontWeight="bold" fontSize="14">
            Legenda
          </text>

          {regions.map((region, index) => (
            <g key={region.id}>
              <rect
                x="40"
                y={560 + index * 20}
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
                y={572 + index * 20}
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

export default BrazilMapAccurate
