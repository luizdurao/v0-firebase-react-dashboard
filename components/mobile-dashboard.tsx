"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Hospital, Users, Bed, Activity, Map, BarChart3 } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

// Dados de exemplo para os estados
const stateOptions = [
  { value: "all", label: "Brasil (Nacional)" },
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
]

// Dados de exemplo para as métricas
const nationalData = {
  hospitals: 8457,
  beds: 489000,
  bedsPerThousand: 2.3,
  doctors: 502000,
  population: 214.3,
  urbanAccess: 87.5,
  ruralAccess: 62.3,
  distribution: {
    public: 42,
    private: 58,
  },
  bySize: {
    small: 45,
    medium: 32,
    large: 23,
  },
  byType: {
    general: 68,
    specialized: 32,
  },
  byService: {
    emergency: 58,
    outpatient: 92,
    inpatient: 78,
    diagnostic: 65,
  },
  byPopulation: {
    urban: 82,
    rural: 18,
  },
  topStates: [
    { name: "SP", value: 2184 },
    { name: "MG", value: 942 },
    { name: "RJ", value: 684 },
    { name: "RS", value: 512 },
    { name: "PR", value: 486 },
    { name: "BA", value: 432 },
    { name: "SC", value: 378 },
    { name: "GO", value: 312 },
    { name: "PE", value: 298 },
    { name: "CE", value: 276 },
  ],
  historicalData: [
    { year: 2010, value: 6800 },
    { year: 2012, value: 7100 },
    { year: 2014, value: 7350 },
    { year: 2016, value: 7600 },
    { year: 2018, value: 7900 },
    { year: 2020, value: 8150 },
    { year: 2022, value: 8300 },
    { year: 2024, value: 8457 },
  ],
}

