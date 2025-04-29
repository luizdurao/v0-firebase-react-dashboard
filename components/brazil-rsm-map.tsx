"use client"

import { useState } from "react"
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps"
import { Tooltip } from "react-tooltip"

// GeoJSON for Brazil with states
const BRAZIL_GEO_URL =
  "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson"

// Mapping of state codes to regions
const stateToRegion = {
  // Norte (North)
  AC: "north", // Acre
  AM: "north", // Amazonas
  AP: "north", // Amapá
  PA: "north", // Pará
  RO: "north", // Rondônia
  RR: "north", // Roraima
  TO: "north", // Tocantins

  // Nordeste (Northeast)
  AL: "northeast", // Alagoas
  BA: "northeast", // Bahia
  CE: "northeast", // Ceará
  MA: "northeast", // Maranhão
  PB: "northeast", // Paraíba
  PE: "northeast", // Pernambuco
  PI: "northeast", // Piauí
  RN: "northeast", // Rio Grande do Norte
  SE: "northeast", // Sergipe

  // Centro-Oeste (Central-West)
  DF: "central-west", // Distrito Federal
  GO: "central-west", // Goiás
  MT: "central-west", // Mato Grosso
  MS: "central-west", // Mato Grosso do Sul

  // Sudeste (Southeast)
  ES: "southeast", // Espírito Santo
  MG: "southeast", // Minas Gerais
  RJ: "southeast", // Rio de Janeiro
  SP: "southeast", // São Paulo

  // Sul (South)
  PR: "south", // Paraná
  RS: "south", // Rio Grande do Sul
  SC: "south", // Santa Catarina
}

// Definição das regiões do Brasil com suas cores
const regions = [
  { id: "north", name: "Norte", color: "#0088FE" },
  { id: "northeast", name: "Nordeste", color: "#00C49F" },
  { id: "central-west", name: "Centro-Oeste", color: "#FFBB28" },
  { id: "southeast", name: "Sudeste", color: "#FF8042" },
  { id: "south", name: "Sul", color: "#8884D8" },
]

interface BrazilRsmMapProps {
  selectedRegion: string
  onRegionSelect: (regionId: string) => void
  data: any[]
  activeTab: string
}

const BrazilRsmMap = ({ selectedRegion, onRegionSelect, data, activeTab }: BrazilRsmMapProps) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [tooltipContent, setTooltipContent] = useState("")

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
    // Check if the region is in the filtered data
    const isInFilteredData = data.some((r) => r.id === regionId)
    if (!isInFilteredData) return "#e5e5e5" // Light gray for filtered out regions

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

  // Calcular valores agregados por região
  const regionValues = regions.map((region) => {
    const regionData = data.find((d) => d.id === region.id)
    const isInFilteredData = data.some((r) => r.id === region.id)

    return {
      ...region,
      value: regionData ? getDisplayValue(region.id) : 0,
      formattedValue: regionData ? formatValue(getDisplayValue(region.id), activeTab) : "N/A",
      isFiltered: isInFilteredData,
    }
  })

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="mb-4 text-center text-sm font-medium">Mapa do Brasil - Regiões</div>

      <div className="aspect-[4/5] w-full">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 750,
            center: [-55, -15],
          }}
        >
          <ZoomableGroup zoom={1} maxZoom={3} minZoom={1}>
            <Geographies geography={BRAZIL_GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const stateCode = geo.properties.sigla
                  const regionId = stateToRegion[stateCode]
                  const isInFilteredData = data.some((r) => r.id === regionId)

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getRegionColor(regionId)}
                      stroke="#FFFFFF"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", cursor: isInFilteredData ? "pointer" : "not-allowed" },
                        pressed: { outline: "none" },
                      }}
                      onMouseEnter={() => {
                        setHoveredRegion(regionId)
                        setTooltipContent(generateTooltipContent(regionId))
                      }}
                      onMouseLeave={() => {
                        setHoveredRegion(null)
                        setTooltipContent("")
                      }}
                      onClick={() => {
                        if (isInFilteredData) {
                          onRegionSelect(regionId === selectedRegion ? "all" : regionId)
                        }
                      }}
                      data-tooltip-id="map-tooltip"
                      data-tooltip-html={generateTooltipContent(regionId)}
                    />
                  )
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>

      <Tooltip id="map-tooltip" className="z-50" />

      {/* Legenda */}
      <div className="mt-4 p-3 border border-gray-200 rounded-lg">
        <div className="text-sm font-medium mb-2">Legenda</div>
        <div className="grid grid-cols-5 gap-2">
          {regionValues.map((region) => (
            <div
              key={region.id}
              className={`flex flex-col items-center ${!region.isFiltered ? "opacity-50" : ""}`}
              onClick={() => {
                if (region.isFiltered) {
                  onRegionSelect(region.id === selectedRegion ? "all" : region.id)
                }
              }}
              style={{ cursor: region.isFiltered ? "pointer" : "not-allowed" }}
            >
              <div
                className="w-4 h-4 rounded-sm mb-1"
                style={{
                  backgroundColor: region.isFiltered ? region.color : "#e5e5e5",
                  opacity: selectedRegion === region.id || selectedRegion === "all" ? 1 : 0.5,
                }}
              />
              <div className="text-xs font-medium">{region.name}</div>
              <div className="text-xs">{region.formattedValue}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BrazilRsmMap
