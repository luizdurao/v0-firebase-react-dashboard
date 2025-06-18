"use client"

import { useState, useEffect } from "react"
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps"
import { Tooltip } from "react-tooltip"
import { Loader2 } from "lucide-react"

// URL do GeoJSON oficial do Brasil com estados
const BRAZIL_GEOJSON =
  "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson"

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

// Cores das regiões
const regionColors = {
  north: "#0088FE",
  northeast: "#00C49F",
  "central-west": "#FFBB28",
  southeast: "#FF8042",
  south: "#8884D8",
}

interface BrazilMapGeolocationProps {
  selectedRegion: string
  onRegionSelect: (regionId: string) => void
  data: any[]
  activeTab: string
}

const BrazilMapGeolocation = ({ selectedRegion, onRegionSelect, data, activeTab }: BrazilMapGeolocationProps) => {
  const [geoData, setGeoData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        console.log("Carregando dados geográficos do Brasil...")
        const response = await fetch(BRAZIL_GEOJSON)

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`)
        }

        const data = await response.json()
        console.log("Dados geográficos carregados:", data)
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

  const getStateColor = (geo) => {
    if (!geo?.properties?.sigla) return "#cccccc"

    const stateCode = geo.properties.sigla
    const regionId = stateToRegion[stateCode]

    if (!regionId) return "#cccccc"

    const baseColor = regionColors[regionId]
    if (!baseColor) return "#cccccc"

    // Se uma região específica está selecionada, destacar apenas ela
    if (selectedRegion !== "all" && selectedRegion !== regionId) {
      return `${baseColor}40` // 25% opacidade
    }

    return baseColor
  }

  const generateTooltipContent = (geo) => {
    if (!geo?.properties) return "Dados não disponíveis"

    const stateCode = geo.properties.sigla || geo.properties.SIGLA
    const stateName = geo.properties.name || geo.properties.nome || geo.properties.NAME || stateCode
    const regionId = stateToRegion[stateCode]

    if (!regionId) return `${stateName}: Região não identificada`

    const regionData = data.find((r) => r.id === regionId)
    if (!regionData) return `${stateName}: Sem dados disponíveis`

    const regionName = regionData.name
    const hospitals = regionData.hospitals || regionData.healthMetrics?.hospitals?.total || "N/A"
    const doctors = regionData.doctors || regionData.healthMetrics?.doctors?.total || "N/A"
    const beds = regionData.beds || regionData.healthMetrics?.beds?.total || "N/A"

    return `
      <div class="p-3 bg-white rounded-lg shadow-lg border">
        <div class="font-bold text-lg mb-2">${stateName}</div>
        <div class="text-sm text-gray-600 mb-2">Região: ${regionName}</div>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div><strong>Hospitais:</strong></div>
          <div>${typeof hospitals === "number" ? hospitals.toLocaleString() : hospitals}</div>
          <div><strong>Médicos:</strong></div>
          <div>${typeof doctors === "number" ? doctors.toLocaleString() : doctors}</div>
          <div><strong>Leitos:</strong></div>
          <div>${typeof beds === "number" ? beds.toLocaleString() : beds}</div>
        </div>
      </div>
    `
  }

  if (loading) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm text-gray-600">Carregando mapa do Brasil...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center bg-red-50 rounded-lg border border-red-200">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-2">Erro ao carregar o mapa</p>
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  if (!geoData) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-600">Dados do mapa não disponíveis</p>
      </div>
    )
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Mapa do Brasil -{" "}
          {activeTab === "hospitals"
            ? "Hospitais"
            : activeTab === "doctors"
              ? "Médicos"
              : activeTab === "beds"
                ? "Leitos"
                : activeTab === "equipment"
                  ? "Equipamentos"
                  : "Acesso à Saúde"}
        </h3>

        <div className="aspect-[4/3] w-full">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 700,
              center: [-55, -15],
            }}
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableGroup>
              <Geographies geography={geoData}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const stateCode = geo.properties.sigla || geo.properties.SIGLA
                    const regionId = stateToRegion[stateCode]

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={getStateColor(geo)}
                        stroke="#FFFFFF"
                        strokeWidth={0.8}
                        style={{
                          default: {
                            outline: "none",
                            cursor: "pointer",
                          },
                          hover: {
                            outline: "none",
                            fill: getStateColor(geo),
                            opacity: 0.8,
                            stroke: "#333",
                            strokeWidth: 1.2,
                          },
                          pressed: {
                            outline: "none",
                            fill: getStateColor(geo),
                            opacity: 0.9,
                          },
                        }}
                        data-tooltip-id="brazil-map-tooltip"
                        data-tooltip-html={generateTooltipContent(geo)}
                        onClick={() => {
                          if (regionId) {
                            onRegionSelect(regionId)
                          }
                        }}
                      />
                    )
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>

        <Tooltip
          id="brazil-map-tooltip"
          className="z-50 max-w-xs"
          style={{
            backgroundColor: "white",
            color: "black",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "0",
          }}
        />

        {/* Legenda */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-3 text-center">Regiões do Brasil</h4>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(regionColors).map(([regionId, color]) => {
              const regionData = data.find((r) => r.id === regionId)
              const regionName = regionData?.name || regionId

              return (
                <div
                  key={regionId}
                  className="flex items-center gap-2 cursor-pointer hover:bg-white px-2 py-1 rounded"
                  onClick={() => onRegionSelect(regionId)}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{
                      backgroundColor: color,
                      opacity: selectedRegion === regionId || selectedRegion === "all" ? 1 : 0.4,
                    }}
                  />
                  <span className={`text-sm ${selectedRegion === regionId ? "font-bold" : ""}`}>{regionName}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BrazilMapGeolocation
