"use client"

import { useState } from "react"
import { Tooltip } from "react-tooltip"

// Definição das regiões do Brasil com cores e estados
const regions = [
  {
    id: "north",
    name: "Norte",
    color: "#0088FE",
    states: ["AC", "AM", "AP", "PA", "RO", "RR", "TO"],
  },
  {
    id: "northeast",
    name: "Nordeste",
    color: "#00C49F",
    states: ["AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE"],
  },
  {
    id: "central-west",
    name: "Centro-Oeste",
    color: "#FFBB28",
    states: ["DF", "GO", "MT", "MS"],
  },
  {
    id: "southeast",
    name: "Sudeste",
    color: "#FF8042",
    states: ["ES", "MG", "RJ", "SP"],
  },
  {
    id: "south",
    name: "Sul",
    color: "#8884D8",
    states: ["PR", "RS", "SC"],
  },
]

interface BrazilMapProps {
  selectedRegion: string
  onRegionSelect: (regionId: string) => void
  data: any[]
  activeTab: string
}

const BrazilMapRealistic = ({ selectedRegion, onRegionSelect, data, activeTab }: BrazilMapProps) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)

  // Obter valor para exibir no tooltip com base na aba ativa
  const getTooltipContent = (regionId) => {
    const regionData = data.find((r) => r.id === regionId)
    if (!regionData) return ""

    const region = regions.find((r) => r.id === regionId)
    const hospitals = regionData.hospitals || regionData.healthMetrics?.hospitals?.total || "N/A"
    const doctors =
      regionData.doctors?.toLocaleString() || regionData.healthMetrics?.doctors?.total?.toLocaleString() || "N/A"
    const beds = regionData.beds?.toLocaleString() || regionData.healthMetrics?.beds?.total?.toLocaleString() || "N/A"
    const urbanAccess = regionData.urbanAccessIndex || regionData.healthMetrics?.access?.urban || "N/A"
    const ruralAccess = regionData.ruralAccessIndex || regionData.healthMetrics?.access?.rural || "N/A"

    return `
      <div class="p-2">
        <div class="text-lg font-bold mb-1">${region?.name}</div>
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

  // Obter valor para exibir no mapa com base na aba ativa
  const getDisplayValue = (regionId) => {
    const regionData = data.find((r) => r.id === regionId)
    if (!regionData) return "N/A"

    switch (activeTab) {
      case "hospitals":
        return `${regionData.hospitals || regionData.healthMetrics?.hospitals?.total || "N/A"}`
      case "doctors":
        return `${regionData.doctors?.toLocaleString() || regionData.healthMetrics?.doctors?.total?.toLocaleString() || "N/A"}`
      case "beds":
        return `${regionData.beds?.toLocaleString() || regionData.healthMetrics?.beds?.total?.toLocaleString() || "N/A"}`
      case "equipment":
        return `${regionData.medicalEquipment?.mri || "N/A"}`
      case "access":
        return `${regionData.urbanAccessIndex || regionData.healthMetrics?.access?.urban || "N/A"}%`
      default:
        return regionData.name
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

  // Calcular intensidade da cor com base no valor
  const getColorIntensity = (regionId) => {
    const regionData = data.find((r) => r.id === regionId)
    if (!regionData) return 0.3

    const max = getMaxValue()
    if (max === 0) return 0.5

    let value = 0
    switch (activeTab) {
      case "hospitals":
        value = regionData.hospitals || regionData.healthMetrics?.hospitals?.total || 0
        break
      case "doctors":
        value = regionData.doctors || regionData.healthMetrics?.doctors?.total || 0
        break
      case "beds":
        value = regionData.beds || regionData.healthMetrics?.beds?.total || 0
        break
      case "equipment":
        value = regionData.medicalEquipment?.mri || 0
        break
      case "access":
        value = regionData.urbanAccessIndex || regionData.healthMetrics?.access?.urban || 0
        break
    }

    // Retorna um valor entre 0.3 e 1.0 baseado na proporção do valor em relação ao máximo
    return 0.3 + (value / max) * 0.7
  }

  // Calcular valor máximo para a métrica atual
  const getMaxValue = () => {
    let max = 0
    data.forEach((region) => {
      let value = 0
      switch (activeTab) {
        case "hospitals":
          value = region.hospitals || region.healthMetrics?.hospitals?.total || 0
          break
        case "doctors":
          value = region.doctors || region.healthMetrics?.doctors?.total || 0
          break
        case "beds":
          value = region.beds || region.healthMetrics?.beds?.total || 0
          break
        case "equipment":
          value = region.medicalEquipment?.mri || 0
          break
        case "access":
          value = region.urbanAccessIndex || region.healthMetrics?.access?.urban || 0
          break
      }
      if (value > max) max = value
    })
    return max
  }

  // Obter título da legenda com base na aba ativa
  const getLegendTitle = () => {
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

  return (
    <div className="relative">
      <svg
        viewBox="0 0 500 600"
        className="w-full h-auto max-h-[500px] transition-all duration-300"
        style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}
      >
        {/* Mapa do Brasil com regiões mais realistas */}

        {/* Norte - Forma mais realista */}
        <path
          d="M120,100 C140,80 170,70 200,65 C230,60 260,60 290,70 
             C320,80 345,95 360,120 C375,145 380,175 375,205 
             C370,235 355,260 330,280 C305,300 275,310 240,310 
             C205,310 175,300 150,280 C125,260 110,235 105,205 
             C100,175 105,145 120,120 C135,95 155,80 180,70 Z"
          fill={getRegionColor("north")}
          fillOpacity={getColorIntensity("north")}
          stroke="#FFFFFF"
          strokeWidth="2"
          onClick={() => onRegionSelect("north")}
          onMouseEnter={() => setHoveredRegion("north")}
          onMouseLeave={() => setHoveredRegion(null)}
          data-tooltip-id="tooltip-north"
          data-tooltip-html={getTooltipContent("north")}
          style={{ cursor: "pointer", transition: "fill 0.3s ease, fill-opacity 0.3s ease" }}
          className="hover:opacity-90 active:opacity-80"
        />
        <text
          x="240"
          y="180"
          fill="#000000"
          fontWeight="bold"
          fontSize="16"
          textAnchor="middle"
          className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
        >
          Norte
        </text>
        <text
          x="240"
          y="205"
          fill="#000000"
          fontSize="14"
          textAnchor="middle"
          className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
        >
          {getDisplayValue("north")}
        </text>

        {/* Nordeste - Forma mais realista */}
        <path
          d="M330,280 C345,270 362,265 380,265 C398,265 415,270 430,280 
             C445,290 455,305 460,325 C465,345 465,365 460,385 
             C455,405 445,420 430,430 C415,440 398,445 380,445 
             C362,445 345,440 330,430 C315,420 305,405 300,385 
             C295,365 295,345 300,325 C305,305 315,290 330,280 Z"
          fill={getRegionColor("northeast")}
          fillOpacity={getColorIntensity("northeast")}
          stroke="#FFFFFF"
          strokeWidth="2"
          onClick={() => onRegionSelect("northeast")}
          onMouseEnter={() => setHoveredRegion("northeast")}
          onMouseLeave={() => setHoveredRegion(null)}
          data-tooltip-id="tooltip-northeast"
          data-tooltip-html={getTooltipContent("northeast")}
          style={{ cursor: "pointer", transition: "fill 0.3s ease, fill-opacity 0.3s ease" }}
          className="hover:opacity-90 active:opacity-80"
        />
        <text
          x="380"
          y="355"
          fill="#000000"
          fontWeight="bold"
          fontSize="16"
          textAnchor="middle"
          className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
        >
          Nordeste
        </text>
        <text
          x="380"
          y="380"
          fill="#000000"
          fontSize="14"
          textAnchor="middle"
          className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
        >
          {getDisplayValue("northeast")}
        </text>

        {/* Centro-Oeste - Forma mais realista */}
        <path
          d="M150,280 C170,290 195,295 220,295 C245,295 270,290 290,280 
             C310,270 325,255 335,235 C345,215 350,190 350,165 
             C350,140 345,115 335,95 C325,75 310,60 290,50 
             C270,40 245,35 220,35 C195,35 170,40 150,50 
             C130,60 115,75 105,95 C95,115 90,140 90,165 
             C90,190 95,215 105,235 C115,255 130,270 150,280 Z"
          fill={getRegionColor("central-west")}
          fillOpacity={getColorIntensity("central-west")}
          stroke="#FFFFFF"
          strokeWidth="2"
          onClick={() => onRegionSelect("central-west")}
          onMouseEnter={() => setHoveredRegion("central-west")}
          onMouseLeave={() => setHoveredRegion(null)}
          data-tooltip-id="tooltip-central-west"
          data-tooltip-html={getTooltipContent("central-west")}
          style={{ cursor: "pointer", transition: "fill 0.3s ease, fill-opacity 0.3s ease" }}
          className="hover:opacity-90 active:opacity-80"
        />
        <text
          x="220"
          y="350"
          fill="#000000"
          fontWeight="bold"
          fontSize="16"
          textAnchor="middle"
          className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
        >
          Centro-Oeste
        </text>
        <text
          x="220"
          y="375"
          fill="#000000"
          fontSize="14"
          textAnchor="middle"
          className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
        >
          {getDisplayValue("central-west")}
        </text>

        {/* Sudeste - Forma mais realista */}
        <path
          d="M300,385 C315,375 332,370 350,370 C368,370 385,375 400,385 
             C415,395 425,410 430,430 C435,450 435,470 430,490 
             C425,510 415,525 400,535 C385,545 368,550 350,550 
             C332,550 315,545 300,535 C285,525 275,510 270,490 
             C265,470 265,450 270,430 C275,410 285,395 300,385 Z"
          fill={getRegionColor("southeast")}
          fillOpacity={getColorIntensity("southeast")}
          stroke="#FFFFFF"
          strokeWidth="2"
          onClick={() => onRegionSelect("southeast")}
          onMouseEnter={() => setHoveredRegion("southeast")}
          onMouseLeave={() => setHoveredRegion(null)}
          data-tooltip-id="tooltip-southeast"
          data-tooltip-html={getTooltipContent("southeast")}
          style={{ cursor: "pointer", transition: "fill 0.3s ease, fill-opacity 0.3s ease" }}
          className="hover:opacity-90 active:opacity-80"
        />
        <text
          x="350"
          y="460"
          fill="#000000"
          fontWeight="bold"
          fontSize="16"
          textAnchor="middle"
          className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
        >
          Sudeste
        </text>
        <text
          x="350"
          y="485"
          fill="#000000"
          fontSize="14"
          textAnchor="middle"
          className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
        >
          {getDisplayValue("southeast")}
        </text>

        {/* Sul - Forma mais realista */}
        <path
          d="M270,490 C280,480 295,475 310,475 C325,475 340,480 350,490 
             C360,500 365,515 365,530 C365,545 360,560 350,570 
             C340,580 325,585 310,585 C295,585 280,580 270,570 
             C260,560 255,545 255,530 C255,515 260,500 270,490 Z"
          fill={getRegionColor("south")}
          fillOpacity={getColorIntensity("south")}
          stroke="#FFFFFF"
          strokeWidth="2"
          onClick={() => onRegionSelect("south")}
          onMouseEnter={() => setHoveredRegion("south")}
          onMouseLeave={() => setHoveredRegion(null)}
          data-tooltip-id="tooltip-south"
          data-tooltip-html={getTooltipContent("south")}
          style={{ cursor: "pointer", transition: "fill 0.3s ease, fill-opacity 0.3s ease" }}
          className="hover:opacity-90 active:opacity-80"
        />
        <text
          x="310"
          y="530"
          fill="#000000"
          fontWeight="bold"
          fontSize="16"
          textAnchor="middle"
          className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
        >
          Sul
        </text>
        <text
          x="310"
          y="555"
          fill="#000000"
          fontSize="14"
          textAnchor="middle"
          className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
        >
          {getDisplayValue("south")}
        </text>

        {/* Legenda */}
        <rect x="10" y="500" width="180" height="180" rx="5" fill="white" fillOpacity="0.8" stroke="#ccc" />
        <text x="100" y="525" textAnchor="middle" fontWeight="bold" fontSize="16">
          {getLegendTitle()}
        </text>

        {regions.map((region, index) => (
          <g key={region.id}>
            <rect
              x="30"
              y={540 + index * 25}
              width="20"
              height="20"
              fill={region.color}
              fillOpacity={selectedRegion === region.id || selectedRegion === "all" ? 1 : 0.5}
              rx="3"
              stroke="#fff"
              strokeWidth="1"
              onClick={() => onRegionSelect(region.id)}
              style={{ cursor: "pointer" }}
            />
            <text
              x="60"
              y={555 + index * 25}
              dominantBaseline="middle"
              fontSize="14"
              onClick={() => onRegionSelect(region.id)}
              style={{ cursor: "pointer" }}
              fontWeight={selectedRegion === region.id ? "bold" : "normal"}
            >
              {region.name}
            </text>
          </g>
        ))}
      </svg>

      {/* Tooltips para regiões */}
      <Tooltip id="tooltip-north" className="z-50" />
      <Tooltip id="tooltip-northeast" className="z-50" />
      <Tooltip id="tooltip-central-west" className="z-50" />
      <Tooltip id="tooltip-southeast" className="z-50" />
      <Tooltip id="tooltip-south" className="z-50" />

      <div className="text-xs text-gray-500 text-center mt-2">
        Clique em uma região para filtrar os dados ou passe o mouse para ver detalhes
      </div>
    </div>
  )
}

export default BrazilMapRealistic
