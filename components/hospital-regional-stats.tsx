"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { regionalHospitalData, calculateFilteredHospitalStats } from "@/lib/hospital-regional-data"
import { Building2, Bed, Users, TrendingUp, Heart, PieChart } from "lucide-react"

interface HospitalRegionalStatsProps {
  filteredRegions?: string[]
}

export default function HospitalRegionalStats({ filteredRegions }: HospitalRegionalStatsProps) {
  const selectedRegions =
    filteredRegions && filteredRegions.length > 0 ? filteredRegions : regionalHospitalData.map((r) => r.id)

  const stats = calculateFilteredHospitalStats(selectedRegions)
  const isFiltered =
    filteredRegions && filteredRegions.length > 0 && filteredRegions.length < regionalHospitalData.length

  const getRegionColor = (regionName: string) => {
    const colors = {
      Norte: "bg-emerald-50 border-emerald-200",
      Nordeste: "bg-amber-50 border-amber-200",
      "Centro-Oeste": "bg-orange-50 border-orange-200",
      Sudeste: "bg-blue-50 border-blue-200",
      Sul: "bg-purple-50 border-purple-200",
    }
    return colors[regionName as keyof typeof colors] || "bg-gray-50 border-gray-200"
  }

  const getRegionBadgeColor = (regionName: string) => {
    const colors = {
      Norte: "bg-emerald-100 text-emerald-800 border-emerald-300",
      Nordeste: "bg-amber-100 text-amber-800 border-amber-300",
      "Centro-Oeste": "bg-orange-100 text-orange-800 border-orange-300",
      Sudeste: "bg-blue-100 text-blue-800 border-blue-300",
      Sul: "bg-purple-100 text-purple-800 border-purple-300",
    }
    return colors[regionName as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-300"
  }

  return (
    <div className="space-y-8">
      {/* Header com totais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Total Hospitais</CardTitle>
              <Building2 className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-gray-900">{stats.hospitais.toLocaleString()}</div>
            <p className="text-sm text-gray-500 mt-1">
              {isFiltered ? `${stats.regioes} regiões selecionadas` : "Todas as regiões"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Total Leitos</CardTitle>
              <Bed className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-gray-900">{stats.leitos.toLocaleString()}</div>
            <p className="text-sm text-gray-500 mt-1">Setor privado</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Média Leitos</CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-gray-900">{stats.leitosPorHospital}</div>
            <p className="text-sm text-gray-500 mt-1">Por hospital</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Regiões</CardTitle>
              <Users className="h-5 w-5 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-gray-900">{stats.regioes}</div>
            <p className="text-sm text-gray-500 mt-1">de 5 regiões</p>
          </CardContent>
        </Card>
      </div>

      {/* Análise Regional */}
      <Card>
        <CardHeader className="pb-6">
          <CardTitle className="text-xl font-semibold">Análise Regional - Hospitais Privados</CardTitle>
          <CardDescription className="text-base">
            Dados detalhados do setor privado por região brasileira - 2024
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {stats.data.map((region, index) => (
              <div key={region.id}>
                <div className={`p-6 rounded-lg border-2 ${getRegionColor(region.name)}`}>
                  {/* Header da Região */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Badge className={`px-3 py-1 text-sm font-medium ${getRegionBadgeColor(region.name)}`}>
                        {region.name}
                      </Badge>
                    </div>
                    <div className="flex gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{region.hospitais.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">hospitais</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{region.leitos.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">leitos</div>
                      </div>
                    </div>
                  </div>

                  {/* Distribuição Nacional */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <PieChart className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-gray-700">Distribuição Nacional</span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">Hospitais</span>
                            <span className="text-sm font-semibold text-blue-600">{region.distribuicaoHospitais}%</span>
                          </div>
                          <Progress value={region.distribuicaoHospitais} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">Leitos</span>
                            <span className="text-sm font-semibold text-green-600">{region.distribuicaoLeitos}%</span>
                          </div>
                          <Progress value={region.distribuicaoLeitos} className="h-2" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-purple-600" />
                        <span className="font-medium text-gray-700">Beneficiários</span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">Hospitais</span>
                            <span className="text-sm font-semibold text-purple-600">
                              {region.distribuicaoBeneficiarios}%
                            </span>
                          </div>
                          <Progress value={region.distribuicaoBeneficiarios} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">Leitos</span>
                            <span className="text-sm font-semibold text-pink-600">
                              {region.distribuicaoLeitosBeneficiarios}%
                            </span>
                          </div>
                          <Progress value={region.distribuicaoLeitosBeneficiarios} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Tipo de Gestão */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-700 flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Gestão dos Hospitais
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                          <span className="text-sm font-medium text-green-800">Sem Fins Lucrativos</span>
                          <span className="text-lg font-bold text-green-700">{region.semFinsLucrativos}%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <span className="text-sm font-medium text-blue-800">Com Fins Lucrativos</span>
                          <span className="text-lg font-bold text-blue-700">{region.comFinsLucrativos}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-700 flex items-center gap-2">
                        <Bed className="h-4 w-4" />
                        Gestão dos Leitos
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                          <span className="text-sm font-medium text-green-800">Sem Fins Lucrativos</span>
                          <span className="text-lg font-bold text-green-700">{region.leitosSemFinsLucrativos}%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <span className="text-sm font-medium text-blue-800">Com Fins Lucrativos</span>
                          <span className="text-lg font-bold text-blue-700">{region.leitosComFinsLucrativos}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Métricas Resumo */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <div className="text-xl font-bold text-blue-600">
                          {Math.round(region.leitos / region.hospitais)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Leitos/Hospital</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <div className="text-xl font-bold text-green-600">
                          {Math.round((region.semFinsLucrativos + region.leitosSemFinsLucrativos) / 2)}%
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Média Sem Fins</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border">
                        <div className="text-xl font-bold text-purple-600">
                          {Math.round((region.distribuicaoBeneficiarios + region.distribuicaoLeitosBeneficiarios) / 2)}%
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Média Beneficiários</div>
                      </div>
                    </div>
                  </div>
                </div>
                {index < stats.data.length - 1 && <Separator className="my-8" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
