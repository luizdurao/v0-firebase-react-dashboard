"use client"

import { useState, useEffect } from "react"
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps"
import { Tooltip } from "react-tooltip"
import { stateData } from "@/lib/state-map-data"

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
  viewMode: "region" | "state"
}

const BrazilRsmMap = ({ selectedRegion, onRegionSelect, data, activeTab, viewMode }: BrazilRsmMapProps) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [hoveredState, setHoveredState] = useState<string | null>(null)
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [tooltipContent, setTooltipContent] = useState("")
  const [geoData, setGeoData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch GeoJSON data
  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        setLoading(true)
        const response = await fetch(BRAZIL_GEO_URL)
        if (!response.ok) {
          throw new Error(`Failed to fetch GeoJSON: ${response.status}`)
        }
        const data = await response.json()
        setGeoData(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching GeoJSON:", err)
        setError(err.message || "Failed to load map data")
        setLoading(false)
      }
    }

    fetchGeoData()
  }, [])

  // Obter valor para exibir com base na aba ativa
  const getDisplayValue = (regionId, stateId = null) => {
    if (viewMode === "state" && stateId) {
      const state = stateData.find((s) => s.id === stateId)
      if (!state) return 0

      switch (activeTab) {
        case "hospitals":
          return state.hospitals || 0
        case "doctors":
          return state.doctors || 0
        case "beds":
          return state.beds || 0
        case "equipment":
          return state.medicalEquipment?.mri || 0
        case "access":
          return state.urbanAccessIndex || 0
        default:
          return 0
      }
    } else {
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
          return 0
      }
    }
  }

  // Obter valor máximo para o tipo de dado atual
  const getMaxValue = () => {
    if (viewMode === "state") {
      switch (activeTab) {
        case "hospitals":
          return Math.max(...stateData.map((s) => s.hospitals || 0))
        case "doctors":
          return Math.max(...stateData.map((s) => s.doctors || 0))
        case "beds":
          return Math.max(...stateData.map((s) => s.beds || 0))
        case "equipment":
          return Math.max(...stateData.map((s) => s.medicalEquipment?.mri || 0))
        case "access":
          return Math.max(...stateData.map((s) => s.urbanAccessIndex || 0))
        default:
          return 1
      }
    } else {
      switch (activeTab) {
        case "hospitals":
          return Math.max(...data.map((r) => r.hospitals || 0))
        case "doctors":
          return Math.max(...data.map((r) => r.doctors || 0))
        case "beds":
          return Math.max(...data.map((r) => r.beds || 0))
        case "equipment":
          return Math.max(...data.map((r) => r.medicalEquipment?.mri || 0))
        case "access":
          return Math.max(...data.map((r) => r.urbanAccessIndex || 0))
        default:
          return 1
      }
    }
  }

  // Calcular a intensidade da cor com base no valor
  const getColorIntensity = (value, maxValue) => {
    if (!value || !maxValue) return 0.3
    const intensity = Math.min(value / maxValue, 1)
    return 0.3 + intensity * 0.7 // Varia de 30% a 100% de intensidade
  }

  // Obter cor da região ou estado com base na seleção e hover
  const getRegionColor = (regionId, stateId = null) => {
    if (viewMode === "state" && stateId) {
      // Modo de visualização por estado
      const state = stateData.find((s) => s.id === stateId)
      if (!state) return "#cccccc"

      // Verificar se a região do estado está nos dados filtrados
      const isInFilteredData = data.some((r) => r.id === state.region)
      if (!isInFilteredData) return "#e5e5e5" // Light gray for filtered out states

      const region = regions.find((r) => r.id === state.region)
      if (!region) return "#cccccc"

      const isHovered = hoveredState === stateId
      const isSelected = selectedState === stateId

      // Obter valor máximo para o tipo de dado atual
      const maxValue = getMaxValue()

      // Obter valor do estado atual
      const value = getDisplayValue(null, stateId)

      // Calcular intensidade da cor
      const intensity = getColorIntensity(value, maxValue)

      // Aplicar intensidade à cor base da região
      const baseColor = region.color

      if (isHovered || isSelected) {
        return baseColor // Cor completa quando hover ou selecionado
      } else {
        // Ajustar a opacidade com base no valor relativo
        const r = Number.parseInt(baseColor.slice(1, 3), 16)
        const g = Number.parseInt(baseColor.slice(3, 5), 16)
        const b = Number.parseInt(baseColor.slice(5, 7), 16)
        return `rgba(${r}, ${g}, ${b}, ${intensity})`
      }
    } else {
      // Modo de visualização por região
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
  const generateTooltipContent = (regionId, stateId = null) => {
    if (viewMode === "state" && stateId) {
      // Modo de visualização por estado
      const state = stateData.find((s) => s.id === stateId)
      if (!state) return "Dados não disponíveis"

      const region = regions.find((r) => r.id === state.region)
      const regionName = region ? region.name : state.region

      // Obter valor específico para a aba ativa
      let specificValue = "N/A"
      let specificLabel = ""

      switch (activeTab) {
        case "hospitals":
          specificValue = state.hospitals.toLocaleString()
          specificLabel = "Hospitais"
          break
        case "doctors":
          specificValue = state.doctors.toLocaleString()
          specificLabel = "Médicos"
          break
        case "beds":
          specificValue = state.beds.toLocaleString()
          specificLabel = "Leitos"
          break
        case "equipment":
          specificValue = state.medicalEquipment.mri.toLocaleString()
          specificLabel = "Equipamentos de RM"
          break
        case "access":
          specificValue = `${state.urbanAccessIndex.toFixed(1)}%`
          specificLabel = "Acesso Urbano"
          break
      }

      return `
        <div class="p-2">
          <div class="text-lg font-bold mb-1">${state.name}</div>
          <div class="text-sm text-gray-500 mb-2">Região: ${regionName}</div>
          <div class="grid grid-cols-2 gap-x-4 gap-y-1">
            <div class="font-medium">${specificLabel}:</div>
            <div class="font-bold">${specificValue}</div>
            <div class="font-medium">População:</div>
            <div>${state.population.toLocaleString()}</div>
          </div>
        </div>
      `
    } else {
      // Modo de visualização por região
      const region = regions.find((r) => r.id === regionId)
      if (!region) return "Dados não disponíveis"

      const regionData = data.find((r) => r.id === regionId)
      if (!regionData) return `${region.name}: Sem dados disponíveis`

      // Obter valor específico para a aba ativa
      let specificValue = "N/A"
      let specificLabel = ""

      switch (activeTab) {
        case "hospitals":
          specificValue = regionData.hospitals.toLocaleString()
          specificLabel = "Hospitais"
          break
        case "doctors":
          specificValue = regionData.doctors.toLocaleString()
          specificLabel = "Médicos"
          break
        case "beds":
          specificValue = regionData.beds.toLocaleString()
          specificLabel = "Leitos"
          break
        case "equipment":
          specificValue = regionData.medicalEquipment?.mri.toLocaleString() || "N/A"
          specificLabel = "Equipamentos de RM"
          break
        case "access":
          specificValue = `${regionData.urbanAccessIndex.toFixed(1)}%`
          specificLabel = "Acesso Urbano"
          break
      }

      return `
        <div class="p-2">
          <div class="text-lg font-bold mb-1">${region.name}</div>
          <div class="grid grid-cols-2 gap-x-4 gap-y-1">
            <div class="font-medium">${specificLabel}:</div>
            <div class="font-bold">${specificValue}</div>
            <div class="font-medium">População:</div>
            <div>${regionData.population.toLocaleString()}</div>
          </div>
        </div>
      `
    }
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

  // Calcular valores por estado
  const stateValues = stateData.map((state) => {
    const isInFilteredData = data.some((r) => r.id === state.region)
    let value = 0

    switch (activeTab) {
      case "hospitals":
        value = state.hospitals
        break
      case "doctors":
        value = state.doctors
        break
      case "beds":
        value = state.beds
        break
      case "equipment":
        value = state.medicalEquipment.mri
        break
      case "access":
        value = state.urbanAccessIndex
        break
    }

    return {
      ...state,
      value,
      formattedValue: formatValue(value, activeTab),
      isFiltered: isInFilteredData,
    }
  })

  // Show loading state
  if (loading) {
    return (
      <div
        className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center justify-center"
        style={{ minHeight: "400px" }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-500">Carregando mapa do Brasil...</p>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div
        className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center justify-center"
        style={{ minHeight: "400px" }}
      >
        <div className="text-red-500 text-xl mb-2">Erro ao carregar o mapa</div>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          onClick={() => window.location.reload()}
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="mb-4 text-center text-sm font-medium">
        Mapa do Brasil - {viewMode === "state" ? "Estados" : "Regiões"}
      </div>

      <div className="aspect-[4/5] w-full">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 750,
            center: [-55, -15],
          }}
        >
          <ZoomableGroup zoom={1} maxZoom={3} minZoom={1}>
            <Geographies geography={geoData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const stateCode = geo.properties.sigla
                  const regionId = stateToRegion[stateCode]
                  const isInFilteredData = data.some((r) => r.id === regionId)

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={viewMode === "state" ? getRegionColor(regionId, stateCode) : getRegionColor(regionId)}
                      stroke="#FFFFFF"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", cursor: isInFilteredData ? "pointer" : "not-allowed" },
                        pressed: { outline: "none" },
                      }}
                      onMouseEnter={() => {
                        if (viewMode === "state") {
                          setHoveredState(stateCode)
                          setTooltipContent(generateTooltipContent(regionId, stateCode))
                        } else {
                          setHoveredRegion(regionId)
                          setTooltipContent(generateTooltipContent(regionId))
                        }
                      }}
                      onMouseLeave={() => {
                        if (viewMode === "state") {
                          setHoveredState(null)
                        } else {
                          setHoveredRegion(null)
                        }
                        setTooltipContent("")
                      }}
                      onClick={() => {
                        if (viewMode === "state") {
                          setSelectedState(selectedState === stateCode ? null : stateCode)
                        } else {
                          if (isInFilteredData) {
                            onRegionSelect(regionId === selectedRegion ? "all" : regionId)
                          }
                        }
                      }}
                      data-tooltip-id="map-tooltip"
                      data-tooltip-html={
                        viewMode === "state"
                          ? generateTooltipContent(regionId, stateCode)
                          : generateTooltipContent(regionId)
                      }
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
        <div className="text-sm font-medium mb-2">
          Legenda -{" "}
          {activeTab === "hospitals"
            ? "Hospitais"
            : activeTab === "doctors"
              ? "Médicos"
              : activeTab === "beds"
                ? "Leitos"
                : activeTab === "equipment"
                  ? "Equipamentos"
                  : "Acesso"}
        </div>
        {viewMode === "state" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {regions.map((region) => {
              const isInFilteredData = data.some((r) => r.id === region.id)
              const regionStates = stateValues.filter((s) => s.region === region.id && s.isFiltered)

              if (regionStates.length === 0) return null

              return (
                <div key={region.id} className="mb-2">
                  <div className="flex items-center mb-1">
                    <div
                      className="w-3 h-3 rounded-sm mr-1"
                      style={{
                        backgroundColor: isInFilteredData ? region.color : "#e5e5e5",
                      }}
                    />
                    <div className="text-xs font-medium">{region.name}</div>
                  </div>
                  <div className="pl-4 max-h-32 overflow-y-auto">
                    {regionStates
                      .sort((a, b) => b.value - a.value) // Ordenar por valor (maior para menor)
                      .map((state) => (
                        <div
                          key={state.id}
                          className={`text-xs mb-1 cursor-pointer hover:underline flex justify-between ${
                            selectedState === state.id ? "font-bold" : ""
                          }`}
                          onClick={() => setSelectedState(selectedState === state.id ? null : state.id)}
                        >
                          <span>{state.name}</span>
                          <span className="text-gray-600">{state.formattedValue}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-2">
            {regionValues
              .sort((a, b) => b.value - a.value) // Ordenar por valor (maior para menor)
              .map((region) => (
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
        )}
      </div>

      {/* Detalhes do estado selecionado */}
      {viewMode === "state" && selectedState && (
        <div className="mt-4 p-3 border border-gray-200 rounded-lg">
          <div className="text-sm font-medium mb-2">Detalhes do Estado</div>
          {(() => {
            const state = stateData.find((s) => s.id === selectedState)
            if (!state) return <div className="text-xs">Estado não encontrado</div>

            return (
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs font-medium">Nome:</div>
                <div className="text-xs">{state.name}</div>
                <div className="text-xs font-medium">Região:</div>
                <div className="text-xs">{regions.find((r) => r.id === state.region)?.name}</div>
                <div className="text-xs font-medium">Hospitais:</div>
                <div className="text-xs">{state.hospitals.toLocaleString()}</div>
                <div className="text-xs font-medium">Médicos:</div>
                <div className="text-xs">{state.doctors.toLocaleString()}</div>
                <div className="text-xs font-medium">Leitos:</div>
                <div className="text-xs">{state.beds.toLocaleString()}</div>
                <div className="text-xs font-medium">Equipamentos de RM:</div>
                <div className="text-xs">{state.medicalEquipment.mri.toLocaleString()}</div>
                <div className="text-xs font-medium">Acesso Urbano:</div>
                <div className="text-xs">{state.urbanAccessIndex.toFixed(1)}%</div>
                <div className="text-xs font-medium">Acesso Rural:</div>
                <div className="text-xs">{state.ruralAccessIndex.toFixed(1)}%</div>
                <div className="text-xs font-medium">População:</div>
                <div className="text-xs">{state.population.toLocaleString()}</div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}

export default BrazilRsmMap
