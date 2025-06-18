"use client"

import { useState } from "react"
import Layout from "@/components/layout"
import RegionalMap from "@/components/regional-map"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { regionalData } from "@/lib/regional-map-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

// Define regions for filtering
const regions = [
  { id: "north", name: "Norte" },
  { id: "northeast", name: "Nordeste" },
  { id: "central-west", name: "Centro-Oeste" },
  { id: "southeast", name: "Sudeste" },
  { id: "south", name: "Sul" },
]

export default function MapPageClient() {
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [activeTab, setActiveTab] = useState("hospitals")
  const [filterType, setFilterType] = useState("none")
  const [filterValue, setFilterValue] = useState(0)
  const [selectedRegions, setSelectedRegions] = useState<string[]>(regions.map((r) => r.id))
  const [viewMode, setViewMode] = useState<"region" | "state">("region")

  // Filter thresholds based on the active tab
  const getMaxFilterValue = () => {
    switch (activeTab) {
      case "hospitals":
        return 3500
      case "doctors":
        return 200000
      case "beds":
        return 350000
      case "equipment":
        return 500
      case "access":
        return 100
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
        case "hospitals":
          valueToCompare = region.hospitals
          break
        case "doctors":
          valueToCompare = region.doctors
          break
        case "beds":
          valueToCompare = region.beds
          break
        case "equipment":
          valueToCompare = region.medicalEquipment?.mri || 0
          break
        case "access":
          valueToCompare = region.urbanAccessIndex
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
  const handleTabChange = (value) => {
    setActiveTab(value)
    // Reset filter value when changing tabs to avoid confusion
    setFilterValue(0)
  }

  return (
    <Layout>
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

        <Tabs defaultValue="hospitals" value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="hospitals">Hospitais</TabsTrigger>
            <TabsTrigger value="doctors">Médicos</TabsTrigger>
            <TabsTrigger value="beds">Leitos</TabsTrigger>
            <TabsTrigger value="equipment">Equipamentos</TabsTrigger>
            <TabsTrigger value="access">Acesso</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              {/* Filter Controls */}
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
                      <label className="text-sm font-medium mb-1 block">
                        Valor: {filterValue.toLocaleString()}
                        {activeTab === "access" ? "%" : ""}
                      </label>
                      <Slider
                        value={[filterValue]}
                        min={0}
                        max={maxFilterValue}
                        step={activeTab === "access" ? 1 : 10}
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

              {/* Map Component */}
              <RegionalMap
                selectedRegion={selectedRegion}
                onRegionSelect={setSelectedRegion}
                data={filteredData}
                activeTab={activeTab}
                viewMode={viewMode}
              />
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas Nacionais</CardTitle>
                  <CardDescription>Visão geral dos recursos de saúde</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Total de Hospitais</h3>
                      <p className="text-2xl font-bold">8,457</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Médicos por 1.000 habitantes</h3>
                      <p className="text-2xl font-bold">2.3</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Leitos por 1.000 habitantes</h3>
                      <p className="text-2xl font-bold">2.1</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Acesso a Saúde (Urbano)</h3>
                      <p className="text-2xl font-bold">87.5%</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Acesso a Saúde (Rural)</h3>
                      <p className="text-2xl font-bold">62.3%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                            <h3 className="font-medium">Hospitais</h3>
                            <p className="text-2xl font-bold">
                              {regionalData.find((r) => r.id === selectedRegion)?.hospitals.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <h3 className="font-medium">Médicos</h3>
                            <p className="text-2xl font-bold">
                              {regionalData.find((r) => r.id === selectedRegion)?.doctors.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <h3 className="font-medium">Leitos</h3>
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
    </Layout>
  )
}
