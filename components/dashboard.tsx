"use client"

import { useEffect, useState } from "react"
import { Loader2, RefreshCw, MapPin, BarChart3, TrendingUp, LucidePieChart } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import {
  loadRealHospitalData,
  getAllStates,
  getStateChartData,
  calculateRegionalStats,
} from "@/lib/real-data-processor"

// Componente de gráfico de pizza simples usando CSS
const SimplePieChart = ({ data, colors }: { data: Array<{ name: string; value: number }>; colors: string[] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let cumulativePercentage = 0

  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100
    const startAngle = (cumulativePercentage / 100) * 360
    const endAngle = ((cumulativePercentage + percentage) / 100) * 360
    cumulativePercentage += percentage

    const largeArcFlag = percentage > 50 ? 1 : 0
    const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180)
    const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180)
    const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180)
    const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180)

    const pathData = ["M", 50, 50, "L", x1, y1, "A", 40, 40, 0, largeArcFlag, 1, x2, y2, "Z"].join(" ")

    return {
      ...item,
      pathData,
      color: colors[index % colors.length],
      percentage: percentage.toFixed(1),
    }
  })

  return (
    <div className="w-full">
      <div className="relative w-full aspect-square max-w-[200px] mx-auto">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {segments.map((segment, index) => (
            <path key={index} d={segment.pathData} fill={segment.color} stroke="white" strokeWidth="0.5" />
          ))}
          <circle cx="50" cy="50" r="20" fill="white" />
        </svg>
      </div>
    </div>
  )
}

