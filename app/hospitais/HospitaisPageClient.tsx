"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building2,
  MapPin,
  Bed,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  Activity,
  BarChart3,
  Calendar,
  TrendingUp,
  Info,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Hospital {
  id: string
  nome?: string
  UF?: string
  municipio?: string
  regiao?: string
  tipo_unidade?: string
  vinculo_sus?: string
  historico?: {
    [ano: string]: {
      leitos?: {
        total?: number
        [tipoLeito: string]: number | undefined
      }
      [key: string]: any
    }
  }
  [key: string]: any
}

interface YearlyStats {
  ano: number
  total: number
  publicos: number
  privados: number
  totalLeitos: number
  mediaLeitos: number
  hospitaisComLeitos: number
}

export default function HospitaisPageClient() {
  const [hospitais, setHospitais] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterUF, setFilterUF] = useState<string>("all")
  const [filterTipo, setFilterTipo] = useState<string>("all")
  const [filterTipoUnidade, setFilterTipoUnidade] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("overview")

  const loadHospitais = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/hospitais")
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      if (!Array.isArray(data)) {
        throw new Error("Formato de dados inválido")
      }

      console.log("📊 Dados carregados:", data.length, "hospitais")

      // Debug: mostrar estrutura de alguns hospitais
      if (data.length > 0) {
        console.log("🏥 Exemplo de hospital:", data[0])
        if (data[0].historico) {
          console.log("📅 Histórico exemplo:", data[0].historico)
          const primeiroAno = Object.keys(data[0].historico)[0]
          if (primeiroAno && data[0].historico[primeiroAno]?.leitos) {
            console.log("🛏️ Leitos exemplo:", data[0].historico[primeiroAno].leitos)
          }
        }
      }

      setHospitais(data)
      toast({
        title: "✅ Dados carregados",
        description: `${data.length} hospitais encontrados`,
      })
    } catch (err) {
      console.error("❌ Erro ao carregar hospitais:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      toast({
        title: "❌ Erro",
        description: "Falha ao carregar dados dos hospitais",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Função para extrair número de leitos por ano - estrutura: histórico -> ano -> leitos -> total
  const getLeitos = (hospital: Hospital, ano?: number): number => {
    try {
      if (!hospital.historico) return 0

      let anoStr: string
      if (ano) {
        anoStr = ano.toString()
      } else {
        // Se não especificar ano, pegar o mais recente
        const anos = Object.keys(hospital.historico)
          .map(Number)
          .filter((n) => !isNaN(n))
          .sort((a, b) => b - a)
        if (anos.length === 0) return 0
        anoStr = anos[0].toString()
      }

      const dadosAno = hospital.historico[anoStr]
      if (!dadosAno?.leitos) return 0

      // A estrutura é: histórico -> ano -> leitos -> total
      return dadosAno.leitos.total || 0
    } catch {
      return 0
    }
  }

  // Função para obter detalhes dos tipos de leitos
  const getLeitosDetalhes = (hospital: Hospital, ano?: number): Record<string, number> => {
    try {
      if (!hospital.historico) return {}

      let anoStr: string
      if (ano) {
        anoStr = ano.toString()
      } else {
        const anos = Object.keys(hospital.historico)
          .map(Number)
          .filter((n) => !isNaN(n))
          .sort((a, b) => b - a)
        if (anos.length === 0) return {}
        anoStr = anos[0].toString()
      }

      const dadosAno = hospital.historico[anoStr]
      if (!dadosAno?.leitos) return {}

      // Filtrar apenas valores numéricos
      const detalhes: Record<string, number> = {}
      Object.entries(dadosAno.leitos).forEach(([key, value]) => {
        if (typeof value === "number") {
          detalhes[key] = value
        }
      })
      return detalhes
    } catch {
      return {}
    }
  }

  // Função para extrair nome
  const getNome = (hospital: Hospital): string => {
    return hospital.nome || hospital.name || `Hospital ${hospital.id}`
  }

  // Função para obter todos os anos disponíveis no histórico
  const getAllYears = (hospitais: Hospital[]): number[] => {
    const allYears = new Set<number>()

    hospitais.forEach((hospital) => {
      if (hospital.historico) {
        Object.keys(hospital.historico).forEach((ano) => {
          const year = Number.parseInt(ano)
          if (!isNaN(year) && year > 1900 && year <= new Date().getFullYear() + 1) {
            allYears.add(year)
          }
        })
      }
    })

    return Array.from(allYears).sort((a, b) => b - a)
  }

  // Função para verificar se hospital tem dados em um ano específico
  const hasDataForYear = (hospital: Hospital, ano: number): boolean => {
    return (
      hospital.historico &&
      hospital.historico[ano.toString()] !== undefined &&
      hospital.historico[ano.toString()].leitos !== undefined
    )
  }

  // Dados processados com filtros e estatísticas por ano
  const { filteredHospitais, yearlyStats, currentYearStats, filterOptions, availableYears } = useMemo(() => {
    const years = getAllYears(hospitais)
    const currentYear = selectedYear !== "all" ? Number.parseInt(selectedYear) : years[0] || new Date().getFullYear()

    let filtered = hospitais

    // Filtrar por ano primeiro (apenas hospitais que têm dados no ano selecionado)
    if (selectedYear !== "all") {
      filtered = filtered.filter((h) => hasDataForYear(h, Number.parseInt(selectedYear)))
    }

    // Aplicar outros filtros
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (h) =>
          getNome(h).toLowerCase().includes(search) ||
          h.municipio?.toLowerCase().includes(search) ||
          h.UF?.toLowerCase().includes(search),
      )
    }

    if (filterUF !== "all") {
      filtered = filtered.filter((h) => h.UF === filterUF)
    }

    if (filterTipo !== "all") {
      if (filterTipo === "publico") {
        filtered = filtered.filter((h) => h.vinculo_sus === "SUS")
      } else if (filterTipo === "privado") {
        filtered = filtered.filter((h) => h.vinculo_sus !== "SUS")
      }
    }

    if (filterTipoUnidade !== "all") {
      filtered = filtered.filter((h) => h.tipo_unidade === filterTipoUnidade)
    }

    // Estatísticas por ano
    const statsByYear: YearlyStats[] = years.map((ano) => {
      const yearData = hospitais.filter((h) => hasDataForYear(h, ano))
      const totalLeitos = yearData.reduce((sum, h) => sum + getLeitos(h, ano), 0)
      const publicos = yearData.filter((h) => h.vinculo_sus === "SUS").length
      const privados = yearData.length - publicos
      const hospitaisComLeitos = yearData.filter((h) => getLeitos(h, ano) > 0).length

      return {
        ano,
        total: yearData.length,
        publicos,
        privados,
        totalLeitos,
        mediaLeitos: hospitaisComLeitos > 0 ? Math.round(totalLeitos / hospitaisComLeitos) : 0,
        hospitaisComLeitos,
      }
    })

    // Estatísticas do ano atual/selecionado
    const currentData = selectedYear !== "all" ? filtered : hospitais.filter((h) => hasDataForYear(h, currentYear))
    const totalLeitos = currentData.reduce((sum, h) => sum + getLeitos(h, currentYear), 0)
    const publicos = currentData.filter((h) => h.vinculo_sus === "SUS").length
    const privados = currentData.length - publicos
    const leitosSUS = currentData
      .filter((h) => h.vinculo_sus === "SUS")
      .reduce((sum, h) => sum + getLeitos(h, currentYear), 0)
    const hospitaisComLeitos = currentData.filter((h) => getLeitos(h, currentYear) > 0).length

    // Opções para filtros
    const ufs = Array.from(new Set(hospitais.map((h) => h.UF).filter(Boolean))).sort()
    const tiposUnidade = Array.from(new Set(hospitais.map((h) => h.tipo_unidade).filter(Boolean))).sort()

    return {
      filteredHospitais: filtered,
      yearlyStats: statsByYear,
      currentYearStats: {
        total: currentData.length,
        publicos,
        privados,
        totalLeitos,
        leitosSUS,
        mediaLeitos: hospitaisComLeitos > 0 ? Math.round(totalLeitos / hospitaisComLeitos) : 0,
        hospitaisComLeitos,
        ano: currentYear,
      },
      filterOptions: { ufs, tiposUnidade },
      availableYears: years,
    }
  }, [hospitais, searchTerm, filterUF, filterTipo, filterTipoUnidade, selectedYear])

  useEffect(() => {
    loadHospitais()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-lg font-medium">Carregando hospitais...</p>
          <p className="text-sm text-muted-foreground">Processando dados históricos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            Hospitais do Brasil
          </h1>
          <p className="text-muted-foreground mt-1">
            Sistema Nacional de Saúde - Dados Históricos de Leitos
            {selectedYear !== "all" && ` (Ano ${selectedYear})`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadHospitais} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Info Alert */}
      {hospitais.length > 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Dados de {hospitais.length.toLocaleString()} hospitais carregados. Anos disponíveis:{" "}
            {availableYears.slice(0, 5).join(", ")}
            {availableYears.length > 5 && ` e mais ${availableYears.length - 5}`}
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="yearly">Evolução Anual</TabsTrigger>
          <TabsTrigger value="data">Dados Detalhados</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Current Year Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Hospitais {selectedYear !== "all" ? selectedYear : currentYearStats.ano}
                </CardTitle>
                <Building2 className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{currentYearStats.total.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {currentYearStats.hospitaisComLeitos} com dados de leitos
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rede SUS</CardTitle>
                <Activity className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{currentYearStats.publicos.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {currentYearStats.total > 0
                    ? Math.round((currentYearStats.publicos / currentYearStats.total) * 100)
                    : 0}
                  % do total ({currentYearStats.leitosSUS.toLocaleString()} leitos)
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Leitos</CardTitle>
                <Bed className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {currentYearStats.totalLeitos.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Capacidade hospitalar total</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Média de Leitos</CardTitle>
                <BarChart3 className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{currentYearStats.mediaLeitos}</div>
                <p className="text-xs text-muted-foreground">Por hospital com leitos</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="yearly" className="space-y-6">
          {/* Yearly Evolution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Evolução Histórica de Leitos Hospitalares
              </CardTitle>
            </CardHeader>
            <CardContent>
              {yearlyStats.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum dado histórico disponível</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {yearlyStats.map((stats) => (
                    <Card
                      key={stats.ano}
                      className="border-2 hover:border-blue-300 transition-colors cursor-pointer"
                      onClick={() => setSelectedYear(stats.ano.toString())}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {stats.ano}
                          {selectedYear === stats.ano.toString() && (
                            <Badge variant="default" className="ml-auto">
                              Ativo
                            </Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Hospitais:</span>
                          <span className="font-medium">{stats.total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">SUS:</span>
                          <span className="font-medium text-green-600">{stats.publicos.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Privados:</span>
                          <span className="font-medium text-blue-600">{stats.privados.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-sm font-medium">Leitos:</span>
                          <span className="font-bold text-orange-600">{stats.totalLeitos.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Média:</span>
                          <span className="font-medium text-purple-600">{stats.mediaLeitos}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Com leitos:</span>
                          <span className="font-medium">{stats.hospitaisComLeitos}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros de Pesquisa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ano</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os anos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os anos</SelectItem>
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Buscar</label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Nome ou localização..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Estado (UF)</label>
                  <Select value={filterUF} onValueChange={setFilterUF}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os estados</SelectItem>
                      {filterOptions.ufs.map((uf) => (
                        <SelectItem key={uf} value={uf}>
                          {uf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Vínculo</label>
                  <Select value={filterTipo} onValueChange={setFilterTipo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os vínculos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os vínculos</SelectItem>
                      <SelectItem value="publico">SUS (Público)</SelectItem>
                      <SelectItem value="privado">Privado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de Unidade</label>
                  <Select value={filterTipoUnidade} onValueChange={setFilterTipoUnidade}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os tipos</SelectItem>
                      {filterOptions.tiposUnidade.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Resultados ({filteredHospitais.length.toLocaleString()})</span>
                <div className="flex gap-2">
                  {selectedYear !== "all" && <Badge variant="outline">Ano {selectedYear}</Badge>}
                  {filteredHospitais.length !== hospitais.length && (
                    <Badge variant="secondary">{hospitais.length.toLocaleString()} total</Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredHospitais.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum hospital encontrado</h3>
                  <p className="text-muted-foreground">
                    {selectedYear !== "all"
                      ? `Nenhum hospital com dados para o ano ${selectedYear}`
                      : "Tente ajustar os filtros de busca"}
                  </p>
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Hospital</TableHead>
                        <TableHead className="font-semibold">Localização</TableHead>
                        <TableHead className="font-semibold">Tipo</TableHead>
                        <TableHead className="font-semibold text-right">
                          Leitos {selectedYear !== "all" && `(${selectedYear})`}
                        </TableHead>
                        <TableHead className="font-semibold">Vínculo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHospitais.slice(0, 100).map((hospital) => {
                        const ano = selectedYear !== "all" ? Number.parseInt(selectedYear) : undefined
                        const leitos = getLeitos(hospital, ano)
                        const nome = getNome(hospital)
                        const detalhesLeitos = getLeitosDetalhes(hospital, ano)

                        return (
                          <TableRow key={hospital.id} className="hover:bg-muted/30">
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="truncate" title={nome}>
                                  {nome}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="text-sm">
                                  {hospital.municipio}
                                  {hospital.UF && `, ${hospital.UF}`}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {hospital.tipo_unidade && (
                                <Badge variant="outline" className="text-xs">
                                  {hospital.tipo_unidade}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {leitos > 0 ? (
                                <div className="flex items-center justify-end gap-1">
                                  <Bed className="h-4 w-4 text-muted-foreground" />
                                  <span
                                    className="font-medium"
                                    title={`Detalhes dos leitos: ${Object.entries(detalhesLeitos)
                                      .map(([k, v]) => `${k}: ${v}`)
                                      .join(", ")}`}
                                  >
                                    {leitos.toLocaleString()}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">N/A</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={hospital.vinculo_sus === "SUS" ? "default" : "secondary"}>
                                {hospital.vinculo_sus === "SUS" ? "SUS" : "Privado"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                  {filteredHospitais.length > 100 && (
                    <div className="p-4 text-center text-sm text-muted-foreground bg-muted/30 border-t">
                      Mostrando primeiros 100 resultados de {filteredHospitais.length.toLocaleString()}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
