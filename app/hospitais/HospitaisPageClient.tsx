"use client"

import { useCallback } from "react"
import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import DebugLeitos from "@/components/debug-leitos"
import {
  Building2,
  MapPin,
  Bed,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Info,
  Bug,
  Calendar,
  BarChart3,
  Loader2,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import SimpleDataTest from "@/components/simple-data-test"

interface HistoricoItem {
  ano: number
  leitos: {
    total: number
    cirurgico?: number
    clinico?: number
    obstetrico?: number
    pediatrico?: number
    outras_especialidades?: number
    complementar?: number
    hospital_dia?: number
  }
}

interface Hospital {
  id: string
  _id: number
  nome: string
  cnpj?: string
  municipio?: string
  uf: string
  dependencia?: string
  tipo_unidade: string
  vinculo_sus: string
  historico: HistoricoItem[]
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
  leitosSUS: number
}

const DEFAULT_CURRENT_YEAR_STATS: YearlyStats = {
  ano: new Date().getFullYear(),
  total: 0,
  publicos: 0,
  privados: 0,
  totalLeitos: 0,
  mediaLeitos: 0,
  hospitaisComLeitos: 0,
  leitosSUS: 0,
}

export default function HospitaisPageClient() {
  const [hospitais, setHospitais] = useState<Hospital[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterUF, setFilterUF] = useState<string>("all")
  const [filterTipo, setFilterTipo] = useState<string>("all")
  const [filterTipoUnidade, setFilterTipoUnidade] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string | undefined>(undefined)
  const [activeTab, setActiveTab] = useState("overview")

  const loadHospitais = useCallback(async () => {
    setIsLoading(true)
    setIsProcessing(true)
    setError(null)
    try {
      const response = await fetch("/api/hospitais")
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Falha ao decodificar erro da API" }))
        throw new Error(`API Erro ${response.status}: ${errorData.error || response.statusText}`)
      }
      const data = await response.json()
      if (!Array.isArray(data)) {
        throw new Error("Formato de dados inválido recebido da API.")
      }
      setHospitais(data)
      toast({
        title: "✅ Dados Carregados",
        description: `${data.length} hospitais encontrados.`,
      })
    } catch (err) {
      console.error("❌ Erro ao carregar hospitais:", err)
      const message = err instanceof Error ? err.message : "Erro desconhecido ao carregar dados."
      setError(message)
      toast({
        title: "❌ Erro de Carregamento",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      // isProcessing será definido como false pelo useMemo após os cálculos iniciais
    }
  }, [])

  useEffect(() => {
    loadHospitais()
  }, [loadHospitais])

  const getAllYears = useCallback((data: Hospital[]): number[] => {
    const allYears = new Set<number>()
    data.forEach((hospital) => {
      if (hospital.historico && Array.isArray(hospital.historico)) {
        hospital.historico.forEach((item) => {
          if (item && typeof item.ano === "number" && item.ano > 1900 && item.ano < 2100) {
            allYears.add(item.ano)
          }
        })
      }
    })
    return Array.from(allYears).sort((a, b) => b - a)
  }, [])

  useEffect(() => {
    if (!isLoading && hospitais.length > 0 && selectedYear === undefined) {
      setIsProcessing(true) // Indica que estamos processando para definir o ano
      const years = getAllYears(hospitais)
      if (years.length > 0) {
        const defaultYear = years.includes(2024) ? "2024" : years[0].toString()
        setSelectedYear(defaultYear)
      } else {
        setSelectedYear("all")
      }
      // isProcessing será definido como false pelo useMemo
    } else if (!isLoading && hospitais.length === 0 && selectedYear === undefined) {
      setSelectedYear("all")
      setIsProcessing(false) // Não há o que processar
    }
  }, [isLoading, hospitais, selectedYear, getAllYears])

  const getLeitos = useCallback(
    (hospital: Hospital, ano?: number): number => {
      if (!hospital.historico || hospital.historico.length === 0) return 0
      const availableYearsInHospital = getAllYears([hospital])
      const targetAno = ano || (availableYearsInHospital.length > 0 ? availableYearsInHospital[0] : undefined)
      if (!targetAno) return 0
      const dadosAno = hospital.historico.find((h) => h.ano === targetAno)
      return dadosAno?.leitos?.total || 0
    },
    [getAllYears],
  )

  const getLeitosDetalhes = useCallback(
    (hospital: Hospital, ano?: number): Record<string, number> => {
      if (!hospital.historico || hospital.historico.length === 0) return {}
      const availableYearsInHospital = getAllYears([hospital])
      const targetAno = ano || (availableYearsInHospital.length > 0 ? availableYearsInHospital[0] : undefined)
      if (!targetAno) return {}
      const dadosAno = hospital.historico.find((h) => h.ano === targetAno)
      if (!dadosAno?.leitos) return {}
      const detalhes: Record<string, number> = {}
      Object.entries(dadosAno.leitos).forEach(([key, value]) => {
        if (typeof value === "number") detalhes[key] = value
      })
      return detalhes
    },
    [getAllYears],
  )

  const getNome = (hospital: Hospital): string => hospital.nome || `Hospital ${hospital._id || hospital.id}`

  const hasDataForYear = useCallback((hospital: Hospital, ano: number): boolean => {
    if (!hospital.historico) return false
    return hospital.historico.some((item) => item.ano === ano && item.leitos?.total !== undefined)
  }, [])

  const { filteredHospitais, yearlyStats, currentYearStats, filterOptions, availableYears, chartData } = useMemo(() => {
    if (selectedYear === undefined && hospitais.length > 0) {
      // Se selectedYear ainda não foi definido pelo useEffect, não prossiga com cálculos pesados
      // Retorne valores padrão para evitar erros e aguarde selectedYear ser definido.
      return {
        filteredHospitais: [],
        yearlyStats: [],
        currentYearStats: DEFAULT_CURRENT_YEAR_STATS,
        filterOptions: { ufs: [], tiposUnidade: [] },
        availableYears: [],
        chartData: [],
      }
    }
    setIsProcessing(true)
    const years = getAllYears(hospitais)

    let yearForFilteringTable: number | "all"
    if (selectedYear === "all" || selectedYear === undefined) {
      yearForFilteringTable = "all"
    } else {
      yearForFilteringTable = Number.parseInt(selectedYear, 10)
    }

    let baseHospitais = hospitais
    if (yearForFilteringTable !== "all" && typeof yearForFilteringTable === "number") {
      baseHospitais = hospitais.filter((h) => hasDataForYear(h, yearForFilteringTable))
    }

    let processedFilteredHospitais = baseHospitais
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      processedFilteredHospitais = processedFilteredHospitais.filter(
        (h) => getNome(h).toLowerCase().includes(search) || h.uf?.toLowerCase().includes(search),
      )
    }
    if (filterUF !== "all") {
      processedFilteredHospitais = processedFilteredHospitais.filter((h) => h.uf === filterUF)
    }
    if (filterTipo !== "all") {
      processedFilteredHospitais = processedFilteredHospitais.filter((h) =>
        filterTipo === "publico" ? h.vinculo_sus === "SUS" : h.vinculo_sus !== "SUS",
      )
    }
    if (filterTipoUnidade !== "all") {
      processedFilteredHospitais = processedFilteredHospitais.filter((h) => h.tipo_unidade === filterTipoUnidade)
    }

    const statsByYear: YearlyStats[] = years.map((ano) => {
      const yearData = hospitais.filter((h) => hasDataForYear(h, ano))
      const totalLeitos = yearData.reduce((sum, h) => sum + getLeitos(h, ano), 0)
      const publicos = yearData.filter((h) => h.vinculo_sus === "SUS").length
      const leitosSUS = yearData.filter((h) => h.vinculo_sus === "SUS").reduce((sum, h) => sum + getLeitos(h, ano), 0)
      const hospitaisComLeitos = yearData.filter((h) => getLeitos(h, ano) > 0).length
      return {
        ano,
        total: yearData.length,
        publicos,
        privados: yearData.length - publicos,
        totalLeitos,
        mediaLeitos: hospitaisComLeitos > 0 ? Math.round(totalLeitos / hospitaisComLeitos) : 0,
        hospitaisComLeitos,
        leitosSUS,
      }
    })

    const graphData = statsByYear
      .sort((a, b) => a.ano - b.ano)
      .map((s) => ({
        ano: s.ano.toString(),
        leitos: s.totalLeitos,
        hospitais: s.total,
        sus: s.publicos,
        privados: s.privados,
      }))

    let calculatedCurrentYearStats = DEFAULT_CURRENT_YEAR_STATS
    const targetYearForOverviewStats =
      selectedYear === "all" || selectedYear === undefined
        ? years.length > 0
          ? years.includes(2024)
            ? 2024
            : years[0]
          : new Date().getFullYear()
        : Number.parseInt(selectedYear, 10)

    // Hospitais para o card de Visão Geral devem respeitar os filtros de texto/UF/tipo
    // e ser filtrados pelo targetYearForOverviewStats
    const hospitaisParaOverviewStats = processedFilteredHospitais.filter((h) =>
      hasDataForYear(h, targetYearForOverviewStats),
    )

    if (hospitaisParaOverviewStats.length > 0 || years.length > 0) {
      const cTotalLeitos = hospitaisParaOverviewStats.reduce(
        (sum, h) => sum + getLeitos(h, targetYearForOverviewStats),
        0,
      )
      const cPublicos = hospitaisParaOverviewStats.filter((h) => h.vinculo_sus === "SUS").length
      const cLeitosSUS = hospitaisParaOverviewStats
        .filter((h) => h.vinculo_sus === "SUS")
        .reduce((sum, h) => sum + getLeitos(h, targetYearForOverviewStats), 0)
      const cHospitaisComLeitos = hospitaisParaOverviewStats.filter(
        (h) => getLeitos(h, targetYearForOverviewStats) > 0,
      ).length

      calculatedCurrentYearStats = {
        ano: targetYearForOverviewStats,
        total: hospitaisParaOverviewStats.length,
        publicos: cPublicos,
        privados: hospitaisParaOverviewStats.length - cPublicos,
        totalLeitos: cTotalLeitos,
        leitosSUS: cLeitosSUS,
        mediaLeitos: cHospitaisComLeitos > 0 ? Math.round(cTotalLeitos / cHospitaisComLeitos) : 0,
        hospitaisComLeitos: cHospitaisComLeitos,
      }
    }

    const ufs = Array.from(new Set(hospitais.map((h) => h.uf).filter(Boolean))).sort()
    const tiposUnidade = Array.from(new Set(hospitais.map((h) => h.tipo_unidade).filter(Boolean))).sort()

    setTimeout(() => setIsProcessing(false), 0)

    return {
      filteredHospitais: processedFilteredHospitais, // Usado na tabela "Dados Detalhados"
      yearlyStats: statsByYear,
      currentYearStats: calculatedCurrentYearStats, // Usado no card "Visão Geral"
      filterOptions: { ufs, tiposUnidade },
      availableYears: years,
      chartData: graphData,
    }
  }, [
    hospitais,
    searchTerm,
    filterUF,
    filterTipo,
    filterTipoUnidade,
    selectedYear,
    getAllYears,
    getLeitos,
    hasDataForYear,
  ])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-lg font-medium">Carregando dados dos hospitais...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-4">
        <Alert variant="destructive" className="flex items-start">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <div className="ml-3 flex-1">
            <AlertDescription>
              <p className="font-semibold">Ocorreu um erro:</p>
              <p className="text-sm mt-1">{error}</p>
              <Button onClick={loadHospitais} variant="outline" size="sm" className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" /> Tentar Novamente
              </Button>
            </AlertDescription>
          </div>
        </Alert>
      </div>
    )
  }

  if (selectedYear === undefined && hospitais.length > 0 && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-lg font-medium">Determinando ano inicial...</p>
        </div>
      </div>
    )
  }

  const displaySelectedYearLabel =
    selectedYear === "all"
      ? `Visão Geral (Ano Mais Recente: ${currentYearStats.ano})`
      : selectedYear
        ? `Ano: ${selectedYear}`
        : "Nenhum ano selecionado"

  // O restante do JSX permanece o mesmo da resposta anterior
  // ... (copie o JSX de return (...) da resposta anterior aqui)
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            Hospitais do Brasil
          </h1>
          <p className="text-muted-foreground mt-1">Sistema Nacional de Saúde - {displaySelectedYearLabel}</p>
        </div>
        <Button onClick={loadHospitais} variant="outline" size="sm" disabled={isLoading || isProcessing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading || isProcessing ? "animate-spin" : ""}`} />
          {isLoading || isProcessing ? "Atualizando..." : "Atualizar Dados"}
        </Button>
      </div>

      {isProcessing && (
        <div className="flex items-center justify-center py-4 bg-muted/30 rounded-md">
          <Loader2 className="h-5 w-5 animate-spin text-blue-500 mr-2" />
          <p className="text-sm text-muted-foreground">Aplicando filtros e atualizando visualização...</p>
        </div>
      )}

      {!isLoading && hospitais.length === 0 && !error && (
        <Alert variant="default">
          <Info className="h-4 w-4" />
          <AlertDescription className="ml-2">
            Nenhum dado de hospital foi encontrado. Verifique a fonte de dados ou tente atualizar.
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && hospitais.length > 0 && availableYears.length === 0 && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2">
            {hospitais.length} hospitais carregados, mas nenhum dado histórico (ano/leitos) foi encontrado neles.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" disabled={isProcessing}>
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="yearly" disabled={isProcessing}>
            Evolução Anual
          </TabsTrigger>
          <TabsTrigger value="data" disabled={isProcessing}>
            Dados Detalhados
          </TabsTrigger>
          <TabsTrigger value="debug" disabled={isProcessing}>
            <Bug className="h-4 w-4 mr-1" /> Debug
          </TabsTrigger>
        </TabsList>

        <TabsContent value="debug" className="space-y-6">
          <SimpleDataTest />
          <DebugLeitos />
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                Total de Leitos Hospitalares ({currentYearStats.ano})
              </CardTitle>
              <Bed className="h-6 w-6 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {currentYearStats.totalLeitos.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">
                {currentYearStats.hospitaisComLeitos.toLocaleString()} hospitais com dados •{" "}
                {currentYearStats.leitosSUS.toLocaleString()} leitos SUS •{" "}
                {(currentYearStats.totalLeitos - currentYearStats.leitosSUS).toLocaleString()} leitos privados
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                (Considerando filtros atuais: {currentYearStats.total.toLocaleString()} hospitais)
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yearly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" /> Evolução Histórica de Leitos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum dado histórico para o gráfico.</p>
                  {availableYears.length > 0 && (
                    <p className="text-xs mt-1">Verifique os filtros ou os dados de origem.</p>
                  )}
                </div>
              ) : (
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="ano" />
                      <YAxis yAxisId="left" orientation="left" stroke="#f97316" />
                      <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          value.toLocaleString(),
                          name === "leitos"
                            ? "Total Leitos"
                            : name === "hospitais"
                              ? "Nº Hospitais"
                              : name.charAt(0).toUpperCase() + name.slice(1),
                        ]}
                        labelFormatter={(label) => `Ano ${label}`}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="leitos"
                        name="Total Leitos"
                        stroke="#f97316"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="hospitais"
                        name="Nº Hospitais"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" /> Estatísticas por Ano (Dados Globais)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {yearlyStats.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhuma estatística anual disponível.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {yearlyStats.map((stats) => (
                    <Card
                      key={stats.ano}
                      className={`border-2 hover:border-blue-400 transition-colors cursor-pointer ${selectedYear === stats.ano.toString() ? "border-blue-500 ring-2 ring-blue-300" : "border-border"}`}
                      onClick={() => setSelectedYear(stats.ano.toString())}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Calendar className="h-4 w-4" /> {stats.ano}
                          {selectedYear === stats.ano.toString() && <Badge className="ml-auto">Selecionado</Badge>}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">Leitos:</span>
                          <span className="font-bold text-orange-600">{stats.totalLeitos.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Hospitais:</span>
                          <span>
                            {stats.total.toLocaleString()} ({stats.hospitaisComLeitos} c/ leitos)
                          </span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>SUS:</span>
                          <span className="text-green-600">
                            {stats.publicos.toLocaleString()} ({stats.leitosSUS.toLocaleString()} leitos)
                          </span>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" /> Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div>
                  <label className="text-sm font-medium">Ano</label>
                  <Select
                    value={selectedYear || "all"}
                    onValueChange={(value) => setSelectedYear(value)}
                    disabled={isProcessing || availableYears.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o ano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Visão Geral (Mais Recente)</SelectItem>
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Buscar</label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Nome, UF..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                      disabled={isProcessing}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Estado (UF)</label>
                  <Select value={filterUF} onValueChange={setFilterUF} disabled={isProcessing}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {filterOptions.ufs.map((uf) => (
                        <SelectItem key={uf} value={uf}>
                          {uf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Vínculo</label>
                  <Select value={filterTipo} onValueChange={setFilterTipo} disabled={isProcessing}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="publico">SUS</SelectItem>
                      <SelectItem value="privado">Privado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Tipo Unidade</label>
                  <Select value={filterTipoUnidade} onValueChange={setFilterTipoUnidade} disabled={isProcessing}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Resultados ({filteredHospitais.length.toLocaleString()})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredHospitais.length === 0 && !isProcessing ? (
                <div className="text-center py-12">
                  <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum hospital encontrado</h3>
                  <p className="text-muted-foreground">
                    Tente ajustar os filtros ou verifique se há dados para o ano selecionado.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Hospital</TableHead>
                        <TableHead>Local (UF)</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-right">Leitos ({currentYearStats.ano})</TableHead>
                        <TableHead>Vínculo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHospitais.slice(0, 100).map((hospital) => {
                        const anoParaLeitos =
                          selectedYear === "all" || selectedYear === undefined
                            ? currentYearStats.ano
                            : Number.parseInt(selectedYear)
                        const leitos = getLeitos(hospital, anoParaLeitos)
                        const nome = getNome(hospital)
                        const detalhesLeitos = getLeitosDetalhes(hospital, anoParaLeitos)
                        return (
                          <TableRow key={hospital._id} className="hover:bg-muted/30">
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="truncate max-w-xs" title={nome}>
                                  {nome}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="text-sm">{hospital.uf || "N/A"}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {hospital.tipo_unidade && (
                                <Badge variant="outline" className="text-xs whitespace-nowrap">
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
                                    title={`Detalhes: ${Object.entries(detalhesLeitos)
                                      .map(([k, v]) => `${k.replace("_", " ")}: ${v}`)
                                      .join(" | ")}`}
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
                      Mostrando 100 de {filteredHospitais.length.toLocaleString()} resultados.
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
