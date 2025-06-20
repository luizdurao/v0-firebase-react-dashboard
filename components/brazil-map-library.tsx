"use client"

import { useState, useEffect } from "react"
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps"
import { Tooltip } from "react-tooltip"
import { Loader2 } from "lucide-react"

// Definição das regiões do Brasil com suas cores
const regions = [
  { id: "north", name: "Norte", color: "#0088FE" },
  { id: "northeast", name: "Nordeste", color: "#00C49F" },
  { id: "central-west", name: "Centro-Oeste", color: "#FFBB28" },
  { id: "southeast", name: "Sudeste", color: "#FF8042" },
  { id: "south", name: "Sul", color: "#8884D8" },
]

// Mapeamento de estados para regiões
const stateToRegion = {
  // Norte
  AC: "north",
  AM: "north",
  AP: "north",
  PA: "north",
  RO: "north",
  RR: "north",
  TO: "north",
  // Nordeste
  AL: "northeast",
  BA: "northeast",
  CE: "northeast",
  MA: "northeast",
  PB: "northeast",
  PE: "northeast",
  PI: "northeast",
  RN: "northeast",
  SE: "northeast",
  // Centro-Oeste
  DF: "central-west",
  GO: "central-west",
  MT: "central-west",
  MS: "central-west",
  // Sudeste
  ES: "southeast",
  MG: "southeast",
  RJ: "southeast",
  SP: "southeast",
  // Sul
  PR: "south",
  RS: "south",
  SC: "south",
}

// URL do GeoJSON do Brasil
const BRAZIL_GEOJSON =
  "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson"

interface BrazilMapProps {
  selectedRegion: string
  onRegionSelect: (regionId: string) => void
  data: any[]
  activeTab: string
}

const BrazilMapLibrary = ({ selectedRegion, onRegionSelect, data, activeTab }: BrazilMapProps) => {
  const [geoData, setGeoData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar dados geográficos do Brasil
  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        console.log("Carregando GeoJSON do Brasil...")
        const response = await fetch(BRAZIL_GEOJSON)

        if (!response.ok) {
          throw new Error(`Erro ao carregar GeoJSON: ${response.status}`)
        }

        const data = await response.json()
        console.log("GeoJSON carregado com sucesso")
        setGeoData(data)
        setLoading(false)
      } catch (error) {
        console.error("Erro ao carregar dados geográficos:", error)
        setError(`Erro ao carregar mapa: ${error.message}`)
        setLoading(false)
      }
    }

    fetchGeoData()
  }, [])

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

  // Obter título da métrica com base na aba ativa
  const getMetricTitle = () => {
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

  // Obter cor do estado com base na região
  const getStateColor = (geo) => {
    if (!geo?.properties?.sigla) return "#cccccc"

    const stateCode = geo.properties.sigla
    const regionId = stateToRegion[stateCode]

    if (!regionId) return "#cccccc"

    const region = regions.find((r) => r.id === regionId)
    if (!region) return "#cccccc"

    const isSelected = selectedRegion === regionId || selectedRegion === "all"
    return isSelected ? region.color : `${region.color}80` // 50% de opacidade se não selecionado
  }

  // Gerar conteúdo do tooltip
  const generateTooltipContent = (geo) => {
    if (!geo?.properties?.sigla) return "Dados não disponíveis"

    const stateCode = geo.properties.sigla
    const stateName = geo.properties.name || geo.properties.nome || stateCode
    const regionId = stateToRegion[stateCode]

    if (!regionId) return `${stateName}: Região não mapeada`

    const region = regions.find((r) => r.id === regionId)
    const regionData = data.find((r) => r.id === regionId)

    if (!regionData) return `${stateName}: Sem dados disponíveis`

    const hospitals = regionData.hospitals || regionData.healthMetrics?.hospitals?.total || "N/A"
    const doctors =
      regionData.doctors?.toLocaleString() || regionData.healthMetrics?.doctors?.total?.toLocaleString() || "N/A"
    const beds = regionData.beds?.toLocaleString() || regionData.healthMetrics?.beds?.total?.toLocaleString() || "N/A"
    const urbanAccess = regionData.urbanAccessIndex || regionData.healthMetrics?.access?.urban || "N/A"

    return `
      <div class="p-2">
        <div class="text-lg font-bold mb-1">${stateName} (${region?.name})</div>
        <div class="grid grid-cols-2 gap-x-4 gap-y-1">
          <div class="font-medium">Hospitais:</div>
          <div>${hospitals}</div>
          <div class="font-medium">Médicos:</div>
          <div>${doctors}</div>
          <div class="font-medium">Leitos:</div>
          <div>${beds}</div>
          <div class="font-medium">Acesso Urbano:</div>
          <div>${urbanAccess}%</div>
        </div>
      </div>
    `
  }

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Carregando mapa do Brasil...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-red-500 font-medium">Erro ao carregar o mapa</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (!geoData) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center gap-2">
          <p className="text-red-500 font-medium">Dados geográficos não disponíveis</p>
          <p className="text-sm text-muted-foreground">Não foi possível carregar o mapa do Brasil</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="mb-4 text-center text-sm font-medium">Mapa do Brasil - {getMetricTitle()}</div>

      <div className="aspect-[4/3] w-full">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 750,
            center: [-55, -15],
          }}
        >
          <ZoomableGroup>
            <Geographies geography={geoData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const stateCode = geo.properties.sigla
                  const regionId = stateToRegion[stateCode]

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getStateColor(geo)}
                      stroke="#FFFFFF"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", fill: getStateColor(geo), opacity: 0.8 },
                        pressed: { outline: "none" },
                      }}
                      data-tooltip-id="map-tooltip"
                      data-tooltip-html={generateTooltipContent(geo)}
                      onClick={() => regionId && onRegionSelect(regionId)}
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

export default BrazilMapLibrary
