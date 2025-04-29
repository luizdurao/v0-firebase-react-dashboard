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

interface BrazilRealMapProps {
  selectedRegion: string
  onRegionSelect: (regionId: string) => void
  data: any[]
  activeTab: string
}

const BrazilRealMap = ({ selectedRegion, onRegionSelect, data, activeTab }: BrazilRealMapProps) => {
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

      <div className="aspect-[4/5] w-full">
        <svg viewBox="0 0 600 750" className="w-full h-full border border-gray-200 rounded-lg">
          {/* Fundo do mapa */}
          <rect x="0" y="0" width="600" height="750" fill="#f8f9fa" />

          {/* Norte */}
          <path
            d="M100,50 L400,50 L450,200 L300,300 L150,250 Z"
            fill={getRegionColor("north")}
            stroke="#fff"
            strokeWidth="2"
            onClick={() => onRegionSelect("north")}
            onMouseEnter={() => setHoveredRegion("north")}
            onMouseLeave={() => setHoveredRegion(null)}
            style={{ cursor: "pointer" }}
          />
          <text x="250" y="150" textAnchor="middle" fill="#000" fontSize="16" fontWeight="bold">
            Norte
          </text>
          <text x="250" y="180" textAnchor="middle" fill="#000" fontSize="14">
            {formatValue(getDisplayValue("north"), activeTab)}
          </text>

          {/* Nordeste */}
          <path
            d="M450,200 L500,250 L450,400 L350,350 L300,300 Z"
            fill={getRegionColor("northeast")}
            stroke="#fff"
            strokeWidth="2"
            onClick={() => onRegionSelect("northeast")}
            onMouseEnter={() => setHoveredRegion("northeast")}
            onMouseLeave={() => setHoveredRegion(null)}
            style={{ cursor: "pointer" }}
          />
          <text x="425" y="275" textAnchor="middle" fill="#000" fontSize="16" fontWeight="bold">
            Nordeste
          </text>
          <text x="425" y="305" textAnchor="middle" fill="#000" fontSize="14">
            {formatValue(getDisplayValue("northeast"), activeTab)}
          </text>

          {/* Centro-Oeste */}
          <path
            d="M150,250 L300,300 L350,350 L300,500 L200,450 Z"
            fill={getRegionColor("central-west")}
            stroke="#fff"
            strokeWidth="2"
            onClick={() => onRegionSelect("central-west")}
            onMouseEnter={() => setHoveredRegion("central-west")}
            onMouseLeave={() => setHoveredRegion(null)}
            style={{ cursor: "pointer" }}
          />
          <text x="250" y="350" textAnchor="middle" fill="#000" fontSize="16" fontWeight="bold">
            Centro-Oeste
          </text>
          <text x="250" y="380" textAnchor="middle" fill="#000" fontSize="14">
            {formatValue(getDisplayValue("central-west"), activeTab)}
          </text>

          {/* Sudeste */}
          <path
            d="M300,500 L350,350 L450,400 L400,550 Z"
            fill={getRegionColor("southeast")}
            stroke="#fff"
            strokeWidth="2"
            onClick={() => onRegionSelect("southeast")}
            onMouseEnter={() => setHoveredRegion("southeast")}
            onMouseLeave={() => setHoveredRegion(null)}
            style={{ cursor: "pointer" }}
          />
          <text x="375" y="450" textAnchor="middle" fill="#000" fontSize="16" fontWeight="bold">
            Sudeste
          </text>
          <text x="375" y="480" textAnchor="middle" fill="#000" fontSize="14">
            {formatValue(getDisplayValue("southeast"), activeTab)}
          </text>

          {/* Sul */}
          <path
            d="M200,450 L300,500 L400,550 L350,650 L250,650 Z"
            fill={getRegionColor("south")}
            stroke="#fff"
            strokeWidth="2"
            onClick={() => onRegionSelect("south")}
            onMouseEnter={() => setHoveredRegion("south")}
            onMouseLeave={() => setHoveredRegion(null)}
            style={{ cursor: "pointer" }}
          />
          <text x="300" y="550" textAnchor="middle" fill="#000" fontSize="16" fontWeight="bold">
            Sul
          </text>
          <text x="300" y="580" textAnchor="middle" fill="#000" fontSize="14">
            {formatValue(getDisplayValue("south"), activeTab)}
          </text>

          {/* Legenda */}
          <rect x="50" y="680" width="500" height="50" fill="#f8f9fa" stroke="#ddd" strokeWidth="1" rx="5" />
          <text x="300" y="705" textAnchor="middle" fill="#000" fontSize="14" fontWeight="bold">
            {activeTab === "hospitals"
              ? "Hospitais"
              : activeTab === "doctors"
                ? "Médicos"
                : activeTab === "beds"
                  ? "Leitos"
                  : activeTab === "equipment"
                    ? "Equipamentos"
                    : "Acesso à Saúde"}
          </text>
        </svg>
      </div>
    </div>
  )
}

export default BrazilRealMap
