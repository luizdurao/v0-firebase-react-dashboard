"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db, isFirebaseInitialized } from "@/lib/firebase"
import { Loader2, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { regionalMapData } from "@/lib/regional-map-data"

// Importar o componente BrazilMap diretamente
import BrazilMap from "@/components/brazil-map"

export default function RegionalMap() {
  const [loading, setLoading] = useState(true)
  const [regionData, setRegionData] = useState([])
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [selectedTab, setSelectedTab] = useState("hospitals")
  const [mapData, setMapData] = useState(regionalMapData)
  const [usingMockData, setUsingMockData] = useState(!isFirebaseInitialized())

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Verificar se o Firebase está inicializado
        if (!isFirebaseInitialized()) {
          console.log("Firebase não inicializado, usando dados de exemplo")
          // Garantir que os dados tenham a estrutura correta para o mapa
          const regionsWithData = regionalMapData.regions.map((region) => {
            return {
              ...region,
              hospitals: regionalMapData.healthMetrics[region.id]?.hospitals?.total || 0,
              doctors: regionalMapData.healthMetrics[region.id]?.doctors?.total || 0,
              beds: regionalMapData.healthMetrics[region.id]?.beds?.total || 0,
              urbanAccessIndex: regionalMapData.healthMetrics[region.id]?.access?.urban || 0,
              ruralAccessIndex: regionalMapData.healthMetrics[region.id]?.access?.rural || 0,
              healthMetrics: regionalMapData.healthMetrics[region.id] || {},
              medicalEquipment: regionalMapData.medicalEquipment[region.id] || {},
            }
          })
          setRegionData(regionsWithData)
          setUsingMockData(true)
          setLoading(false)
          return
        }

        // Tentar buscar dados do mapa regional do Firebase
        try {
          const regionalMapSnapshot = await getDocs(collection(db, "regionalMap"))

          if (!regionalMapSnapshot.empty) {
            const regions = regionalMapSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            setRegionData(regions)
            setUsingMockData(false)
          } else {
            // Se não houver dados no Firebase, usar dados de exemplo
            const regionsWithData = regionalMapData.regions.map((region) => {
              return {
                ...region,
                hospitals: regionalMapData.healthMetrics[region.id]?.hospitals?.total || 0,
                doctors: regionalMapData.healthMetrics[region.id]?.doctors?.total || 0,
                beds: regionalMapData.healthMetrics[region.id]?.beds?.total || 0,
                urbanAccessIndex: regionalMapData.healthMetrics[region.id]?.access?.urban || 0,
                ruralAccessIndex: regionalMapData.healthMetrics[region.id]?.access?.rural || 0,
                healthMetrics: regionalMapData.healthMetrics[region.id] || {},
                medicalEquipment: regionalMapData.medicalEquipment[region.id] || {},
              }
            })
            setRegionData(regionsWithData)
            setUsingMockData(true)
          }
        } catch (error) {
          console.error("Erro ao buscar dados do mapa regional:", error)
          const regionsWithData = regionalMapData.regions.map((region) => {
            return {
              ...region,
              hospitals: regionalMapData.healthMetrics[region.id]?.hospitals?.total || 0,
              doctors: regionalMapData.healthMetrics[region.id]?.doctors?.total || 0,
              beds: regionalMapData.healthMetrics[region.id]?.beds?.total || 0,
              urbanAccessIndex: regionalMapData.healthMetrics[region.id]?.access?.urban || 0,
              ruralAccessIndex: regionalMapData.healthMetrics[region.id]?.access?.rural || 0,
              healthMetrics: regionalMapData.healthMetrics[region.id] || {},
              medicalEquipment: regionalMapData.medicalEquipment[region.id] || {},
            }
          })
          setRegionData(regionsWithData)
          setUsingMockData(true)
        }

        // Buscar dados de regiões como fallback
        if (regionData.length === 0) {
          const regionSnapshot = await getDocs(collection(db, "regions"))
          if (!regionSnapshot.empty) {
            const regions = regionSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              healthMetrics: {
                hospitals: { total: doc.data().hospitals || 0 },
                doctors: { total: doc.data().doctors || 0 },
                beds: { total: doc.data().beds || 0 },
                access: {
                  urban: doc.data().urbanAccessIndex || 0,
                  rural: doc.data().ruralAccessIndex || 0,
                },
              },
            }))
            setRegionData(regions)
            setUsingMockData(false)
          } else {
            const regionsWithData = regionalMapData.regions.map((region) => {
              return {
                ...region,
                hospitals: regionalMapData.healthMetrics[region.id]?.hospitals?.total || 0,
                doctors: regionalMapData.healthMetrics[region.id]?.doctors?.total || 0,
                beds: regionalMapData.healthMetrics[region.id]?.beds?.total || 0,
                urbanAccessIndex: regionalMapData.healthMetrics[region.id]?.access?.urban || 0,
                ruralAccessIndex: regionalMapData.healthMetrics[region.id]?.access?.rural || 0,
                healthMetrics: regionalMapData.healthMetrics[region.id] || {},
                medicalEquipment: regionalMapData.medicalEquipment[region.id] || {},
              }
            })
            setRegionData(regionsWithData)
            setUsingMockData(true)
          }
        }

        setLoading(false)
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
        const regionsWithData = regionalMapData.regions.map((region) => {
          return {
            ...region,
            hospitals: regionalMapData.healthMetrics[region.id]?.hospitals?.total || 0,
            doctors: regionalMapData.healthMetrics[region.id]?.doctors?.total || 0,
            beds: regionalMapData.healthMetrics[region.id]?.beds?.total || 0,
            urbanAccessIndex: regionalMapData.healthMetrics[region.id]?.access?.urban || 0,
            ruralAccessIndex: regionalMapData.healthMetrics[region.id]?.access?.rural || 0,
            healthMetrics: regionalMapData.healthMetrics[region.id] || {},
            medicalEquipment: regionalMapData.medicalEquipment[region.id] || {},
          }
        })
        setRegionData(regionsWithData)
        setUsingMockData(true)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filtrar dados com base na região selecionada
  const filteredRegions =
    selectedRegion === "all" ? regionData : regionData.filter((region) => region.id === selectedRegion)

  // Obter métricas de saúde para a região selecionada
  const getHealthMetrics = (regionId) => {
    if (usingMockData) {
      return mapData.healthMetrics[regionId] || {}
    }

    const region = regionData.find((r) => r.id === regionId)
    return region?.healthMetrics || {}
  }

  // Obter equipamentos médicos para a região selecionada
  const getMedicalEquipment = (regionId) => {
    if (usingMockData) {
      return mapData.medicalEquipment[regionId] || {}
    }

    const region = regionData.find((r) => r.id === regionId)
    return region?.medicalEquipment || {}
  }

  // Obter profissionais de saúde para a região selecionada
  const getHealthcareProfessionals = (regionId) => {
    if (usingMockData) {
      return mapData.healthcareProfessionals[regionId] || {}
    }

    const region = regionData.find((r) => r.id === regionId)
    return region?.healthcareProfessionals || {}
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando dados do mapa...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mapa Regional de Saúde</h1>
        <p className="text-muted-foreground">Distribuição geográfica dos recursos de saúde no Brasil</p>
      </div>

      {usingMockData && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Dados de Exemplo</AlertTitle>
          <AlertDescription>
            Exibindo dados de exemplo para o mapa regional. Inicialize o banco de dados para ver dados reais.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="w-full md:w-64">
          <Label htmlFor="region-select" className="mb-2 block">
            Filtrar por Região
          </Label>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger id="region-select" className="w-full">
              <SelectValue placeholder="Selecione uma região" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Regiões</SelectItem>
              {regionData.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="hospitals">Hospitais</TabsTrigger>
          <TabsTrigger value="doctors">Médicos</TabsTrigger>
          <TabsTrigger value="beds">Leitos</TabsTrigger>
          <TabsTrigger value="equipment">Equipamentos</TabsTrigger>
          <TabsTrigger value="access">Acesso</TabsTrigger>
        </TabsList>

        <TabsContent value="hospitals" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Hospitais</CardTitle>
              <CardDescription>
                {selectedRegion === "all"
                  ? "Número e tipos de hospitais por região"
                  : `Hospitais na região ${filteredRegions[0]?.name || ""}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <BrazilMap
                  selectedRegion={selectedRegion}
                  onRegionSelect={setSelectedRegion}
                  data={regionData}
                  activeTab="hospitals"
                />
                <div className="grid gap-2 md:grid-cols-5 mt-4">
                  {filteredRegions.map((region) => {
                    const metrics = getHealthMetrics(region.id)
                    const hospitals = metrics.hospitals || {}

                    return (
                      <Card key={region.id} className="bg-white">
                        <CardContent className="p-3">
                          <div className="text-sm font-medium">{region.name}</div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                              <div className="text-lg font-bold">{hospitals.total || region.hospitals || "N/A"}</div>
                              <div className="text-xs text-muted-foreground">Total</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold">{hospitals.public || "N/A"}</div>
                              <div className="text-xs text-muted-foreground">Públicos</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold">{hospitals.private || "N/A"}</div>
                              <div className="text-xs text-muted-foreground">Privados</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold">{hospitals.universitarios || "N/A"}</div>
                              <div className="text-xs text-muted-foreground">Universitários</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="doctors" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Médicos</CardTitle>
              <CardDescription>
                {selectedRegion === "all"
                  ? "Número de profissionais médicos por região"
                  : `Médicos na região ${filteredRegions[0]?.name || ""}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <BrazilMap
                  selectedRegion={selectedRegion}
                  onRegionSelect={setSelectedRegion}
                  data={regionData}
                  activeTab="doctors"
                />
                <div className="grid gap-2 md:grid-cols-5 mt-4">
                  {filteredRegions.map((region) => {
                    const metrics = getHealthMetrics(region.id)
                    const doctors = metrics.doctors || {}

                    return (
                      <Card key={region.id} className="bg-white">
                        <CardContent className="p-3">
                          <div className="text-sm font-medium">{region.name}</div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                              <div className="text-lg font-bold">
                                {doctors.total?.toLocaleString() || region.doctors?.toLocaleString() || "N/A"}
                              </div>
                              <div className="text-xs text-muted-foreground">Total</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold">{doctors.per100k || "N/A"}</div>
                              <div className="text-xs text-muted-foreground">Por 100 mil</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold">{doctors.specialists?.toLocaleString() || "N/A"}</div>
                              <div className="text-xs text-muted-foreground">Especialistas</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold">
                                {doctors.generalPractitioners?.toLocaleString() || "N/A"}
                              </div>
                              <div className="text-xs text-muted-foreground">Clínicos</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="beds" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Leitos</CardTitle>
              <CardDescription>
                {selectedRegion === "all"
                  ? "Número de leitos hospitalares por região"
                  : `Leitos na região ${filteredRegions[0]?.name || ""}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <BrazilMap
                  selectedRegion={selectedRegion}
                  onRegionSelect={setSelectedRegion}
                  data={regionData}
                  activeTab="beds"
                />
                <div className="grid gap-2 md:grid-cols-5 mt-4">
                  {filteredRegions.map((region) => {
                    const metrics = getHealthMetrics(region.id)
                    const beds = metrics.beds || {}

                    return (
                      <Card key={region.id} className="bg-white">
                        <CardContent className="p-3">
                          <div className="text-sm font-medium">{region.name}</div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                              <div className="text-lg font-bold">
                                {beds.total?.toLocaleString() || region.beds?.toLocaleString() || "N/A"}
                              </div>
                              <div className="text-xs text-muted-foreground">Total</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold">{beds.per1000 || "N/A"}</div>
                              <div className="text-xs text-muted-foreground">Por 1.000 hab.</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold">{beds.icu?.toLocaleString() || "N/A"}</div>
                              <div className="text-xs text-muted-foreground">UTI</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold">{beds.occupancyRate || "N/A"}%</div>
                              <div className="text-xs text-muted-foreground">Ocupação</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Equipamentos Médicos</CardTitle>
              <CardDescription>
                {selectedRegion === "all"
                  ? "Distribuição de equipamentos médicos por região"
                  : `Equipamentos na região ${filteredRegions[0]?.name || ""}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <BrazilMap
                  selectedRegion={selectedRegion}
                  onRegionSelect={setSelectedRegion}
                  data={regionData}
                  activeTab="equipment"
                />
                <div className="grid gap-2 md:grid-cols-5 mt-4">
                  {filteredRegions.map((region) => {
                    const equipment = getMedicalEquipment(region.id) || {}

                    return (
                      <Card key={region.id} className="bg-white">
                        <CardContent className="p-3">
                          <div className="text-sm font-medium">{region.name}</div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                              <div className="text-lg font-bold">{equipment.mri || "N/A"}</div>
                              <div className="text-xs text-muted-foreground">Ressonância</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold">{equipment.ct || "N/A"}</div>
                              <div className="text-xs text-muted-foreground">Tomografia</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold">{equipment.ultrasound || "N/A"}</div>
                              <div className="text-xs text-muted-foreground">Ultrassom</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold">{equipment.ventilators || "N/A"}</div>
                              <div className="text-xs text-muted-foreground">Ventiladores</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Acesso à Saúde</CardTitle>
              <CardDescription>
                {selectedRegion === "all"
                  ? "Índices de acesso aos serviços de saúde por região"
                  : `Acesso na região ${filteredRegions[0]?.name || ""}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <BrazilMap
                  selectedRegion={selectedRegion}
                  onRegionSelect={setSelectedRegion}
                  data={regionData}
                  activeTab="access"
                />
                <div className="grid gap-2 md:grid-cols-5 mt-4">
                  {filteredRegions.map((region) => {
                    const metrics = getHealthMetrics(region.id)
                    const access = metrics.access || {}

                    return (
                      <Card key={region.id} className="bg-white">
                        <CardContent className="p-3">
                          <div className="text-sm font-medium">{region.name}</div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                              <div className="text-lg font-bold">
                                {access.urban || region.urbanAccessIndex || "N/A"}%
                              </div>
                              <div className="text-xs text-muted-foreground">Urbano</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold">
                                {access.rural || region.ruralAccessIndex || "N/A"}%
                              </div>
                              <div className="text-xs text-muted-foreground">Rural</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold">{access.travelTimeMinutes?.urban || "N/A"}</div>
                              <div className="text-xs text-muted-foreground">Min. (urbano)</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold">{access.travelTimeMinutes?.rural || "N/A"}</div>
                              <div className="text-xs text-muted-foreground">Min. (rural)</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
