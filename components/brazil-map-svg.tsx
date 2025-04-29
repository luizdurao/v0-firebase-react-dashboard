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

const BrazilMapSVG = ({ selectedRegion, onRegionSelect, data, activeTab }: BrazilMapProps) => {
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
          viewBox="0 0 500 550"
          width="100%"
          height="auto"
          style={{ maxHeight: "500px" }}
          className="border border-gray-200 rounded-lg"
        >
          {/* Contorno do Brasil */}
          <path
            d="M250,50 C300,55 350,70 390,100 C430,130 450,170 460,220 
               C470,270 470,320 460,370 C450,420 430,460 400,490 
               C370,520 330,540 290,550 C250,560 210,560 170,550 
               C130,540 100,520 70,490 C40,460 20,420 10,370 
               C0,320 0,270 10,220 C20,170 40,130 70,100 
               C100,70 150,55 200,50 C220,48 230,48 250,50 Z"
            fill="#f0f0f0"
            stroke="#cccccc"
            strokeWidth="1"
          />

          {/* Norte - Forma mais realista */}
          <path
            d="M250,100 C280,105 310,115 335,135 C360,155 375,180 380,210 
               C385,240 380,270 365,295 C350,320 325,335 295,340 
               C265,345 235,340 210,325 C185,310 170,285 165,255 
               C160,225 165,195 180,170 C195,145 220,125 250,115 
               C250,115 250,100 250,100 Z"
            fill={getRegionColor("north")}
            stroke="#FFFFFF"
            strokeWidth="2"
            onClick={() => onRegionSelect("north")}
            onMouseEnter={() => setHoveredRegion("north")}
            onMouseLeave={() => setHoveredRegion(null)}
            style={{ cursor: "pointer" }}
          />
          <text x="270" y="220" fill="#FFFFFF" fontWeight="bold" textAnchor="middle" fontSize="16">
            Norte
          </text>
          <text x="270" y="245" fill="#FFFFFF" textAnchor="middle" fontSize="14">
            {formatValue(getDisplayValue("north"), activeTab)}
          </text>

          {/* Nordeste - Forma mais realista */}
          <path
            d="M365,295 C380,285 395,280 410,285 C425,290 435,300 440,315 
               C445,330 445,345 440,360 C435,375 425,385 410,390 
               C395,395 380,395 365,390 C350,385 340,375 335,360 
               C330,345 330,330 335,315 C340,300 350,290 365,295 Z"
            fill={getRegionColor("northeast")}
            stroke="#FFFFFF"
            strokeWidth="2"
            onClick={() => onRegionSelect("northeast")}
            onMouseEnter={() => setHoveredRegion("northeast")}
            onMouseLeave={() => setHoveredRegion(null)}
            style={{ cursor: "pointer" }}
          />
          <text x="390" y="335" fill="#FFFFFF" fontWeight="bold" textAnchor="middle" fontSize="14">
            Nordeste
          </text>
          <text x="390" y="355" fill="#FFFFFF" textAnchor="middle" fontSize="12">
            {formatValue(getDisplayValue("northeast"), activeTab)}
          </text>

          {/* Centro-Oeste - Forma mais realista */}
          <path
            d="M210,325 C235,320 260,325 280,340 C300,355 310,375 310,400 
               C310,425 300,445 280,460 C260,475 235,480 210,475 
               C185,470 165,455 155,435 C145,415 145,390 155,370 
               C165,350 185,335 210,325 Z"
            fill={getRegionColor("central-west")}
            stroke="#FFFFFF"
            strokeWidth="2"
            onClick={() => onRegionSelect("central-west")}
            onMouseEnter={() => setHoveredRegion("central-west")}
            onMouseLeave={() => setHoveredRegion(null)}
            style={{ cursor: "pointer" }}
          />
          <text x="235" y="400" fill="#FFFFFF" fontWeight="bold" textAnchor="middle" fontSize="14">
            Centro-Oeste
          </text>
          <text x="235" y="420" fill="#FFFFFF" textAnchor="middle" fontSize="12">
            {formatValue(getDisplayValue("central-west"), activeTab)}
          </text>

          {/* Sudeste - Forma mais realista */}
          <path
            d="M280,460 C300,455 320,455 335,460 C350,465 360,475 365,490 
               C370,505 370,520 365,535 C360,550 350,560 335,565 
               C320,570 300,570 280,565 C260,560 245,550 235,535 
               C225,520 220,505 220,490 C220,475 225,465 235,460 
               C245,455 260,455 280,460 Z"
            fill={getRegionColor("southeast")}
            stroke="#FFFFFF"
            strokeWidth="2"
            onClick={() => onRegionSelect("southeast")}
            onMouseEnter={() => setHoveredRegion("southeast")}
            onMouseLeave={() => setHoveredRegion(null)}
            style={{ cursor: "pointer" }}
          />
          <text x="295" y="510" fill="#FFFFFF" fontWeight="bold" textAnchor="middle" fontSize="14">
            Sudeste
          </text>
          <text x="295" y="530" fill="#FFFFFF" textAnchor="middle" fontSize="12">
            {formatValue(getDisplayValue("southeast"), activeTab)}
          </text>

          {/* Sul - Forma mais realista */}
          <path
            d="M235,535 C245,530 255,530 265,535 C275,540 280,550 280,560 
               C280,570 275,580 265,585 C255,590 245,590 235,585 
               C225,580 220,570 220,560 C220,550 225,540 235,535 Z"
            fill={getRegionColor("south")}
            stroke="#FFFFFF"
            strokeWidth="2"
            onClick={() => onRegionSelect("south")}
            onMouseEnter={() => setHoveredRegion("south")}
            onMouseLeave={() => setHoveredRegion(null)}
            style={{ cursor: "pointer" }}
          />
          <text x="250" y="560" fill="#FFFFFF" fontWeight="bold" textAnchor="middle" fontSize="14">
            Sul
          </text>
          <text x="250" y="580" fill="#FFFFFF" textAnchor="middle" fontSize="12">
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

export default BrazilMapSVG
