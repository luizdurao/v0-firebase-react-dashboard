"use client"

import { useState, useEffect } from "react"
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

// Dados dos estados com cores
const states = [
  // Norte
  { id: "AC", name: "Acre", region: "north", color: "#0088FE" },
  { id: "AM", name: "Amazonas", region: "north", color: "#0088FE" },
  { id: "AP", name: "Amapá", region: "north", color: "#0088FE" },
  { id: "PA", name: "Pará", region: "north", color: "#0088FE" },
  { id: "RO", name: "Rondônia", region: "north", color: "#0088FE" },
  { id: "RR", name: "Roraima", region: "north", color: "#0088FE" },
  { id: "TO", name: "Tocantins", region: "north", color: "#0088FE" },

  // Nordeste
  { id: "AL", name: "Alagoas", region: "northeast", color: "#00C49F" },
  { id: "BA", name: "Bahia", region: "northeast", color: "#00C49F" },
  { id: "CE", name: "Ceará", region: "northeast", color: "#00C49F" },
  { id: "MA", name: "Maranhão", region: "northeast", color: "#00C49F" },
  { id: "PB", name: "Paraíba", region: "northeast", color: "#00C49F" },
  { id: "PE", name: "Pernambuco", region: "northeast", color: "#00C49F" },
  { id: "PI", name: "Piauí", region: "northeast", color: "#00C49F" },
  { id: "RN", name: "Rio Grande do Norte", region: "northeast", color: "#00C49F" },
  { id: "SE", name: "Sergipe", region: "northeast", color: "#00C49F" },

  // Centro-Oeste
  { id: "DF", name: "Distrito Federal", region: "central-west", color: "#FFBB28" },
  { id: "GO", name: "Goiás", region: "central-west", color: "#FFBB28" },
  { id: "MT", name: "Mato Grosso", region: "central-west", color: "#FFBB28" },
  { id: "MS", name: "Mato Grosso do Sul", region: "central-west", color: "#FFBB28" },

  // Sudeste
  { id: "ES", name: "Espírito Santo", region: "southeast", color: "#FF8042" },
  { id: "MG", name: "Minas Gerais", region: "southeast", color: "#FF8042" },
  { id: "RJ", name: "Rio de Janeiro", region: "southeast", color: "#FF8042" },
  { id: "SP", name: "São Paulo", region: "southeast", color: "#FF8042" },

  // Sul
  { id: "PR", name: "Paraná", region: "south", color: "#8884D8" },
  { id: "RS", name: "Rio Grande do Sul", region: "south", color: "#8884D8" },
  { id: "SC", name: "Santa Catarina", region: "south", color: "#8884D8" },
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

  // Obter cor da região ou estado com base na seleção e hover
  const getRegionColor = (regionId, stateId = null) => {
    if (viewMode === "state" && stateId) {
      // Modo de visualização por estado
      const state = states.find((s) => s.id === stateId)
      if (!state) return "#cccccc"

      // Verificar se a região do estado está nos dados filtrados
      const isInFilteredData = data.some((r) => r.id === state.region)
      if (!isInFilteredData) return "#e5e5e5" // Light gray for filtered out states

      const isHovered = hoveredState === stateId
      const isSelected = selectedState === stateId

      if (isHovered) {
        return state.color // Cor mais intensa no hover
      } else if (isSelected) {
        return state.color
      } else {
        // Versão mais clara da cor quando não selecionada
        return `${state.color}80` // 50% de opacidade
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
      const state = states.find((s) => s.id === stateId)
      if (!state) return "Dados não disponíveis"

      const regionData = data.find((r) => r.id === state.region)
      if (!regionData) return `${state.name}: Sem dados disponíveis`

      // Encontrar dados do estado nas distribuições da região
      let stateHospitals = "N/A"
      let stateDoctors = "N/A"

      if (regionData.healthMetrics?.hospitals?.distribution) {
        const hospitalData = regionData.healthMetrics.hospitals.distribution.find((d) => d.state === stateId)
        if (hospitalData) stateHospitals = hospitalData.count.toLocaleString()
      }

      if (regionData.healthMetrics?.doctors?.distribution) {
        const doctorData = regionData.healthMetrics.doctors.distribution.find((d) => d.state === stateId)
        if (doctorData) stateDoctors = doctorData.count.toLocaleString()
      }

      return `
        <div class="p-2">
          <div class="text-lg font-bold mb-1">${state.name}</div>
          <div class="grid grid-cols-2 gap-x-4 gap-y-1">
            <div class="font-medium">Hospitais:</div>
            <div>${stateHospitals}</div>
            <div class="font-medium">Médicos:</div>
            <div>${stateDoctors}</div>
            <div class="font-medium">Região:</div>
            <div>${regions.find((r) => r.id === state.region)?.name || state.region}</div>
          </div>
        </div>
      `
    } else {
      // Modo de visualização por região
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

  // Fallback to simplified map if GeoJSON fails to load
  if (!geoData) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="mb-4 text-center text-sm font-medium">Mapa do Brasil - Regiões (Simplificado)</div>

        <div className="aspect-[4/5] w-full relative">
          <svg viewBox="0 0 450 500" className="w-full h-full">
            {/* Simplified region shapes */}
            <path
              d="M100,100 L250,120 L230,220 L80,200 Z"
              fill={getRegionColor("north")}
              stroke="#FFFFFF"
              strokeWidth="2"
              onMouseEnter={() => {
                setHoveredRegion("north")
                setTooltipContent(generateTooltipContent("north"))
              }}
              onMouseLeave={() => {
                setHoveredRegion(null)
                setTooltipContent("")
              }}
              onClick={() => onRegionSelect("north")}
              data-tooltip-id="map-tooltip"
              data-tooltip-html={generateTooltipContent("north")}
            />
            <path
              d="M250,120 L350,150 L320,250 L230,220 Z"
              fill={getRegionColor("northeast")}
              stroke="#FFFFFF"
              strokeWidth="2"
              onMouseEnter={() => {
                setHoveredRegion("northeast")
                setTooltipContent(generateTooltipContent("northeast"))
              }}
              onMouseLeave={() => {
                setHoveredRegion(null)
                setTooltipContent("")
              }}
              onClick={() => onRegionSelect("northeast")}
              data-tooltip-id="map-tooltip"
              data-tooltip-html={generateTooltipContent("northeast")}
            />
            <path
              d="M80,200 L230,220 L200,320 L50,300 Z"
              fill={getRegionColor("central-west")}
              stroke="#FFFFFF"
              strokeWidth="2"
              onMouseEnter={() => {
                setHoveredRegion("central-west")
                setTooltipContent(generateTooltipContent("central-west"))
              }}
              onMouseLeave={() => {
                setHoveredRegion(null)
                setTooltipContent("")
              }}
              onClick={() => onRegionSelect("central-west")}
              data-tooltip-id="map-tooltip"
              data-tooltip-html={generateTooltipContent("central-west")}
            />
            <path
              d="M230,220 L320,250 L290,350 L200,320 Z"
              fill={getRegionColor("southeast")}
              stroke="#FFFFFF"
              strokeWidth="2"
              onMouseEnter={() => {
                setHoveredRegion("southeast")
                setTooltipContent(generateTooltipContent("southeast"))
              }}
              onMouseLeave={() => {
                setHoveredRegion(null)
                setTooltipContent("")
              }}
              onClick={() => onRegionSelect("southeast")}
              data-tooltip-id="map-tooltip"
              data-tooltip-html={generateTooltipContent("southeast")}
            />
            <path
              d="M200,320 L290,350 L260,450 L170,420 Z"
              fill={getRegionColor("south")}
              stroke="#FFFFFF"
              strokeWidth="2"
              onMouseEnter={() => {
                setHoveredRegion("south")
                setTooltipContent(generateTooltipContent("south"))
              }}
              onMouseLeave={() => {
                setHoveredRegion(null)
                setTooltipContent("")
              }}
              onClick={() => onRegionSelect("south")}
              data-tooltip-id="map-tooltip"
              data-tooltip-html={generateTooltipContent("south")}
            />

            {/* Region labels */}
            <text x="150" y="160" className="text-xs font-medium" fill="#000000">
              Norte
            </text>
            <text x="280" y="180" className="text-xs font-medium" fill="#000000">
              Nordeste
            </text>
            <text x="130" y="260" className="text-xs font-medium" fill="#000000">
              Centro-Oeste
            </text>
            <text x="250" y="280" className="text-xs font-medium" fill="#000000">
              Sudeste
            </text>
            <text x="220" y="380" className="text-xs font-medium" fill="#000000">
              Sul
            </text>
          </svg>
        </div>

        <Tooltip id="map-tooltip" className="z-50" />

        {/* Legenda */}
        <div className="mt-4 p-3 border border-gray-200 rounded-lg">
          <div className="text-sm font-medium mb-2">Legenda</div>
          {viewMode === "state" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {regions.map((region) => {
                const isInFilteredData = data.some((r) => r.id === region.id)
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
                    <div className="pl-4">
                      {states
                        .filter((state) => state.region === region.id)
                        .map((state) => (
                          <div
                            key={state.id}
                            className="text-xs mb-1 cursor-pointer hover:underline"
                            onClick={() => setSelectedState(selectedState === state.id ? null : state.id)}
                          >
                            {state.name}
                          </div>
                        ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
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
          )}
        </div>
      </div>
    )
  }

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
                        hover: { outline: "none", cursor: "pointer" },
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
                          const isInFilteredData = data.some((r) => r.id === regionId)
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
        <div className="text-sm font-medium mb-2">Legenda</div>
        {viewMode === "state" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {regions.map((region) => {
              const isInFilteredData = data.some((r) => r.id === region.id)
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
                  <div className="pl-4">
                    {states
                      .filter((state) => state.region === region.id)
                      .map((state) => (
                        <div
                          key={state.id}
                          className="text-xs mb-1 cursor-pointer hover:underline"
                          onClick={() => setSelectedState(selectedState === state.id ? null : state.id)}
                        >
                          {state.name}
                        </div>
                      ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
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
        )}
      </div>
    </div>
  )
}

export default BrazilRsmMap
