"use client"

import { useState, useEffect } from "react"
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

const BrazilMapEnhanced = ({ selectedRegion, onRegionSelect, data, activeTab }: BrazilMapProps) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [mapSize, setMapSize] = useState({ width: 800, height: 800 })

  // Ajustar tamanho do mapa para dispositivos móveis
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setMapSize({ width: 400, height: 400 })
      } else {
        setMapSize({ width: 800, height: 800 })
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

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

  return (
    <div className="relative">
      <svg
        viewBox="0 0 800 800"
        className="w-full h-auto max-h-[500px] transition-all duration-300"
        style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}
      >
        {/* Contorno do Brasil */}
        <path
          d="M400,100 C450,105 500,115 540,135 C580,155 610,185 630,220 
             C650,255 660,295 660,335 C660,375 650,415 630,450 
             C610,485 580,515 540,535 C500,555 450,565 400,565 
             C350,565 300,555 260,535 C220,515 190,485 170,450 
             C150,415 140,375 140,335 C140,295 150,255 170,220 
             C190,185 220,155 260,135 C300,115 350,105 400,100 Z"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
        />

        {/* Norte */}
        <path
          d="M400,150 C430,153 460,160 485,172 C510,184 530,202 545,225 
             C560,248 567,275 567,302 C567,329 560,356 545,379 
             C530,402 510,420 485,432 C460,444 430,451 400,451 
             C370,451 340,444 315,432 C290,420 270,402 255,379 
             C240,356 233,329 233,302 C233,275 240,248 255,225 
             C270,202 290,184 315,172 C340,160 370,153 400,150 Z"
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
          x="400"
          y="300"
          fill="#000000"
          fontWeight="bold"
          fontSize="20"
          textAnchor="middle"
          className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
        >
          Norte
        </text>
        <text
          x="400"
          y="330"
          fill="#000000"
          fontSize="18"
          textAnchor="middle"
          className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
        >
          {getDisplayValue("north")}
        </text>

        {/* Nordeste */}
        <path
          d="M545,225 C560,235 572,248 580,265 C588,282 592,300 592,320 
             C592,340 588,358 580,375 C572,392 560,405 545,415 
             C530,425 512,430 492,430 C472,430 454,425 439,415 
             C424,405 412,392 404,375 C396,358 392,340 392,320 
             C392,300 396,282 404,265 C412,248 424,235 439,225 
             C454,215 472,210 492,210 C512,210 530,215 545,225 Z"
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
          x="492"
          y="320"
          fill="#000000"
          fontWeight="bold"
          fontSize="16"
          textAnchor="middle"
          className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
        >
          Nordeste
        </text>
        <text
          x="492"
          y="345"
          fill="#000000"
          fontSize="14"
          textAnchor="middle"
          className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
        >
          {getDisplayValue("northeast")}
        </text>

        {/* Centro-Oeste */}
        <path
          d="M315,432 C330,425 347,422 365,422 C383,422 400,425 415,432 
             C430,439 442,450 450,465 C458,480 462,497 462,515 
             C462,533 458,550 450,565 C442,580 430,591 415,598 
             C400,605 383,608 365,608 C347,608 330,605 315,598 
             C300,591 288,580 280,565 C272,550 268,533 268,515 
             C268,497 272,480 280,465 C288,450 300,439 315,432 Z"
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
          x="365"
          y="515"
          fill="#000000"
          fontWeight="bold"
          fontSize="16"
          textAnchor="middle"
          className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
        >
          Centro-Oeste
        </text>
        <text
          x="365"
          y="540"
          fill="#000000"
          fontSize="14"
          textAnchor="middle"
          className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
        >
          {getDisplayValue("central-west")}
        </text>

        {/* Sudeste */}
        <path
          d="M450,465 C465,460 482,458 500,458 C518,458 535,460 550,465 
             C565,470 577,478 585,490 C593,502 597,515 597,530 
             C597,545 593,558 585,570 C577,582 565,590 550,595 
             C535,600 518,602 500,602 C482,602 465,600 450,595 
             C435,590 423,582 415,570 C407,558 403,545 403,530 
             C403,515 407,502 415,490 C423,478 435,470 450,465 Z"
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
          x="500"
          y="530"
          fill="#000000"
          fontWeight="bold"
          fontSize="16"
          textAnchor="middle"
          className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
        >
          Sudeste
        </text>
        <text
          x="500"
          y="555"
          fill="#000000"
          fontSize="14"
          textAnchor="middle"
          className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
        >
          {getDisplayValue("southeast")}
        </text>

        {/* Sul */}
        <path
          d="M415,570 C425,565 437,562 450,562 C463,562 475,565 485,570 
             C495,575 503,582 508,592 C513,602 516,612 516,625 
             C516,638 513,648 508,658 C503,668 495,675 485,680 
             C475,685 463,688 450,688 C437,688 425,685 415,680 
             C405,675 397,668 392,658 C387,648 384,638 384,625 
             C384,612 387,602 392,592 C397,582 405,575 415,570 Z"
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
          x="450"
          y="625"
          fill="#000000"
          fontWeight="bold"
          fontSize="16"
          textAnchor="middle"
          className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
        >
          Sul
        </text>
        <text
          x="450"
          y="650"
          fill="#000000"
          fontSize="14"
          textAnchor="middle"
          className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
        >
          {getDisplayValue("south")}
        </text>

        {/* Legenda */}
        <rect x="600" y="600" width="180" height="180" rx="5" fill="white" fillOpacity="0.8" stroke="#ccc" />
        <text x="690" y="625" textAnchor="middle" fontWeight="bold" fontSize="16">
          {getLegendTitle()}
        </text>

        {regions.map((region, index) => (
          <g key={region.id}>
            <rect
              x="620"
              y={640 + index * 25}
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
              x="650"
              y={655 + index * 25}
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

export default BrazilMapEnhanced
