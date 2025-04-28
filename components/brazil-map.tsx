"use client"
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
  // Obter valor para exibir no tooltip com base na aba ativa
  const getTooltipContent = (regionId) => {
    const regionData = data.find((r) => r.id === regionId)
    if (!regionData) return ""

    const region = regions.find((r) => r.id === regionId)
    const hospitals = regionData.hospitals || regionData.healthMetrics?.hospitals?.total || "N/A"
    const doctors =
      regionData.doctors?.toLocaleString() || regionData.healthMetrics?.doctors?.total?.toLocaleString() || "N/A"
    const beds = regionData.beds?.toLocaleString() || regionData.healthMetrics?.beds?.total?.toLocaleString() || "N/A"

    return `
      <div class="font-bold">${region?.name}</div>
      <div>Hospitais: ${hospitals}</div>
      <div>Médicos: ${doctors}</div>
      <div>Leitos: ${beds}</div>
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

  return (
    <div className="relative">
      <svg
        viewBox="0 0 800 800"
        className="w-full h-auto max-h-[500px]"
        style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}
      >
        {/* Contorno do Brasil */}
        <path
          d="M180,150 C200,100 250,80 300,70 C350,60 400,50 450,70 
             C500,90 550,120 600,170 C650,220 680,280 690,350 
             C700,420 690,500 670,570 C650,640 620,700 580,750 
             C540,800 490,820 430,830 C370,840 310,830 260,800 
             C210,770 170,730 140,680 C110,630 90,570 80,510 
             C70,450 70,390 80,330 C90,270 110,210 140,170 
             C150,160 170,155 180,150 Z"
          fill="none"
          stroke="#000000"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Norte */}
        <path
          d="M400,150 L250,200 L200,300 L300,400 L450,350 L500,250 Z"
          fill={regions[0].color}
          fillOpacity={selectedRegion === "north" || selectedRegion === "all" ? 0.8 : 0.4}
          stroke="#FFFFFF"
          strokeWidth="3"
          onClick={() => onRegionSelect("north")}
          data-tooltip-id="tooltip-north"
          data-tooltip-html={getTooltipContent("north")}
          style={{ cursor: "pointer" }}
        />
        <text x="350" y="280" fill="#FFFFFF" fontWeight="bold" fontSize="20" textAnchor="middle">
          Norte
        </text>
        <text x="350" y="310" fill="#FFFFFF" fontSize="18" textAnchor="middle">
          {getDisplayValue("north")}
        </text>

        {/* Nordeste */}
        <path
          d="M450,350 L550,300 L600,400 L550,500 L450,450 Z"
          fill={regions[1].color}
          fillOpacity={selectedRegion === "northeast" || selectedRegion === "all" ? 0.8 : 0.4}
          stroke="#FFFFFF"
          strokeWidth="3"
          onClick={() => onRegionSelect("northeast")}
          data-tooltip-id="tooltip-northeast"
          data-tooltip-html={getTooltipContent("northeast")}
          style={{ cursor: "pointer" }}
        />
        <text x="525" y="380" fill="#FFFFFF" fontWeight="bold" fontSize="20" textAnchor="middle">
          Nordeste
        </text>
        <text x="525" y="410" fill="#FFFFFF" fontSize="18" textAnchor="middle">
          {getDisplayValue("northeast")}
        </text>

        {/* Centro-Oeste */}
        <path
          d="M300,400 L450,450 L400,550 L300,500 Z"
          fill={regions[2].color}
          fillOpacity={selectedRegion === "central-west" || selectedRegion === "all" ? 0.8 : 0.4}
          stroke="#FFFFFF"
          strokeWidth="3"
          onClick={() => onRegionSelect("central-west")}
          data-tooltip-id="tooltip-central-west"
          data-tooltip-html={getTooltipContent("central-west")}
          style={{ cursor: "pointer" }}
        />
        <text x="370" y="475" fill="#FFFFFF" fontWeight="bold" fontSize="20" textAnchor="middle">
          Centro-Oeste
        </text>
        <text x="370" y="505" fill="#FFFFFF" fontSize="18" textAnchor="middle">
          {getDisplayValue("central-west")}
        </text>

        {/* Sudeste */}
        <path
          d="M450,450 L550,500 L500,600 L400,550 Z"
          fill={regions[3].color}
          fillOpacity={selectedRegion === "southeast" || selectedRegion === "all" ? 0.8 : 0.4}
          stroke="#FFFFFF"
          strokeWidth="3"
          onClick={() => onRegionSelect("southeast")}
          data-tooltip-id="tooltip-southeast"
          data-tooltip-html={getTooltipContent("southeast")}
          style={{ cursor: "pointer" }}
        />
        <text x="475" y="525" fill="#FFFFFF" fontWeight="bold" fontSize="20" textAnchor="middle">
          Sudeste
        </text>
        <text x="475" y="555" fill="#FFFFFF" fontSize="18" textAnchor="middle">
          {getDisplayValue("southeast")}
        </text>

        {/* Sul */}
        <path
          d="M400,550 L500,600 L450,700 L350,650 Z"
          fill={regions[4].color}
          fillOpacity={selectedRegion === "south" || selectedRegion === "all" ? 0.8 : 0.4}
          stroke="#FFFFFF"
          strokeWidth="3"
          onClick={() => onRegionSelect("south")}
          data-tooltip-id="tooltip-south"
          data-tooltip-html={getTooltipContent("south")}
          style={{ cursor: "pointer" }}
        />
        <text x="425" y="625" fill="#FFFFFF" fontWeight="bold" fontSize="20" textAnchor="middle">
          Sul
        </text>
        <text x="425" y="655" fill="#FFFFFF" fontSize="18" textAnchor="middle">
          {getDisplayValue("south")}
        </text>
      </svg>

      {/* Tooltips para regiões */}
      <Tooltip id="tooltip-north" />
      <Tooltip id="tooltip-northeast" />
      <Tooltip id="tooltip-central-west" />
      <Tooltip id="tooltip-southeast" />
      <Tooltip id="tooltip-south" />

      <div className="text-xs text-gray-500 text-center mt-2">Clique em uma região para filtrar os dados</div>
    </div>
  )
}

export default BrazilMap
