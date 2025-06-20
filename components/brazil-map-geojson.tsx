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

// Contornos SVG mais precisos para cada região do Brasil
const brazilPaths = {
  // Norte - Forma mais precisa da região Norte do Brasil
  north:
    "M120,100 C160,80 200,70 240,80 C280,90 310,110 330,140 C350,170 360,210 350,250 C340,290 320,320 290,340 C260,360 220,370 180,360 C140,350 110,330 90,300 C70,270 60,230 70,190 C80,150 100,120 120,100 Z",

  // Nordeste - Forma mais precisa da região Nordeste do Brasil
  northeast:
    "M350,250 C370,240 390,240 410,250 C430,260 445,280 455,305 C465,330 465,355 455,380 C445,405 425,425 400,435 C375,445 350,445 325,435 C300,425 280,405 270,380 C260,355 260,330 270,305 C280,280 295,260 315,250 C325,245 335,245 350,250 Z",

  // Centro-Oeste - Forma mais precisa da região Centro-Oeste do Brasil
  centralWest:
    "M270,380 C290,370 310,370 330,380 C350,390 365,410 375,435 C385,460 385,485 375,510 C365,535 345,555 320,565 C295,575 270,575 245,565 C220,555 200,535 190,510 C180,485 180,460 190,435 C200,410 215,390 235,380 C245,375 255,375 270,380 Z",

  // Sudeste - Forma mais precisa da região Sudeste do Brasil
  southeast:
    "M320,565 C340,555 360,555 380,565 C400,575 415,595 425,620 C435,645 435,675 425,700 C415,725 400,745 380,755 C360,765 340,765 320,755 C300,745 285,725 275,700 C265,675 265,645 275,620 C285,595 300,575 320,565 Z",

  // Sul - Forma mais precisa da região Sul do Brasil
  south:
    "M275,700 C290,690 305,690 320,700 C335,710 345,725 350,745 C355,765 355,785 350,805 C345,825 335,840 320,850 C305,860 290,860 275,850 C260,840 250,825 245,805 C240,785 240,765 245,745 C250,725 260,710 275,700 Z",
}

interface BrazilMapProps {
  selectedRegion: string
  onRegionSelect: (regionId: string) => void
  data: any[]
  activeTab: string
}

const BrazilMapGeoJSON = ({ selectedRegion, onRegionSelect, data, activeTab }: BrazilMapProps) => {
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
    north: { x: 210, y: 200 },
    northeast: { x: 380, y: 320 },
    "central-west": { x: 280, y: 470 },
    southeast: { x: 350, y: 660 },
    south: { x: 300, y: 780 },
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="mb-4 text-center text-sm font-medium">Mapa do Brasil - Regiões</div>

      <div className="aspect-[3/4] w-full">
        <svg viewBox="0 0 600 1000" className="w-full h-full border border-gray-200 rounded-lg">
          {/* Fundo do mapa */}
          <rect x="0" y="0" width="600" height="1000" fill="#f8f9fa" />

          {/* Contorno do Brasil */}
          <path
            d="M60,220 C80,160 120,110 180,70 C240,30 320,10 400,20 C480,30 550,70 590,130 
               C630,190 650,270 640,350 C630,430 590,500 530,550 C570,600 590,670 590,740 
               C590,810 570,880 530,930 C490,980 430,1010 370,1020 C310,1030 250,1020 200,990 
               C150,960 110,910 90,850 C70,790 70,720 90,660 C110,600 150,550 200,520 
               C150,490 110,440 90,380 C70,320 70,250 90,190 C90,190 60,220 60,220 Z"
            fill="none"
            stroke="#cccccc"
            strokeWidth="1"
            strokeDasharray="5,5"
          />

          {/* Norte */}
          <path
            d={brazilPaths.north}
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
            fontSize="20"
            pointerEvents="none"
            className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
          >
            Norte
          </text>
          <text
            x={textPositions.north.x}
            y={textPositions.north.y + 30}
            fill="#FFFFFF"
            textAnchor="middle"
            fontSize="18"
            pointerEvents="none"
            className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
          >
            {formatValue(getDisplayValue("north"), activeTab)}
          </text>

          {/* Nordeste */}
          <path
            d={brazilPaths.northeast}
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
            fontSize="18"
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
            fontSize="16"
            pointerEvents="none"
            className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
          >
            {formatValue(getDisplayValue("northeast"), activeTab)}
          </text>

          {/* Centro-Oeste */}
          <path
            d={brazilPaths.centralWest}
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
            fontSize="18"
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
            fontSize="16"
            pointerEvents="none"
            className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
          >
            {formatValue(getDisplayValue("central-west"), activeTab)}
          </text>

          {/* Sudeste */}
          <path
            d={brazilPaths.southeast}
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
            fontSize="18"
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
            fontSize="16"
            pointerEvents="none"
            className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
          >
            {formatValue(getDisplayValue("southeast"), activeTab)}
          </text>

          {/* Sul */}
          <path
            d={brazilPaths.south}
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
            fontSize="18"
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
            fontSize="16"
            pointerEvents="none"
            className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
          >
            {formatValue(getDisplayValue("south"), activeTab)}
          </text>

          {/* Legenda */}
          <rect x="20" y="20" width="160" height="120" rx="5" fill="white" fillOpacity="0.9" stroke="#ccc" />
          <text x="100" y="40" textAnchor="middle" fontWeight="bold" fontSize="14">
            Legenda
          </text>

          {regions.map((region, index) => (
            <g key={region.id}>
              <rect
                x="40"
                y={60 + index * 20}
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
                y={72 + index * 20}
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

export default BrazilMapGeoJSON
