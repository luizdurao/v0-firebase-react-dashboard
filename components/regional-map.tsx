"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Download, Filter, Map } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import BrazilBubbleChart from "./brazil-bubble-chart"
import BrazilRealMap from "./brazil-real-map"

// Dados de exemplo para o mapa
const regionData = [
  {
    id: "north",
    name: "Norte",
    population: 18.9,
    area: 3853676.9,
    hospitals: 447,
    doctors: 42000,
    beds: 52000,
    urbanAccessIndex: 72.5,
    ruralAccessIndex: 38.2,
    healthMetrics: {
      hospitals: { total: 447, public: 310, private: 137 },
      doctors: { total: 42000, perThousand: 2.1 },
      beds: { total: 52000, perThousand: 2.6 },
      access: { urban: 72.5, rural: 38.2 },
    },
    medicalEquipment: {
      mri: 89,
      ct: 124,
      xray: 1240,
      ultrasound: 980,
    },
  },
  {
    id: "northeast",
    name: "Nordeste",
    population: 57.4,
    area: 1554291.6,
    hospitals: 1083,
    doctors: 134000,
    beds: 156000,
    urbanAccessIndex: 78.3,
    ruralAccessIndex: 42.7,
    healthMetrics: {
      hospitals: { total: 1083, public: 720, private: 363 },
      doctors: { total: 134000, perThousand: 2.3 },
      beds: { total: 156000, perThousand: 2.7 },
      access: { urban: 78.3, rural: 42.7 },
    },
    medicalEquipment: {
      mri: 210,
      ct: 315,
      xray: 3200,
      ultrasound: 2800,
    },
  },
  {
    id: "central-west",
    name: "Centro-Oeste",
    population: 16.7,
    area: 1606403.5,
    hospitals: 548,
    doctors: 58000,
    beds: 62000,
    urbanAccessIndex: 85.2,
    ruralAccessIndex: 51.8,
    healthMetrics: {
      hospitals: { total: 548, public: 320, private: 228 },
      doctors: { total: 58000, perThousand: 3.5 },
      beds: { total: 62000, perThousand: 3.7 },
      access: { urban: 85.2, rural: 51.8 },
    },
    medicalEquipment: {
      mri: 145,
      ct: 198,
      xray: 1580,
      ultrasound: 1320,
    },
  },
  {
    id: "southeast",
    name: "Sudeste",
    population: 89.6,
    area: 924608.9,
    hospitals: 2184,
    doctors: 312000,
    beds: 340000,
    urbanAccessIndex: 92.1,
    ruralAccessIndex: 68.4,
    healthMetrics: {
      hospitals: { total: 2184, public: 1250, private: 934 },
      doctors: { total: 312000, perThousand: 3.5 },
      beds: { total: 340000, perThousand: 3.8 },
      access: { urban: 92.1, rural: 68.4 },
    },
    medicalEquipment: {
      mri: 580,
      ct: 720,
      xray: 6800,
      ultrasound: 5900,
    },
  },
  {
    id: "south",
    name: "Sul",
    population: 30.4,
    area: 576783.8,
    hospitals: 1042,
    doctors: 124000,
    beds: 136000,
    urbanAccessIndex: 89.7,
    ruralAccessIndex: 64.3,
    healthMetrics: {
      hospitals: { total: 1042, public: 580, private: 462 },
      doctors: { total: 124000, perThousand: 4.1 },
      beds: { total: 136000, perThousand: 4.5 },
      access: { urban: 89.7, rural: 64.3 },
    },
    medicalEquipment: {
      mri: 320,
      ct: 410,
      xray: 3600,
      ultrasound: 3100,
    },
  },
]

export default function RegionalMap() {
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [activeTab, setActiveTab] = useState("hospitals")
  const [viewMode, setViewMode] = useState<"bubble" | "map">("map")

  const handleRegionSelect = (regionId: string) => {
    setSelectedRegion(regionId === selectedRegion ? "all" : regionId)
  }

  const filteredData = selectedRegion === "all" ? regionData : regionData.filter((r) => r.id === selectedRegion)

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Mapa Regional de Saúde</CardTitle>
          <CardDescription>Distribuição de recursos de saúde por região</CardDescription>
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
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="hospitals">Hospitais</TabsTrigger>
            <TabsTrigger value="doctors">Médicos</TabsTrigger>
            <TabsTrigger value="beds">Leitos</TabsTrigger>
            <TabsTrigger value="equipment">Equipamentos</TabsTrigger>
            <TabsTrigger value="access">Acesso</TabsTrigger>
          </TabsList>

          <TabsContent value="hospitals" className="mt-0">
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Hospitais</AlertTitle>
              <AlertDescription>Visualize a distribuição de hospitais públicos e privados por região.</AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="doctors" className="mt-0">
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Médicos</AlertTitle>
              <AlertDescription>Visualize a distribuição de médicos e a proporção por mil habitantes.</AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="beds" className="mt-0">
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Leitos</AlertTitle>
              <AlertDescription>
                Visualize a distribuição de leitos hospitalares e a proporção por mil habitantes.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="equipment" className="mt-0">
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Equipamentos</AlertTitle>
              <AlertDescription>
                Visualize a distribuição de equipamentos médicos como ressonância magnética e tomografia.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="access" className="mt-0">
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Acesso à Saúde</AlertTitle>
              <AlertDescription>Visualize o índice de acesso à saúde em áreas urbanas e rurais.</AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 gap-4">
          {viewMode === "bubble" ? (
            <BrazilBubbleChart
              selectedRegion={selectedRegion}
              onRegionSelect={handleRegionSelect}
              data={regionData}
              activeTab={activeTab}
            />
          ) : (
            <BrazilRealMap
              selectedRegion={selectedRegion}
              onRegionSelect={handleRegionSelect}
              data={regionData}
              activeTab={activeTab}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