// Componente de gráfico de pizza simples
const SimplePieChart = ({ data, title, colors }) => {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {Object.entries(data).map(([key, value], index) => {
            const startAngle =
              index === 0
                ? 0
                : (Object.entries(data)
                    .slice(0, index)
                    .reduce((sum, [_, val]) => sum + (val as number), 0) /
                    Object.values(data).reduce((sum, val) => sum + (val as number), 0)) *
                  360

            const endAngle =
              startAngle +
              ((value as number) / Object.values(data).reduce((sum, val) => sum + (val as number), 0)) * 360

            const startRad = ((startAngle - 90) * Math.PI) / 180
            const endRad = ((endAngle - 90) * Math.PI) / 180

            const x1 = 50 + 35 * Math.cos(startRad)
            const y1 = 50 + 35 * Math.sin(startRad)
            const x2 = 50 + 35 * Math.cos(endRad)
            const y2 = 50 + 35 * Math.sin(endRad)

            const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

            const pathData = `M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

            return <path key={key} d={pathData} fill={colors[index % colors.length]} stroke="#fff" strokeWidth="1" />
          })}
          <circle cx="50" cy="50" r="20" fill="white" />
        </svg>
      </div>
      <div className="mt-3 w-full">
        {Object.entries(data).map(([key, value], index) => {
          const percentage = (
            ((value as number) / Object.values(data).reduce((sum, val) => sum + (val as number), 0)) *
            100
          ).toFixed(0)
          return (
            <div key={key} className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: colors[index % colors.length] }} />
                <span className="capitalize">{key}</span>
              </div>
              <span>{percentage}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Componente de gráfico de barras simples
const SimpleBarChart = ({ data, title, color }) => {
  const maxValue = Math.max(...data.map((item) => item.value))

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center text-xs">
            <div className="w-8 text-right mr-2">{item.name}</div>
            <div className="flex-1">
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
            <div className="w-12 text-right ml-2">{item.value.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Componente de gráfico de linha temporal simples
const SimpleTimeChart = ({ data, title, color }) => {
  const maxValue = Math.max(...data.map((item) => item.value))

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <div className="flex items-end justify-between h-32 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className="w-6 rounded-t-sm"
              style={{
                height: `${(item.value / maxValue) * 100}%`,
                backgroundColor: color,
              }}
            />
            <div className="text-xs mt-1 -rotate-45 origin-top-left">{item.year}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Componente de estatística
const StatCard = ({ icon, title, value, trend, trendValue }) => {
  const Icon = icon

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Icon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{title}</p>
              <h3 className="text-xl font-bold">{value}</h3>
            </div>
          </div>
          {trend && (
            <div className={`flex items-center text-xs ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
              {trend === "up" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function MobileDashboard() {
  const [selectedState, setSelectedState] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [stateData, setStateData] = useState(nationalData)

  // Simular carregamento de dados
  useEffect(() => {
    setIsLoading(true)

    // Simular delay de carregamento
    const timer = setTimeout(() => {
      // Aqui você carregaria dados reais baseados no estado selecionado
      setStateData(nationalData)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [selectedState])

  return (
    <div className="container px-4 py-4">
      <div className="mb-4">
        <h1 className="text-xl font-bold mb-2">Dashboard de Saúde</h1>
        <p className="text-sm text-gray-500">Visualização de dados hospitalares do Brasil</p>
      </div>

      <div className="mb-4">
        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um estado" />
          </SelectTrigger>
          <SelectContent>
            {stateOptions.map((state) => (
              <SelectItem key={state.value} value={state.value}>
                {state.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview" className="text-xs">
            <div className="flex flex-col items-center">
              <BarChart3 className="h-4 w-4 mb-1" />
              <span>Geral</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="hospitals" className="text-xs">
            <div className="flex flex-col items-center">
              <Hospital className="h-4 w-4 mb-1" />
              <span>Hospitais</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="resources" className="text-xs">
            <div className="flex flex-col items-center">
              <Bed className="h-4 w-4 mb-1" />
              <span>Recursos</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="map" className="text-xs">
            <div className="flex flex-col items-center">
              <Map className="h-4 w-4 mb-1" />
              <span>Mapa</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <StatCard
              icon={Hospital}
              title="Hospitais"
              value={stateData.hospitals.toLocaleString()}
              trend="up"
              trendValue="2.1%"
            />
            <StatCard icon={Bed} title="Leitos" value={stateData.beds.toLocaleString()} trend="up" trendValue="1.5%" />
            <StatCard
              icon={Users}
              title="Médicos"
              value={stateData.doctors.toLocaleString()}
              trend="up"
              trendValue="3.2%"
            />
            <StatCard
              icon={Activity}
              title="Leitos/1000"
              value={stateData.bedsPerThousand.toFixed(1)}
              trend="up"
              trendValue="0.2"
            />
          </div>

          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Evolução Histórica</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleTimeChart data={stateData.historicalData} title="Hospitais (2010-2024)" color="#3b82f6" />
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <SimplePieChart data={stateData.byType} title="" colors={["#3b82f6", "#93c5fd"]} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Por Administração</CardTitle>
              </CardHeader>
              <CardContent>
                <SimplePieChart data={stateData.distribution} title="" colors={["#3b82f6", "#93c5fd"]} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Top 5 Estados</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={stateData.topStates.slice(0, 5)} title="" color="#3b82f6" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hospitals" className="mt-0">
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Distribuição de Hospitais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <SimplePieChart data={stateData.bySize} title="Por Porte" colors={["#3b82f6", "#60a5fa", "#93c5fd"]} />
                <SimplePieChart data={stateData.byPopulation} title="Por Localização" colors={["#3b82f6", "#93c5fd"]} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Serviços Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stateData.byService).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{key}</span>
                      <span>{value}%</span>
                    </div>
                    <Progress value={value as number} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="mt-0">
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Acesso à Saúde</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Acesso Urbano</span>
                    <span>{stateData.urbanAccess}%</span>
                  </div>
                  <Progress value={stateData.urbanAccess} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Acesso Rural</span>
                    <span>{stateData.ruralAccess}%</span>
                  </div>
                  <Progress value={stateData.ruralAccess} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Recursos por Região</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Collapsible className="w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge className="bg-blue-500 mr-2">SE</Badge>
                    <span className="font-medium">Sudeste</span>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="pt-2">
                  <div className="space-y-2 pl-8">
                    <div className="flex justify-between text-sm">
                      <span>Hospitais:</span>
                      <span>2,184</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Leitos:</span>
                      <span>340,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Médicos:</span>
                      <span>312,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Leitos/1000:</span>
                      <span>3.8</span>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              <Collapsible className="w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge className="bg-green-500 mr-2">NE</Badge>
                    <span className="font-medium">Nordeste</span>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="pt-2">
                  <div className="space-y-2 pl-8">
                    <div className="flex justify-between text-sm">
                      <span>Hospitais:</span>
                      <span>1,083</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Leitos:</span>
                      <span>156,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Médicos:</span>
                      <span>134,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Leitos/1000:</span>
                      <span>2.7</span>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              <Collapsible className="w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge className="bg-purple-500 mr-2">S</Badge>
                    <span className="font-medium">Sul</span>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="pt-2">
                  <div className="space-y-2 pl-8">
                    <div className="flex justify-between text-sm">
                      <span>Hospitais:</span>
                      <span>1,042</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Leitos:</span>
                      <span>136,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Médicos:</span>
                      <span>124,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Leitos/1000:</span>
                      <span>4.5</span>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Mapa de Distribuição</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[4/3] w-full bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center p-4">
                  <Map className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Toque para abrir o mapa completo</p>
                  <Button className="mt-3" size="sm">
                    Ver Mapa Detalhado
                  </Button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Hospitais por Região</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Badge className="bg-blue-500 mr-2">SE</Badge>
                      <span className="text-sm">2,184</span>
                    </div>
                    <div className="flex items-center">
                      <Badge className="bg-green-500 mr-2">NE</Badge>
                      <span className="text-sm">1,083</span>
                    </div>
                    <div className="flex items-center">
                      <Badge className="bg-purple-500 mr-2">S</Badge>
                      <span className="text-sm">1,042</span>
                    </div>
                    <div className="flex items-center">
                      <Badge className="bg-yellow-500 mr-2">CO</Badge>
                      <span className="text-sm">548</span>
                    </div>
                    <div className="flex items-center">
                      <Badge className="bg-red-500 mr-2">N</Badge>
                      <span className="text-sm">447</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Leitos por Região</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Badge className="bg-blue-500 mr-2">SE</Badge>
                      <span className="text-sm">340k</span>
                    </div>
                    <div className="flex items-center">
                      <Badge className="bg-green-500 mr-2">NE</Badge>
                      <span className="text-sm">156k</span>
                    </div>
                    <div className="flex items-center">
                      <Badge className="bg-purple-500 mr-2">S</Badge>
                      <span className="text-sm">136k</span>
                    </div>
                    <div className="flex items-center">
                      <Badge className="bg-yellow-500 mr-2">CO</Badge>
                      <span className="text-sm">62k</span>
                    </div>
                    <div className="flex items-center">
                      <Badge className="bg-red-500 mr-2">N</Badge>
                      <span className="text-sm">52k</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
