"use client"
import { useState, useEffect } from "react"
import { Tooltip } from "react-tooltip"

// Definição das regiões do Brasil
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

const BrazilMap = ({ selectedRegion, onRegionSelect, data, activeTab }: BrazilMapProps) => {
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

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${mapSize.width} ${mapSize.height}`}
        className="w-full h-auto max-h-[500px] transition-all duration-300"
        style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}
      >
        {/* Contorno mais detalhado do Brasil */}
        <path
          d="M300,70 C320,65 340,62 360,60 C400,55 440,52 480,60 
             C520,68 560,85 600,110 C640,135 670,170 690,210 
             C710,250 720,290 725,330 C730,370 730,410 725,450 
             C720,490 710,530 695,570 C680,610 660,650 635,685 
             C610,720 580,750 545,775 C510,800 470,815 430,825 
             C390,835 350,835 310,825 C270,815 235,795 205,770 
             C175,745 150,715 130,680 C110,645 95,605 85,565 
             C75,525 70,485 70,445 C70,405 75,365 85,325 
             C95,285 110,245 130,210 C150,175 175,145 205,120 
             C235,95 270,80 300,70 Z"
          fill="none"
          stroke="#000000"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Norte - Forma mais detalhada */}
        <path
          d="M300,150 C320,140 345,135 370,130 C395,125 420,122 445,125 
             C470,128 495,135 515,150 C535,165 550,185 560,210 
             C570,235 575,265 575,295 C575,325 570,355 560,380 
             C550,405 535,425 515,440 C495,455 470,465 445,470 
             C420,475 395,475 370,470 C345,465 320,455 300,440 
             C280,425 265,405 255,380 C245,355 240,325 240,295 
             C240,265 245,235 255,210 C265,185 280,165 300,150 Z"
          fill={getRegionColor("north")}
          stroke="#FFFFFF"
          strokeWidth="3"
          onClick={() => onRegionSelect("north")}
          onMouseEnter={() => setHoveredRegion("north")}
          onMouseLeave={() => setHoveredRegion(null)}
          data-tooltip-id="tooltip-north"
          data-tooltip-html={getTooltipContent("north")}
          style={{ cursor: "pointer", transition: "fill 0.3s ease" }}
          className="hover:opacity-90 active:opacity-80"
        />
        <text
          x="405"
          y="280"
          fill="#FFFFFF"
          fontWeight="bold"
          fontSize="20"
          textAnchor="middle"
          className="drop-shadow-md"
        >
          Norte
        </text>
        <text x="405" y="310" fill="#FFFFFF" fontSize="18" textAnchor="middle" className="drop-shadow-md">
          {getDisplayValue("north")}
        </text>

        {/* Nordeste - Forma mais detalhada */}
        <path
          d="M515,150 C535,145 555,145 575,150 C595,155 615,165 630,180 
             C645,195 655,215 660,235 C665,255 665,275 660,295 
             C655,315 645,335 630,350 C615,365 595,375 575,380 
             C555,385 535,385 515,380 C495,375 475,365 460,350 
             C445,335 435,315 430,295 C425,275 425,255 430,235 
             C435,215 445,195 460,180 C475,165 495,155 515,150 Z"
          fill={getRegionColor("northeast")}
          stroke="#FFFFFF"
          strokeWidth="3"
          onClick={() => onRegionSelect("northeast")}
          onMouseEnter={() => setHoveredRegion("northeast")}
          onMouseLeave={() => setHoveredRegion(null)}
          data-tooltip-id="tooltip-northeast"
          data-tooltip-html={getTooltipContent("northeast")}
          style={{ cursor: "pointer", transition: "fill 0.3s ease" }}
          className="hover:opacity-90 active:opacity-80"
        />
        <text
          x="545"
          y="265"
          fill="#FFFFFF"
          fontWeight="bold"
          fontSize="20"
          textAnchor="middle"
          className="drop-shadow-md"
        >
          Nordeste
        </text>
        <text x="545" y="295" fill="#FFFFFF" fontSize="18" textAnchor="middle" className="drop-shadow-md">
          {getDisplayValue("northeast")}
        </text>

        {/* Centro-Oeste - Forma mais detalhada */}
        <path
          d="M370,470 C390,465 410,465 430,470 C450,475 470,485 485,500 
             C500,515 510,535 515,555 C520,575 520,595 515,615 
             C510,635 500,655 485,670 C470,685 450,695 430,700 
             C410,705 390,705 370,700 C350,695 330,685 315,670 
             C300,655 290,635 285,615 C280,595 280,575 285,555 
             C290,535 300,515 315,500 C330,485 350,475 370,470 Z"
          fill={getRegionColor("central-west")}
          stroke="#FFFFFF"
          strokeWidth="3"
          onClick={() => onRegionSelect("central-west")}
          onMouseEnter={() => setHoveredRegion("central-west")}
          onMouseLeave={() => setHoveredRegion(null)}
          data-tooltip-id="tooltip-central-west"
          data-tooltip-html={getTooltipContent("central-west")}
          style={{ cursor: "pointer", transition: "fill 0.3s ease" }}
          className="hover:opacity-90 active:opacity-80"
        />
        <text
          x="400"
          y="585"
          fill="#FFFFFF"
          fontWeight="bold"
          fontSize="20"
          textAnchor="middle"
          className="drop-shadow-md"
        >
          Centro-Oeste
        </text>
        <text x="400" y="615" fill="#FFFFFF" fontSize="18" textAnchor="middle" className="drop-shadow-md">
          {getDisplayValue("central-west")}
        </text>

        {/* Sudeste - Forma mais detalhada */}
        <path
          d="M485,500 C505,495 525,495 545,500 C565,505 585,515 600,530 
             C615,545 625,565 630,585 C635,605 635,625 630,645 
             C625,665 615,685 600,700 C585,715 565,725 545,730 
             C525,735 505,735 485,730 C465,725 445,715 430,700 
             C415,685 405,665 400,645 C395,625 395,605 400,585 
             C405,565 415,545 430,530 C445,515 465,505 485,500 Z"
          fill={getRegionColor("southeast")}
          stroke="#FFFFFF"
          strokeWidth="3"
          onClick={() => onRegionSelect("southeast")}
          onMouseEnter={() => setHoveredRegion("southeast")}
          onMouseLeave={() => setHoveredRegion(null)}
          data-tooltip-id="tooltip-southeast"
          data-tooltip-html={getTooltipContent("southeast")}
          style={{ cursor: "pointer", transition: "fill 0.3s ease" }}
          className="hover:opacity-90 active:opacity-80"
        />
        <text
          x="515"
          y="615"
          fill="#FFFFFF"
          fontWeight="bold"
          fontSize="20"
          textAnchor="middle"
          className="drop-shadow-md"
        >
          Sudeste
        </text>
        <text x="515" y="645" fill="#FFFFFF" fontSize="18" textAnchor="middle" className="drop-shadow-md">
          {getDisplayValue("southeast")}
        </text>

        {/* Sul - Forma mais detalhada */}
        <path
          d="M430,700 C450,695 470,695 490,700 C510,705 530,715 545,730 
             C560,745 570,765 575,785 C580,805 580,825 575,845 
             C570,865 560,885 545,900 C530,915 510,925 490,930 
             C470,935 450,935 430,930 C410,925 390,915 375,900 
             C360,885 350,865 345,845 C340,825 340,805 345,785 
             C350,765 360,745 375,730 C390,715 410,705 430,700 Z"
          fill={getRegionColor("south")}
          stroke="#FFFFFF"
          strokeWidth="3"
          onClick={() => onRegionSelect("south")}
          onMouseEnter={() => setHoveredRegion("south")}
          onMouseLeave={() => setHoveredRegion(null)}
          data-tooltip-id="tooltip-south"
          data-tooltip-html={getTooltipContent("south")}
          style={{ cursor: "pointer", transition: "fill 0.3s ease" }}
          className="hover:opacity-90 active:opacity-80"
        />
        <text
          x="460"
          y="815"
          fill="#FFFFFF"
          fontWeight="bold"
          fontSize="20"
          textAnchor="middle"
          className="drop-shadow-md"
        >
          Sul
        </text>
        <text x="460" y="845" fill="#FFFFFF" fontSize="18" textAnchor="middle" className="drop-shadow-md">
          {getDisplayValue("south")}
        </text>

        {/* Legenda */}
        <rect x="600" y="700" width="180" height="140" rx="5" fill="white" fillOpacity="0.8" stroke="#ccc" />
        <text x="690" y="725" textAnchor="middle" fontWeight="bold" fontSize="16">
          {getLegendTitle()}
        </text>

        {regions.map((region, index) => (
          <g key={region.id}>
            <rect
              x="620"
              y={740 + index * 25}
              width="20"
              height="20"
              fill={region.color}
              rx="3"
              stroke="#fff"
              strokeWidth="1"
            />
            <text x="650" y={755 + index * 25} dominantBaseline="middle" fontSize="14">
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

export default BrazilMap
