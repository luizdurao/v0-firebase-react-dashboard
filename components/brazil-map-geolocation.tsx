"use client"

import { useState, useEffect } from "react"
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps"
import { Tooltip } from "react-tooltip"
import { Loader2 } from "lucide-react"
import { loadRealHospitalData } from "@/lib/real-data-processor"

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

// Mapeamento de siglas para nomes completos
const stateNames = {
  AC: "Acre",
  AL: "Alagoas",
  AP: "Amapá",
  AM: "Amazonas",
  BA: "Bahia",
  CE: "Ceará",
  DF: "Distrito Federal",
  ES: "Espírito Santo",
  GO: "Goiás",
  MA: "Maranhão",
  MT: "Mato Grosso",
  MS: "Mato Grosso do Sul",
  MG: "Minas Gerais",
  PA: "Pará",
  PB: "Paraíba",
  PR: "Paraná",
  PE: "Pernambuco",
  PI: "Piauí",
  RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul",
  RO: "Rondônia",
  RR: "Roraima",
  SC: "Santa Catarina",
  SP: "São Paulo",
  SE: "Sergipe",
  TO: "Tocantins",
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
  data: any[] // Dados filtrados das regiões
  activeTab: string
  viewMode?: string
  filteredRegions?: string[]
}

const BrazilMapGeolocation = ({
  selectedRegion,
  onRegionSelect,
  data, // Usar os dados passados como prop
  activeTab,
  viewMode,
  filteredRegions = [],
}: BrazilMapGeolocationProps) => {
  const [geoData, setGeoData] = useState<any>(null)
  const [hospitalData, setHospitalData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Carregando dados geográficos e hospitalares...")
        console.log("Dados filtrados recebidos:", data)

        // Carregar dados geográficos
        const geoResponse = await fetch(BRAZIL_GEOJSON)
        if (!geoResponse.ok) {
          throw new Error(`Erro HTTP: ${geoResponse.status}`)
        }
        const geoData = await geoResponse.json()

        // Carregar dados hospitalares (para detalhes por estado)
        const hospitalData = await loadRealHospitalData()

        setGeoData(geoData)
        setHospitalData(hospitalData)
        setLoading(false)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        setError(`Erro ao carregar dados: ${error.message}`)
        setLoading(false)
      }
    }

    fetchData()
  }, [data]) // Re-carregar quando os dados mudarem

  // Verificar se uma região está nos dados filtrados
  const isRegionInFilteredData = (regionId: string) => {
    return data.some((region) => region.id === regionId)
  }

  // Verificar se uma região está nos filtros selecionados
  const isRegionFiltered = (regionId: string) => {
    if (filteredRegions.length === 0) return true
    return filteredRegions.includes(regionId)
  }

  // Verificar se uma região deve ser mostrada (está nos dados E nos filtros)
  const shouldShowRegion = (regionId: string) => {
    return isRegionInFilteredData(regionId) && isRegionFiltered(regionId)
  }

  const getStateColor = (geo) => {
    if (!geo?.properties?.sigla) return "#cccccc"

    const stateCode = geo.properties.sigla
    const regionId = stateToRegion[stateCode]

    if (!regionId) return "#cccccc"

    // Verificar se a região deve ser mostrada
    if (!shouldShowRegion(regionId)) {
      return "#f0f0f0" // Cor cinza claro para regiões filtradas
    }

    const baseColor = regionColors[regionId]
    if (!baseColor) return "#cccccc"

    // Se uma região específica está selecionada, destacar apenas ela
    if (selectedRegion !== "all" && selectedRegion !== regionId) {
      return `${baseColor}40` // 25% opacidade
    }

    return baseColor
  }

  const generateTooltipContent = (geo) => {
    if (!geo?.properties || !hospitalData) return "Dados não disponíveis"

    const stateCode = geo.properties.sigla || geo.properties.SIGLA
    const stateName = stateNames[stateCode] || stateCode
    const regionId = stateToRegion[stateCode]

    if (!regionId) return `${stateName}: Região não identificada`

    // Verificar se a região deve ser mostrada
    if (!shouldShowRegion(regionId)) {
      const reason = !isRegionInFilteredData(regionId)
        ? "Região não atende aos filtros de valor"
        : "Região desmarcada nos filtros"
      return `${stateName}: ${reason}`
    }

    // Buscar dados da região filtrada
    const regionData = data.find((region) => region.id === regionId)
    if (!regionData) return `${stateName}: Dados da região não disponíveis`

    // Buscar dados reais do estado para detalhes
    const stateData = hospitalData[stateName]
    if (!stateData) return `${stateName}: Sem dados detalhados disponíveis`

    const regionName =
      {
        north: "Norte",
        northeast: "Nordeste",
        "central-west": "Centro-Oeste",
        southeast: "Sudeste",
        south: "Sul",
      }[regionId] || regionId

    const hospitals = stateData.Hospitais_Privados_2024
    const beds = stateData.Leitos_Privados_2024
    const bedsPerHospital = Math.round(beds / hospitals)

    // Mostrar dados da região (agregados) e do estado (específicos)
    return `
      <div class="p-3 bg-white rounded-lg shadow-lg border max-w-xs">
        <div class="font-bold text-lg mb-2">${stateName}</div>
        <div class="text-sm text-gray-600 mb-2">Região: ${regionName}</div>
        
        <div class="mb-2 p-2 bg-blue-50 rounded text-xs">
          <div class="font-medium">Dados da Região (Filtrados):</div>
          <div>Hospitais: ${regionData.hospitals.toLocaleString()}</div>
          <div>Leitos: ${regionData.beds.toLocaleString()}</div>
        </div>
        
        <div class="space-y-1 text-sm">
          <div class="font-medium">Dados do Estado:</div>
          <div class="flex justify-between">
            <span>Hospitais Privados:</span>
            <span class="${activeTab === "hospitals" ? "font-bold text-blue-600" : ""}">${hospitals.toLocaleString()}</span>
          </div>
          <div class="flex justify-between">
            <span>Leitos Privados:</span>
            <span class="${activeTab === "beds" ? "font-bold text-green-600" : ""}">${beds.toLocaleString()}</span>
          </div>
          <div class="flex justify-between">
            <span>Leitos/Hospital:</span>
            <span>${bedsPerHospital}</span>
          </div>
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

  if (!geoData || !hospitalData) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-600">Dados do mapa não disponíveis</p>
      </div>
    )
  }

  // Calcular estatísticas dos dados filtrados
  const filteredStats = {
    totalHospitals: data.reduce((sum, region) => sum + (region.hospitals || 0), 0),
    totalBeds: data.reduce((sum, region) => sum + (region.beds || 0), 0),
    regionsCount: data.length,
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-center">
          Mapa do Brasil - {activeTab === "hospitals" ? "Hospitais Privados" : "Leitos Privados"} (2024)
        </h3>

        {/* Indicador de dados filtrados */}
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg text-center border">
          <div className="text-sm text-gray-700 mb-1">
            <strong>Dados Filtrados:</strong> {filteredStats.regionsCount} de 5 regiões
          </div>
          <div className="flex justify-center gap-4 text-xs">
            <span className={activeTab === "hospitals" ? "font-bold text-blue-600" : ""}>
              🏥 {filteredStats.totalHospitals.toLocaleString()} hospitais
            </span>
            <span className={activeTab === "beds" ? "font-bold text-green-600" : ""}>
              🛏️ {filteredStats.totalBeds.toLocaleString()} leitos
            </span>
          </div>
        </div>

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
                    const shouldShow = shouldShowRegion(regionId)

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
                            cursor: shouldShow ? "pointer" : "not-allowed",
                            opacity: shouldShow ? 1 : 0.3,
                          },
                          hover: {
                            outline: "none",
                            fill: shouldShow ? getStateColor(geo) : "#f0f0f0",
                            opacity: shouldShow ? 0.8 : 0.3,
                            stroke: shouldShow ? "#333" : "#ccc",
                            strokeWidth: shouldShow ? 1.2 : 0.8,
                          },
                          pressed: {
                            outline: "none",
                            fill: getStateColor(geo),
                            opacity: shouldShow ? 0.9 : 0.3,
                          },
                        }}
                        data-tooltip-id="brazil-map-tooltip"
                        data-tooltip-html={generateTooltipContent(geo)}
                        onClick={() => {
                          if (regionId && shouldShow) {
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
              const regionNames = {
                north: "Norte",
                northeast: "Nordeste",
                "central-west": "Centro-Oeste",
                southeast: "Sudeste",
                south: "Sul",
              }
              const regionName = regionNames[regionId] || regionId
              const shouldShow = shouldShowRegion(regionId)
              const regionData = data.find((region) => region.id === regionId)

              return (
                <div
                  key={regionId}
                  className={`flex items-center gap-2 cursor-pointer hover:bg-white px-2 py-1 rounded ${
                    !shouldShow ? "opacity-50" : ""
                  }`}
                  onClick={() => onRegionSelect(regionId)}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{
                      backgroundColor: shouldShow ? color : "#f0f0f0",
                      opacity: selectedRegion === regionId || selectedRegion === "all" ? 1 : 0.4,
                    }}
                  />
                  <div className="flex flex-col">
                    <span
                      className={`text-sm ${selectedRegion === regionId ? "font-bold" : ""} ${!shouldShow ? "line-through" : ""}`}
                    >
                      {regionName}
                    </span>
                    {shouldShow && regionData && (
                      <span className="text-xs text-gray-500">
                        {activeTab === "hospitals"
                          ? `${regionData.hospitals.toLocaleString()} hospitais`
                          : `${regionData.beds.toLocaleString()} leitos`}
                      </span>
                    )}
                  </div>
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
