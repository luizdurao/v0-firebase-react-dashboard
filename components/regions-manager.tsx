"use client"

import { useEffect, useState } from "react"
import { Loader2, MapPin, Building2, Bed, Users, TrendingUp } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

import { loadRealHospitalData, calculateRegionalStats } from "@/lib/real-data-processor"

export default function RegionsManager() {
  const [loading, setLoading] = useState(true)
  const [regionalData, setRegionalData] = useState<any[]>([])
  const [nationalStats, setNationalStats] = useState<any>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const realData = await loadRealHospitalData()
      const regionalStats = calculateRegionalStats(realData)

      // Calcular estatísticas nacionais
      const nationalTotals = {
        totalHospitals: Object.values(realData).reduce((sum, data) => sum + data.Hospitais_Privados_2024, 0),
        totalBeds: Object.values(realData).reduce((sum, data) => sum + data.Leitos_Privados_2024, 0),
        totalStates: Object.keys(realData).length,
      }

      setRegionalData(Object.values(regionalStats))
      setNationalStats(nationalTotals)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getRegionColor = (regionName: string) => {
    const colors = {
      Norte: "bg-green-500",
      Nordeste: "bg-yellow-500",
      "Centro-Oeste": "bg-orange-500",
      Sudeste: "bg-blue-500",
      Sul: "bg-purple-500",
    }
    return colors[regionName] || "bg-gray-500"
  }

  const getRegionDescription = (regionName: string) => {
    const descriptions = {
      Norte: "Região amazônica com desafios de acesso e distribuição",
      Nordeste: "Maior região em número de estados, economia diversificada",
      "Centro-Oeste": "Região do agronegócio com crescimento acelerado",
      Sudeste: "Maior concentração econômica e populacional do país",
      Sul: "Região com alta qualidade de vida e desenvolvimento",
    }
    return descriptions[regionName] || "Região brasileira"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Regiões</h1>
          <p className="text-muted-foreground">
            Análise comparativa das regiões brasileiras - Dados hospitalares de 2024
          </p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading}>
          <Loader2 className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      {/* Estatísticas Nacionais */}
      {nationalStats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Nacional - Hospitais</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{nationalStats.totalHospitals.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Hospitais privados em {nationalStats.totalStates} estados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Nacional - Leitos</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{nationalStats.totalBeds.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Leitos privados disponíveis</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média por Estado</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(nationalStats.totalHospitals / nationalStats.totalStates)}
              </div>
              <p className="text-xs text-muted-foreground">Hospitais por estado</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Regiões */}
      <div className="grid gap-6">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          : regionalData
              .sort((a, b) => b.hospitals - a.hospitals)
              .map((region) => (
                <Card key={region.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${getRegionColor(region.name)}`}></div>
                        <div>
                          <CardTitle className="text-xl">{region.name}</CardTitle>
                          <CardDescription>{getRegionDescription(region.name)}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-sm">
                        {region.states.length} estados
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Estatísticas principais */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <Building2 className="h-4 w-4 text-blue-500" />
                            <span className="text-2xl font-bold">{region.hospitals}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Hospitais</p>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <Bed className="h-4 w-4 text-green-500" />
                            <span className="text-2xl font-bold">{region.totalBeds.toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Leitos</p>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <MapPin className="h-4 w-4 text-orange-500" />
                            <span className="text-2xl font-bold">{region.urbanAccessIndex}%</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Acesso Urbano</p>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <Users className="h-4 w-4 text-purple-500" />
                            <span className="text-2xl font-bold">{region.ruralAccessIndex}%</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Acesso Rural</p>
                        </div>
                      </div>

                      {/* Participação nacional */}
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Participação em Hospitais</span>
                            <span>{((region.hospitals / nationalStats.totalHospitals) * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={(region.hospitals / nationalStats.totalHospitals) * 100} className="h-2" />
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Participação em Leitos</span>
                            <span>{((region.totalBeds / nationalStats.totalBeds) * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={(region.totalBeds / nationalStats.totalBeds) * 100} className="h-2" />
                        </div>
                      </div>

                      {/* Estados da região */}
                      <div>
                        <p className="text-sm font-medium mb-2">Estados da Região:</p>
                        <div className="flex flex-wrap gap-2">
                          {region.states.map((state, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {state}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
      </div>
    </div>
  )
}
