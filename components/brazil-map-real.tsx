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

const BrazilMapReal = ({ selectedRegion, onRegionSelect, data, activeTab }: BrazilMapProps) => {
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

      {/* SVG do mapa do Brasil com formato mais realista */}
      <div className="flex justify-center">
        <svg
          viewBox="0 0 300 400"
          width="100%"
          height="auto"
          style={{ maxHeight: "500px" }}
          className="border border-gray-200 rounded-lg"
        >
          {/* Contorno do Brasil */}
          <path
            d="M150,30 C170,30 190,35 205,45 C220,55 230,70 235,85 
               C240,100 240,115 235,130 C230,145 220,155 210,165 
               C220,170 230,180 235,195 C240,210 240,225 235,240 
               C230,255 220,265 210,270 C220,275 225,285 225,295 
               C225,305 220,315 210,320 C200,325 190,325 180,320 
               C175,330 165,335 155,335 C145,335 135,330 130,320 
               C120,325 110,325 100,320 C90,315 85,305 85,295 
               C85,285 90,275 100,270 C90,265 80,255 75,240 
               C70,225 70,210 75,195 C80,180 90,170 100,165 
               C90,155 80,145 75,130 C70,115 70,100 75,85 
               C80,70 90,55 105,45 C120,35 135,30 150,30 Z"
            fill="#f0f0f0"
            stroke="#cccccc"
            strokeWidth="1"
          />

          {/* Norte */}
          <path
            d="M150,50 C165,50 180,55 190,65 C200,75 205,90 205,105 
               C205,120 200,135 190,145 C180,155 165,160 150,160 
               C135,160 120,155 110,145 C100,135 95,120 95,105 
               C95,90 100,75 110,65 C120,55 135,50 150,50 Z"
            fill={getRegionColor("north")}
            stroke="#FFFFFF"
            strokeWidth="2"
            onClick={() => onRegionSelect("north")}
            onMouseEnter={() => setHoveredRegion("north")}
            onMouseLeave={() => setHoveredRegion(null)}
            style={{ cursor: "pointer" }}
          />
          <text x="150" y="110" fill="#FFFFFF" fontWeight="bold" textAnchor="middle" fontSize="14">
            Norte
          </text>
          <text x="150" y="130" fill="#FFFFFF" textAnchor="middle" fontSize="12">
            {formatValue(getDisplayValue("north"), activeTab)}
          </text>

          {/* Nordeste */}
          <path
            d="M190,145 C200,140 210,140 220,145 C230,150 235,160 235,170 
               C235,180 230,190 220,195 C210,200 200,200 190,195 
               C180,190 175,180 175,170 C175,160 180,150 190,145 Z"
            fill={getRegionColor("northeast")}
            stroke="#FFFFFF"
            strokeWidth="2"
            onClick={() => onRegionSelect("northeast")}
            onMouseEnter={() => setHoveredRegion("northeast")}
            onMouseLeave={() => setHoveredRegion(null)}
            style={{ cursor: "pointer" }}
          />
          <text x="205" y="170" fill="#FFFFFF" fontWeight="bold" textAnchor="middle" fontSize="12">
            NE
          </text>
          <text x="205" y="185" fill="#FFFFFF" textAnchor="middle" fontSize="10">
            {formatValue(getDisplayValue("northeast"), activeTab)}
          </text>

          {/* Centro-Oeste */}
          <path
            d="M110,145 C125,140 140,140 150,145 C160,150 165,160 165,170 
               C165,180 160,190 150,195 C140,200 125,200 110,195 
               C95,190 85,180 80,170 C75,160 75,150 80,140 
               C85,130 95,125 110,145 Z"
            fill={getRegionColor("central-west")}
            stroke="#FFFFFF"
            strokeWidth="2"
            onClick={() => onRegionSelect("central-west")}
            onMouseEnter={() => setHoveredRegion("central-west")}
            onMouseLeave={() => setHoveredRegion(null)}
            style={{ cursor: "pointer" }}
          />
          <text x="125" y="170" fill="#FFFFFF" fontWeight="bold" textAnchor="middle" fontSize="12">
            CO
          </text>
          <text x="125" y="185" fill="#FFFFFF" textAnchor="middle" fontSize="10">
            {formatValue(getDisplayValue("central-west"), activeTab)}
          </text>

          {/* Sudeste */}
          <path
            d="M150,195 C165,190 180,190 190,195 C200,200 205,210 205,220 
               C205,230 200,240 190,245 C180,250 165,250 150,245 
               C135,240 125,230 120,220 C115,210 115,200 120,195 
               C125,190 135,195 150,195 Z"
            fill={getRegionColor("southeast")}
            stroke="#FFFFFF"
            strokeWidth="2"
            onClick={() => onRegionSelect("southeast")}
            onMouseEnter={() => setHoveredRegion("southeast")}
            onMouseLeave={() => setHoveredRegion(null)}
            style={{ cursor: "pointer" }}
          />
          <text x="165" y="220" fill="#FFFFFF" fontWeight="bold" textAnchor="middle" fontSize="12">
            SE
          </text>
          <text x="165" y="235" fill="#FFFFFF" textAnchor="middle" fontSize="10">
            {formatValue(getDisplayValue("southeast"), activeTab)}
          </text>

          {/* Sul */}
          <path
            d="M150,245 C160,240 170,240 180,245 C190,250 195,260 195,270 
               C195,280 190,290 180,295 C170,300 160,300 150,295 
               C140,290 135,280 135,270 C135,260 140,250 150,245 Z"
            fill={getRegionColor("south")}
            stroke="#FFFFFF"
            strokeWidth="2"
            onClick={() => onRegionSelect("south")}
            onMouseEnter={() => setHoveredRegion("south")}
            onMouseLeave={() => setHoveredRegion(null)}
            style={{ cursor: "pointer" }}
          />
          <text x="165" y="270" fill="#FFFFFF" fontWeight="bold" textAnchor="middle" fontSize="12">
            Sul
          </text>
          <text x="165" y="285" fill="#FFFFFF" textAnchor="middle" fontSize="10">
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

export default BrazilMapReal
