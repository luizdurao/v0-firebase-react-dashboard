"use client"

import { useEffect, useState } from "react"
import { Loader2, RefreshCw, BarChart3, Users, Building2, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { regionalHospitalData } from "@/lib/hospital-regional-data"

export default function RegionsManager() {
  const [loading, setLoading] = useState(true)
  const [regionData, setRegionData] = useState<any[]>([])
  const [totalStats, setTotalStats] = useState({
    totalHospitals: 0,
    totalBeds: 0,
    totalStates: 0,
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      // Usar dados reais do CSV em vez de loadRealHospitalData
      const regions = regionalHospitalData.map((region) => ({
        id: region.id,
        name: region.name,
        hospitals: region.hospitais,
        hospitalDistribution: region.distribuicaoHospitais,
        beneficiaryDistribution: region.distribuicaoBeneficiarios,
        nonProfitPercentage: region.semFinsLucrativos,
        forProfitPercentage: region.comFinsLucrativos,
        beds: region.leitos,
        bedDistribution: region.distribuicaoLeitos,
        bedBeneficiaryDistribution: region.distribuicaoLeitosBeneficiarios,
        nonProfitBeds: region.leitosSemFinsLucrativos,
        forProfitBeds: region.leitosComFinsLucrativos,
        avgBedsPerHospital: Math.round(region.leitos / region.hospitais),
        stateCount: getStateCountByRegion(region.id),
      }))

      // Calcular totais
      const totals = {
        totalHospitals: regions.reduce((sum, r) => sum + r.hospitals, 0),
        totalBeds: regions.reduce((sum, r) => sum + r.beds, 0),
        totalStates: regions.reduce((sum, r) => sum + r.stateCount, 0),
      }

      setRegionData(regions)
      setTotalStats(totals)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getRegionColor = (region: string) => {
    const colors = {
      Norte: "bg-green-100 text-green-800 border-green-200",
      Nordeste: "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Centro-Oeste": "bg-orange-100 text-orange-800 border-orange-200",
      Sudeste: "bg-blue-100 text-blue-800 border-blue-200",
      Sul: "bg-purple-100 text-purple-800 border-purple-200",
    }
    return colors[region as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  function getStateCountByRegion(regionId: string): number {
    const stateCounts = {
      north: 7, // AC, AM, AP, PA, RO, RR, TO
      northeast: 9, // AL, BA, CE, MA, PB, PE, PI, RN, SE
      "central-west": 4, // DF, GO, MT, MS
      southeast: 4, // ES, MG, RJ, SP
      south: 3, // PR, RS, SC
    }
    return stateCounts[regionId as keyof typeof stateCounts] || 0
  }

  // Função auxiliar para população regional (estimativa)
  function getRegionPopulation(region: string): number {
    const populations = {
      Norte: 18000,
      Nordeste: 57000,
      "Centro-Oeste": 16000,
      Sudeste: 89000,
      Sul: 30000,
    }
    return populations[region as keyof typeof populations] || 10000
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Regiões</h1>
          <p className="text-muted-foreground">Visualize e analise os dados das regiões do Brasil</p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Regiões</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Regiões do Brasil</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Estados</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalStates}</div>
            <p className="text-xs text-muted-foreground">Estados + DF</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Hospitais</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalHospitals.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Hospitais privados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leitos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalBeds.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Leitos privados</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Regiões */}
      <Card>
        <CardHeader>
          <CardTitle>Regiões do Brasil</CardTitle>
          <CardDescription>Dados detalhados por região geográfica</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-[300px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Região</TableHead>
                  <TableHead className="text-right">Estados</TableHead>
                  <TableHead className="text-right">Hospitais</TableHead>
                  <TableHead className="text-right">Dist. Hosp. (%)</TableHead>
                  <TableHead className="text-right">Benef. (%)</TableHead>
                  <TableHead className="text-right">Sem Fins Lucr. (%)</TableHead>
                  <TableHead className="text-right">Com Fins Lucr. (%)</TableHead>
                  <TableHead className="text-right">Leitos</TableHead>
                  <TableHead className="text-right">Dist. Leitos (%)</TableHead>
                  <TableHead className="text-right">Benef. Leitos (%)</TableHead>
                  <TableHead className="text-right">Leitos S/Lucro (%)</TableHead>
                  <TableHead className="text-right">Leitos C/Lucro (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regionData.map((region) => (
                  <TableRow key={region.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge className={getRegionColor(region.name)}>{region.name}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{region.stateCount}</TableCell>
                    <TableCell className="text-right font-semibold">{region.hospitals.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{region.hospitalDistribution}%</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{region.beneficiaryDistribution}%</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-green-100 text-green-800">{region.nonProfitPercentage}%</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-blue-100 text-blue-800">{region.forProfitPercentage}%</Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">{region.beds.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{region.bedDistribution}%</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{region.bedBeneficiaryDistribution}%</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-green-100 text-green-800">{region.nonProfitBeds}%</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-blue-100 text-blue-800">{region.forProfitBeds}%</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
