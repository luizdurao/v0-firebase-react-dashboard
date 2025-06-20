"use client"

import { useEffect, useState, useRef } from "react"
import { Loader2 } from "lucide-react"
import BrazilMapGeolocation from "@/components/brazil-map-geolocation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { regionalData } from "@/lib/regional-map-data"
import { calculateFilteredHospitalStats } from "@/lib/hospital-regional-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Define regions for filtering
const regions = [
  { id: "north", name: "Norte" },
  { id: "northeast", name: "Nordeste" },
  { id: "central-west", name: "Centro-Oeste" },
  { id: "southeast", name: "Sudeste" },
  { id: "south", name: "Sul" },
]

interface HospitalMapData {
  id: string
  nome: string
  latitude: number
  longitude: number
  leitos: number
}

const mockHospitalData: HospitalMapData[] = [
  { id: "1", nome: "Hospital Central de SP", latitude: -23.5505, longitude: -46.6333, leitos: 500 },
  { id: "2", nome: "Hospital da Criança RJ", latitude: -22.9068, longitude: -43.1729, leitos: 300 },
  { id: "3", nome: "Hospital Regional de BH", latitude: -19.9167, longitude: -43.9345, leitos: 400 },
]

export default function MapPageClient() {
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [activeTab, setActiveTab] = useState("beds")
  const [filterType, setFilterType] = useState("none")
  const [filterValue, setFilterValue] = useState(0)
  const [selectedRegions, setSelectedRegions] = useState<string[]>(regions.map((r) => r.id))
  const [viewMode, setViewMode] = useState<"region" | "state">("region")
  const [loading, setLoading] = useState(true)
  const [mapData, setMapData] = useState<HospitalMapData[]>([])
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMapData(mockHospitalData)
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!loading && mapData.length > 0 && mapContainerRef.current && !mapInstanceRef.current) {
      // Evitar reinicialização
      mapInstanceRef.current = L.map(mapContainerRef.current).setView([-14.235, -51.9253], 4)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current)

      mapData.forEach((hospital) => {
        L.marker([hospital.latitude, hospital.longitude])
          .addTo(mapInstanceRef.current!)
          .bindPopup(`<b>${hospital.nome}</b><br>Leitos: ${hospital.leitos}`)
      })
    }
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [loading, mapData])

  // Filter thresholds based on the active tab
  const getMaxFilterValue = () => {
    switch (activeTab) {
      case "beds":
        return 160000
      case "hospitais-privados":
        return 4000
      default:
        return 100
    }
  }

  // Toggle region selection
  const toggleRegion = (regionId: string) => {
    setSelectedRegions((prev) => {
      if (prev.includes(regionId)) {
        return prev.filter((id) => id !== regionId)
      } else {
        return [...prev, regionId]
      }
    })
  }

  // Toggle all regions
  const toggleAllRegions = () => {
    if (selectedRegions.length === regions.length) {
      setSelectedRegions([])
    } else {
      setSelectedRegions(regions.map((r) => r.id))
    }
  }

  // Reset filters
  const resetFilters = () => {
    setSelectedRegions(regions.map((r) => r.id))
    setFilterType("none")
    setFilterValue(0)
    setSelectedRegion("all")
  }

  // Apply filters to the data
  const getFilteredData = () => {
    // First filter by selected regions
    const filtered = regionalData.filter((region) => selectedRegions.includes(region.id))

    // Then apply value filters if needed
    if (filterType === "none") return filtered

    return filtered.filter((region) => {
      let valueToCompare = 0

      switch (activeTab) {
        case "beds":
          valueToCompare = region.beds
          break
        default:
          valueToCompare = 0
      }

      switch (filterType) {
        case "above":
          return valueToCompare >= filterValue
        case "below":
          return valueToCompare <= filterValue
        default:
          return true
      }
    })
  }

  const filteredData = getFilteredData()
  const maxFilterValue = getMaxFilterValue()

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Reset filter value when changing tabs to avoid confusion
    setFilterValue(0)
  }

  // Get hospital stats for the new tab
  const hospitalStats = calculateFilteredHospitalStats(selectedRegions)

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Mapa de Saúde do Brasil</h1>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] text-slate-700 dark:text-slate-300">
          {" "}
          {/* Ajustado min-height */}
          <Loader2 className="h-12 w-12 animate-spin text-sky-600 mb-4" />
          <p className="text-lg font-semibold">Carregando dados do mapa...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Mapa de Saúde do Brasil</h1>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 border rounded-md p-1">
            <Button
              variant={viewMode === "region" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("region")}
              className="text-xs"
            >
              Por Região
            </Button>
            <Button
              variant={viewMode === "state" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("state")}
              className="text-xs"
            >
              Por Estado
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="beds" value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="beds">Leitos</TabsTrigger>
          <TabsTrigger value="hospitais-privados">Hospitais Privados</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            {/* Filter Controls - Only show for beds tab */}
            {activeTab === "beds" && (
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-medium">Filtrar Regiões</h2>
                  <Button variant="outline" size="sm" onClick={resetFilters} className="hover:bg-gray-100">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Resetar Filtros
                  </Button>
                </div>

                {/* Region Filter */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Filtrar por Região</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="all-regions"
                        checked={selectedRegions.length === regions.length}
                        onCheckedChange={toggleAllRegions}
                      />
                      <Label htmlFor="all-regions" className="text-sm">
                        Todas as Regiões
                      </Label>
                    </div>

                    {regions.map((region) => (
                      <div key={region.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`region-${region.id}`}
                          checked={selectedRegions.includes(region.id)}
                          onCheckedChange={() => toggleRegion(region.id)}
                        />
                        <Label htmlFor={`region-${region.id}`} className="text-sm">
                          {region.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Value Filter */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Filtro por Valor</label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um filtro" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sem Filtro</SelectItem>
                        <SelectItem value="above">Acima do Valor</SelectItem>
                        <SelectItem value="below">Abaixo do Valor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {filterType !== "none" && (
                    <div>
                      <label className="text-sm font-medium mb-1 block">Valor: {filterValue.toLocaleString()}</label>
                      <Slider
                        value={[filterValue]}
                        min={0}
                        max={maxFilterValue}
                        step={10}
                        onValueChange={(value) => setFilterValue(value[0])}
                      />
                    </div>
                  )}
                </div>

                <div className="mt-3 text-sm">
                  <span className="font-medium">Regiões exibidas:</span>{" "}
                  {filteredData.length === 0
                    ? "Nenhuma região corresponde aos filtros"
                    : filteredData.length === regionalData.length
                      ? "Todas as regiões"
                      : `${filteredData.length} de ${regionalData.length} regiões`}
                </div>
              </div>
            )}

            {/* Map Component */}
            <TabsContent value="beds" className="mt-0">
              <BrazilMapGeolocation
                selectedRegion={selectedRegion}
                onRegionSelect={setSelectedRegion}
                data={filteredData}
                activeTab="beds"
                viewMode={viewMode}
                filteredRegions={selectedRegions}
              />
            </TabsContent>

            <TabsContent value="hospitais-privados" className="mt-0">
              <div
                ref={mapContainerRef}
                className="w-full flex-grow min-h-[calc(100vh-160px)] bg-slate-100 dark:bg-slate-800/50 rounded-lg shadow-inner"
              >
                {!loading && mapData.length === 0 && (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-slate-500 dark:text-slate-400">Nenhum dado de hospital para exibir no mapa.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>

          <div>
            {/* Statistics Card */}
            {activeTab === "hospitais-privados" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas {selectedRegions.length < 5 ? "Filtradas" : "Nacionais"}</CardTitle>
                  <CardDescription>Hospitais privados - 2024</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Total de Hospitais Privados</h3>
                      <p className="text-2xl font-bold">{hospitalStats.hospitais.toLocaleString()}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Total de Leitos Privados</h3>
                      <p className="text-2xl font-bold">{hospitalStats.leitos.toLocaleString()}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Leitos por Hospital</h3>
                      <p className="text-2xl font-bold">{hospitalStats.leitosPorHospital}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Regiões Selecionadas</h3>
                      <p className="text-2xl font-bold">{hospitalStats.regioes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas {selectedRegions.length < 5 ? "Filtradas" : "Nacionais"}</CardTitle>
                  <CardDescription>
                    {selectedRegions.length < 5
                      ? `Dados das ${selectedRegions.length} regiões selecionadas`
                      : "Visão geral dos recursos de saúde"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Total de Hospitais Privados</h3>
                      <p className="text-2xl font-bold">
                        {filteredData.reduce((sum, region) => sum + (region.hospitals || 0), 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Total de Leitos Privados</h3>
                      <p className="text-2xl font-bold">
                        {filteredData.reduce((sum, region) => sum + (region.beds || 0), 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Leitos por Hospital</h3>
                      <p className="text-2xl font-bold">
                        {filteredData.length > 0
                          ? Math.round(
                              filteredData.reduce((sum, region) => sum + (region.beds || 0), 0) /
                                filteredData.reduce((sum, region) => sum + (region.hospitals || 0), 0),
                            )
                          : 0}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Regiões Selecionadas</h3>
                      <p className="text-2xl font-bold">{selectedRegions.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedRegion !== "all" && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>
                    {regionalData.find((r) => r.id === selectedRegion)?.name || "Região Selecionada"}
                  </CardTitle>
                  <CardDescription>Detalhes da região selecionada</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedRegion && (
                      <>
                        <div>
                          <h3 className="font-medium">Hospitais Privados</h3>
                          <p className="text-2xl font-bold">
                            {regionalData.find((r) => r.id === selectedRegion)?.hospitals.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-medium">Leitos Privados</h3>
                          <p className="text-2xl font-bold">
                            {regionalData.find((r) => r.id === selectedRegion)?.beds.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-medium">População</h3>
                          <p className="text-2xl font-bold">
                            {regionalData.find((r) => r.id === selectedRegion)?.population.toLocaleString()}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  )
}
