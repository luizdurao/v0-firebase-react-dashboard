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

interface BrazilMapProps {
  selectedRegion: string
  onRegionSelect: (regionId: string) => void
  data: any[]
  activeTab: string
}

const BrazilMapDetailed = ({ selectedRegion, onRegionSelect, data, activeTab }: BrazilMapProps) => {
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

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="mb-4 text-center text-sm font-medium">Mapa do Brasil - Regiões</div>

      {/* SVG do mapa do Brasil com formato mais detalhado */}
      <div className="flex justify-center">
        <svg
          viewBox="0 0 400 500"
          width="100%"
          height="auto"
          style={{ maxHeight: "500px" }}
          className="border border-gray-200 rounded-lg"
        >
          {/* Norte */}
          <path
            d="M100,50 C130,40 160,35 190,40 C220,45 245,60 260,80 
               C275,100 280,125 275,150 C270,175 255,195 235,210 
               C215,225 190,230 165,225 C140,220 120,205 105,185 
               C90,165 85,140 90,115 C95,90 110,65 135,55 
               C135,55 100,50 100,50 Z"
            fill={getRegionColor("north")}
            stroke="#FFFFFF"
            strokeWidth="2"
            onClick={() => onRegionSelect("north")}
            onMouseEnter={() => setHoveredRegion("north")}
            onMouseLeave={() => setHoveredRegion(null)}
            style={{ cursor: "pointer" }}
          />
          <text x="180" y="130" fill="#FFFFFF" fontWeight="bold" textAnchor="middle" fontSize="16">
            Norte
          </text>
          <text x="180" y="155" fill="#FFFFFF" textAnchor="middle" fontSize="14">
            {formatValue(getDisplayValue("north"), activeTab)}
          </text>

          {/* Nordeste */}
          <path
            d="M235,210 C255,200 275,195 295,200 C315,205 330,220 340,240 
               C350,260 350,285 340,305 C330,325 315,340 295,345 
               C275,350 255,345 235,335 C215,325 205,310 200,290 
               C195,270 200,250 210,235 C210,235 235,210 235,210 Z"
            fill={getRegionColor("northeast")}
            stroke="#FFFFFF"
            strokeWidth="2"
            onClick={() => onRegionSelect("northeast")}
            onMouseEnter={() => setHoveredRegion("northeast")}
            onMouseLeave={() => setHoveredRegion(null)}
            style={{ cursor: "pointer" }}
          />
          <text x="270" y="270" fill="#FFFFFF" fontWeight="bold" textAnchor="middle" fontSize="14">
            Nordeste
          </text>
          <text x="270" y="290" fill="#FFFFFF" textAnchor="middle" fontSize="12">
            {formatValue(getDisplayValue("northeast"), activeTab)}
          </text>

          {/* Centro-Oeste */}
          <path
            d="M165,225 C185,220 205,225 220,235 C235,245 245,260 250,280 
               C255,300 250,320 240,335 C230,350 215,360 195,365 
               C175,370 155,365 140,355 C125,345 115,330 110,310 
               C105,290 110,270 120,255 C130,240 145,230 165,225 Z"
            fill={getRegionColor("central-west")}
            stroke="#FFFFFF"
            strokeWidth="2"
            onClick={() => onRegionSelect("central-west")}
            onMouseEnter={() => setHoveredRegion("central-west")}
            onMouseLeave={() => setHoveredRegion(null)}
            style={{ cursor: "pointer" }}
          />
          <text x="180" y="295" fill="#FFFFFF" fontWeight="bold" textAnchor="middle" fontSize="14">
            Centro-Oeste
          </text>
          <text x="180" y="315" fill="#FFFFFF" textAnchor="middle" fontSize="12">
            {formatValue(getDisplayValue("central-west"), activeTab)}
          </text>

          {/* Sudeste */}
          <path
            d="M195,365 C215,360 235,365 250,375 C265,385 275,400 280,420 
               C285,440 280,460 270,475 C260,490 245,500 225,505 
               C205,510 185,505 170,495 C155,485 145,470 140,450 
               C135,430 140,410 150,395 C160,380 175,370 195,365 Z"
            fill={getRegionColor("southeast")}
            stroke="#FFFFFF"
            strokeWidth="2"
            onClick={() => onRegionSelect("southeast")}
            onMouseEnter={() => setHoveredRegion("southeast")}
            onMouseLeave={() => setHoveredRegion(null)}
            style={{ cursor: "pointer" }}
          />
          <text x="210" y="435" fill="#FFFFFF" fontWeight="bold" textAnchor="middle" fontSize="14">
            Sudeste
          </text>
          <text x="210" y="455" fill="#FFFFFF" textAnchor="middle" fontSize="12">
            {formatValue(getDisplayValue("southeast"), activeTab)}
          </text>

          {/* Sul */}
          <path
            d="M170,495 C180,490 190,490 200,495 C210,500 215,510 215,520 
               C215,530 210,540 200,545 C190,550 180,550 170,545 
               C160,540 155,530 155,520 C155,510 160,500 170,495 Z"
            fill={getRegionColor("south")}
            stroke="#FFFFFF"
            strokeWidth="2"
            onClick={() => onRegionSelect("south")}
            onMouseEnter={() => setHoveredRegion("south")}
            onMouseLeave={() => setHoveredRegion(null)}
            style={{ cursor: "pointer" }}
          />
          <text x="185" y="520" fill="#FFFFFF" fontWeight="bold" textAnchor="middle" fontSize="14">
            Sul
          </text>
          <text x="185" y="540" fill="#FFFFFF" textAnchor="middle" fontSize="12">
            {formatValue(getDisplayValue("south"), activeTab)}
          </text>
        </svg>
      </div>

      {/* Legenda */}
      <div className="mt-4 p-2 bg-gray-50 rounded-md">
        <h3 className="text-sm font-medium mb-2">Legenda</h3>
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
      </div>
    </div>
  )
}

export default BrazilMapDetailed