// Dados simulados para série temporal (2010-2024)
const generateTimeSeriesData = (currentValue: number) => {
  const years = []
  for (let year = 2010; year <= 2024; year++) {
    const variation = Math.random() * 0.3 - 0.15 // ±15% de variação
    const value = Math.round(currentValue * (1 + (variation * (2024 - year)) / 14))
    years.push({ year, value })
  }
  return years
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [selectedState, setSelectedState] = useState<string>("acre") // Começar com Acre como na imagem
  const [stateData, setStateData] = useState<any>(null)
  const [allStates, setAllStates] = useState<any[]>([])
  const [nationalData, setNationalData] = useState<any>(null)
  const [regionalData, setRegionalData] = useState<any[]>([])

  const fetchData = async () => {
    setLoading(true)

    try {
      // Carregar dados reais
      const realData = await loadRealHospitalData()
      const states = getAllStates()
      const regionalStats = calculateRegionalStats(realData)

      // Calcular estatísticas nacionais
      const nationalStats = {
        totalHospitals: Object.values(realData).reduce((sum, data) => sum + data.Hospitais_Privados_2024, 0),
        totalBeds: Object.values(realData).reduce((sum, data) => sum + data.Leitos_Privados_2024, 0),
        averageOccupancy: 75.2,
        totalStates: states.length,
      }

      setAllStates(states)
      setNationalData(nationalStats)
      setRegionalData(Object.values(regionalStats))

      // Carregar dados do estado selecionado
      if (selectedState) {
        const stateChartData = getStateChartData(selectedState)
        setStateData(stateChartData)
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  // Atualizar dados quando o estado selecionado mudar
  useEffect(() => {
    if (selectedState) {
      const stateChartData = getStateChartData(selectedState)
      setStateData(stateChartData)
    }
  }, [selectedState])

  useEffect(() => {
    fetchData()
  }, [])

  if (loading || !stateData) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Preparar dados para os gráficos
  const timeSeriesData = generateTimeSeriesData(stateData.hospitals)

  // Preparar dados para gráficos nacionais
  const nationalChartData = regionalData.map((region) => ({
    name: region.name,
    hospitals: region.hospitals,
    beds: region.totalBeds,
  }))

  const topStatesData = allStates
    .map((state) => {
      const data = getStateChartData(state.id)
      return data ? { name: data.name, hospitals: data.hospitals, beds: data.beds } : null
    })
    .filter(Boolean)
    .sort((a, b) => b.hospitals - a.hospitals)
    .slice(0, 10)

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Dashboard - {selectedState === "all" ? "Brasil" : stateData.name}
          </h1>
          <p className="text-muted-foreground">Análise da infraestrutura hospitalar brasileira - Dados de 2024</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecione um estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Visão Nacional</SelectItem>
              {allStates.map((state) => (
                <SelectItem key={state.id} value={state.id}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>
      </div>

      {selectedState === "all" ? (
        // Visão Nacional
        <div className="space-y-6">
          {/* Cards de Estatísticas Nacionais */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Hospitais</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {nationalData?.totalHospitals?.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Em todo o Brasil</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Leitos</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{nationalData?.totalBeds?.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Capacidade nacional</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Leitos por 1.000 hab</CardTitle>
                <LucidePieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">2.0</div>
                <p className="text-xs text-muted-foreground">Média nacional</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Estados</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{nationalData?.totalStates}</div>
                <p className="text-xs text-muted-foreground">Unidades federativas</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos Nacionais - Usando gráficos de barras simples */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Hospitais por Região</CardTitle>
                <CardDescription>Distribuição de hospitais privados por região brasileira</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {nationalChartData.map((region, index) => (
                    <div key={region.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="text-sm font-medium">{region.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 rounded"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                            width: `${(region.hospitals / Math.max(...nationalChartData.map((r) => r.hospitals))) * 100}px`,
                          }}
                        ></div>
                        <span className="text-sm text-muted-foreground w-12 text-right">{region.hospitals}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leitos por Região</CardTitle>
                <CardDescription>Capacidade de leitos privados por região</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {nationalChartData.map((region, index) => (
                    <div key={region.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="text-sm font-medium">{region.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 rounded"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                            width: `${(region.beds / Math.max(...nationalChartData.map((r) => r.beds))) * 100}px`,
                          }}
                        ></div>
                        <span className="text-sm text-muted-foreground w-16 text-right">
                          {region.beds.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Top 10 Estados - Número de Hospitais</CardTitle>
                <CardDescription>Estados com maior número de hospitais privados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {topStatesData.map((state, index) => (
                    <div key={state.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium w-6">{index + 1}.</span>
                        <span className="text-sm">{state.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 rounded bg-yellow-500"
                          style={{
                            width: `${(state.hospitals / topStatesData[0].hospitals) * 150}px`,
                          }}
                        ></div>
                        <span className="text-sm text-muted-foreground w-12 text-right">{state.hospitals}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        // Visão por Estado - Layout inspirado na imagem
        <div className="grid gap-6">
          {/* Primeira linha: Mapa + Métricas + Série temporal */}
          <div className="grid gap-6 lg:grid-cols-9">
            {/* Métricas principais */}
            <div className="lg:col-span-3 space-y-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-orange-600">{stateData.hospitals}</div>
                  <div className="text-sm text-muted-foreground">hospitais privados - 2024</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">{stateData.beds.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">leitos privados - 2024</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">{stateData.bedsPerThousand.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">leitos/1.000 hab - 2024</div>
                </CardContent>
              </Card>
            </div>

            {/* Série temporal */}
            <Card className="lg:col-span-6">
              <CardHeader>
                <CardTitle className="text-lg">Série Histórica - 2010-2024</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] flex items-end justify-between gap-1 p-4">
                  {timeSeriesData.map((item, index) => (
                    <div key={item.year} className="flex flex-col items-center gap-1">
                      <div
                        className="bg-blue-500 w-4 rounded-t"
                        style={{
                          height: `${(item.value / Math.max(...timeSeriesData.map((d) => d.value))) * 200}px`,
                        }}
                      ></div>
                      <span className="text-xs text-muted-foreground transform -rotate-45">{item.year}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Segunda linha: Gráficos de pizza */}
          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">por localização</CardTitle>
              </CardHeader>
              <CardContent>
                <SimplePieChart data={stateData.locationDistribution} colors={COLORS} />
                <div className="mt-2 space-y-1">
                  {stateData.locationDistribution.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs">
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span>
                        {item.name}: {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">por porte populacional</CardTitle>
              </CardHeader>
              <CardContent>
                <SimplePieChart data={stateData.populationDistribution} colors={COLORS} />
                <div className="mt-2 space-y-1">
                  {stateData.populationDistribution.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs">
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span>
                        {item.name}: {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">por porte hospitalar</CardTitle>
              </CardHeader>
              <CardContent>
                <SimplePieChart data={stateData.hospitalSizeDistribution} colors={COLORS} />
                <div className="mt-2 space-y-1">
                  {stateData.hospitalSizeDistribution.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs">
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span>
                        {item.name}: {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">por tipo de hospital</CardTitle>
              </CardHeader>
              <CardContent>
                <SimplePieChart data={stateData.hospitalTypeDistribution} colors={COLORS} />
                <div className="mt-2 space-y-1">
                  {stateData.hospitalTypeDistribution.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs">
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span>
                        {item.name}: {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">por tipo de atendimento</CardTitle>
              </CardHeader>
              <CardContent>
                <SimplePieChart data={stateData.serviceTypeDistribution} colors={COLORS} />
                <div className="mt-2 space-y-1">
                  {stateData.serviceTypeDistribution.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs">
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span>
                        {item.name}: {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
