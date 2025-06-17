"use client"

import { useEffect, useState } from "react"
import { Loader2, RefreshCw, MapPin } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { loadRealHospitalData, getAllStates, getStateChartData } from "@/lib/real-data-processor"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

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

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [selectedState, setSelectedState] = useState<string>("acre") // Começar com Acre como na imagem
  const [stateData, setStateData] = useState<any>(null)
  const [allStates, setAllStates] = useState<any[]>([])

  const fetchData = async () => {
    setLoading(true)

    try {
      const realData = await loadRealHospitalData()
      const states = getAllStates()

      setAllStates(states)

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard - {stateData.name}</h1>
          <p className="text-muted-foreground">Análise detalhada da infraestrutura hospitalar</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecione um estado" />
            </SelectTrigger>
            <SelectContent>
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

      {/* Layout principal inspirado na imagem */}
      <div className="grid gap-6">
        {/* Primeira linha: Cards de métricas + Mapa + Série temporal */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Mapa (placeholder) */}
          <Card className="lg:col-span-3">
            <CardContent className="p-6">
              <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Mapa do {stateData.name}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {stateData.coordinates.Latitude.toFixed(2)}, {stateData.coordinates.Longitude.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

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
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0088FE"
                    strokeWidth={2}
                    dot={{ fill: "#0088FE", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
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
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={stateData.locationDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {stateData.locationDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, ""]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-1">
                {stateData.locationDistribution.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span>{item.name}</span>
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
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={stateData.populationDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {stateData.populationDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, ""]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-1">
                {stateData.populationDistribution.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span>{item.name}</span>
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
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={stateData.hospitalSizeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {stateData.hospitalSizeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, ""]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-1">
                {stateData.hospitalSizeDistribution.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span>{item.name}</span>
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
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={stateData.hospitalTypeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {stateData.hospitalTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, ""]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-1">
                {stateData.hospitalTypeDistribution.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span>{item.name}</span>
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
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={stateData.serviceTypeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {stateData.serviceTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, ""]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-1">
                {stateData.serviceTypeDistribution.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
