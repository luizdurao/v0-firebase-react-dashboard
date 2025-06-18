"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Download, Filter, Map } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import BrazilBubbleChart from "./brazil-bubble-chart"
import BrazilMapGeolocation from "./brazil-map-geolocation"
import { loadRealHospitalData, calculateRegionalStats } from "@/lib/real-data-processor"

export default function RegionalMap() {
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [activeTab, setActiveTab] = useState("hospitals")
  const [viewMode, setViewMode] = useState<"bubble" | "map">("map")
  const [regionData, setRegionData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const hospitalData = await loadRealHospitalData()
        const regionalStats = calculateRegionalStats(hospitalData)

        // Converter dados regionais para o formato esperado
        const formattedData = Object.values(regionalStats).map((region: any) => ({
          id: region.id,
          name: region.name,
          hospitals: region.hospitals,
          beds: region.totalBeds,
          states: region.states,
          // Calcular médias baseadas nos dados reais
          averageBedsPerHospital: Math.round(region.totalBeds / region.hospitals),
          stateCount: region.states.length,
        }))

        setRegionData(formattedData)
        setLoading(false)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleRegionSelect = (regionId: string) => {
    setSelectedRegion(regionId === selectedRegion ? "all" : regionId)
  }

  const filteredData = selectedRegion === "all" ? regionData : regionData.filter((r) => r.id === selectedRegion)

  if (loading) {
    return (
      <Card className="col-span-3">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Carregando dados regionais...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Mapa Regional de Saúde</CardTitle>
          <CardDescription>Distribuição de recursos de saúde por região do Brasil</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "bubble" ? "map" : "bubble")}>
            <Map className="mr-2 h-4 w-4" />
            {viewMode === "bubble" ? "Mapa" : "Bolhas"}
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="hospitals" className="mb-4" onValueChange={(value) => setActiveTab(value)}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="hospitals">Hospitais Privados</TabsTrigger>
            <TabsTrigger value="beds">Leitos Privados</TabsTrigger>
          </TabsList>

          <TabsContent value="hospitals" className="mt-0">
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Hospitais Privados</AlertTitle>
              <AlertDescription>
                Visualize a distribuição de hospitais privados por região do Brasil (dados de 2024).
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="beds" className="mt-0">
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Leitos Privados</AlertTitle>
              <AlertDescription>
                Visualize a distribuição de leitos em hospitais privados por região do Brasil (dados de 2024).
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>

        {/* Estatísticas Resumo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {regionData.reduce((sum, region) => sum + region.hospitals, 0).toLocaleString()}
            </div>
            <div className="text-sm text-blue-600">Total de Hospitais</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {regionData.reduce((sum, region) => sum + region.beds, 0).toLocaleString()}
            </div>
            <div className="text-sm text-green-600">Total de Leitos</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">5</div>
            <div className="text-sm text-purple-600">Regiões</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">27</div>
            <div className="text-sm text-orange-600">Estados + DF</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {viewMode === "bubble" ? (
            <BrazilBubbleChart
              selectedRegion={selectedRegion}
              onRegionSelect={handleRegionSelect}
              data={regionData}
              activeTab={activeTab}
            />
          ) : (
            <BrazilMapGeolocation
              selectedRegion={selectedRegion}
              onRegionSelect={handleRegionSelect}
              data={regionData}
              activeTab={activeTab}
            />
          )}
        </div>

        {/* Tabela de Dados Regionais */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-4">Dados por Região</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Região</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Estados</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Hospitais</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Leitos</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Leitos/Hospital</th>
                </tr>
              </thead>
              <tbody>
                {regionData.map((region) => (
                  <tr key={region.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-medium">{region.name}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{region.stateCount}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{region.hospitals.toLocaleString()}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{region.beds.toLocaleString()}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{region.averageBedsPerHospital}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
