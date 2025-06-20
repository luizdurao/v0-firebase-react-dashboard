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
import {
  Building2,
  MapPin,
  Bed,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  Info,
  Calendar,
  BarChart3,
  Loader2,
  ListChecks,
  Globe,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

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

interface YearlyStatSummary {
  // Renomeado de YearlyNationalStats para ser mais genérico
  ano: number
  total: number // total hospitais no conjunto (nacional ou estadual)
  publicos: number
  privados: number
  totalLeitos: number
  mediaLeitos: number
  hospitaisComLeitos: number
  leitosSUS: number
}

interface DetailedDataSummary {
  ano: number
  uf: string
  totalHospitaisFiltrados: number
  totalLeitosFiltrados: number
  hospitaisComLeitosFiltrados: number
  leitosSUSFiltrados: number
}

const DEFAULT_DETAILED_DATA_SUMMARY: DetailedDataSummary = {
  ano: new Date().getFullYear(),
  uf: "N/A",
  totalHospitaisFiltrados: 0,
  totalLeitosFiltrados: 0,
  hospitaisComLeitosFiltrados: 0,
  leitosSUSFiltrados: 0,
}

export default function HospitaisPageClient() {
  const [hospitais, setHospitais] = useState<Hospital[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterUF, setFilterUF] = useState<string>("all") // Este filtro agora é global para a página
  const [filterTipo, setFilterTipo] = useState<string>("all")
  const [filterTipoUnidade, setFilterTipoUnidade] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string | undefined>(undefined)
  const [activeTab, setActiveTab] = useState("data")

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

  const ufsOptions = useMemo(() => {
    return Array.from(new Set(hospitais.map((h) => h.uf).filter(Boolean))).sort()
  }, [hospitais])

  useEffect(() => {
    if (!isLoading && hospitais.length > 0) {
      setIsProcessing(true)
      const years = getAllYears(hospitais)
      if (selectedYear === undefined) {
        if (years.length > 0) {
          setSelectedYear(years.includes(2024) ? "2024" : years[0].toString())
        } else {
          setSelectedYear("all")
        }
      }
      setIsProcessing(false)
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

  const {
    filteredHospitais, // Para a tabela em "Dados por Estado"
    evolutionTabYearlyStats, // Para os cards na aba "Evolução Anual"
    detailedDataSummary, // Para o resumo em "Dados por Estado"
    filterOptions,
    availableYears,
    evolutionTabChartData, // Para o gráfico na aba "Evolução Anual"
  } = useMemo(() => {
    if (selectedYear === undefined && hospitais.length > 0) {
      // Aguardando selectedYear ser definido
      return {
        filteredHospitais: [],
        evolutionTabYearlyStats: [],
        detailedDataSummary: DEFAULT_DETAILED_DATA_SUMMARY,
        filterOptions: { ufs: ufsOptions, tiposUnidade: [] },
        availableYears: [],
        evolutionTabChartData: [],
      }
    }
    setIsProcessing(true)

    const years = getAllYears(hospitais)
    const tiposUnidadeOptions = Array.from(new Set(hospitais.map((h) => h.tipo_unidade).filter(Boolean))).sort()

    // --- Cálculos para a aba "Dados por Estado" ---
    let yearForDetailedFiltering: number
    if (selectedYear === "all" || selectedYear === undefined) {
      yearForDetailedFiltering = years.length > 0 ? (years.includes(2024) ? 2024 : years[0]) : new Date().getFullYear()
    } else {
      yearForDetailedFiltering = Number.parseInt(selectedYear, 10)
    }

    let hospitaisForDetailedView = hospitais
    if (filterUF !== "all") {
      hospitaisForDetailedView = hospitaisForDetailedView.filter((h) => h.uf === filterUF)
    } else {
      hospitaisForDetailedView = [] // Não mostrar nada na tabela se nenhum UF específico for selecionado
    }

    const hospitaisFiltradosPorUFeAno = hospitaisForDetailedView.filter((h) =>
      hasDataForYear(h, yearForDetailedFiltering),
    )

    let processedFilteredHospitais = hospitaisFiltradosPorUFeAno
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      processedFilteredHospitais = processedFilteredHospitais.filter((h) => getNome(h).toLowerCase().includes(search))
    }
    if (filterTipo !== "all") {
      processedFilteredHospitais = processedFilteredHospitais.filter((h) =>
        filterTipo === "publico" ? h.vinculo_sus === "SUS" : h.vinculo_sus !== "SUS",
      )
    }
    if (filterTipoUnidade !== "all") {
      processedFilteredHospitais = processedFilteredHospitais.filter((h) => h.tipo_unidade === filterTipoUnidade)
    }

    let calculatedDetailedDataSummary = DEFAULT_DETAILED_DATA_SUMMARY
    if (filterUF !== "all") {
      const totalLeitos = processedFilteredHospitais.reduce((sum, h) => sum + getLeitos(h, yearForDetailedFiltering), 0)
      const leitosSUS = processedFilteredHospitais
        .filter((h) => h.vinculo_sus === "SUS")
        .reduce((sum, h) => sum + getLeitos(h, yearForDetailedFiltering), 0)
      const hospitaisComLeitos = processedFilteredHospitais.filter(
        (h) => getLeitos(h, yearForDetailedFiltering) > 0,
      ).length

      calculatedDetailedDataSummary = {
        ano: yearForDetailedFiltering,
        uf: filterUF,
        totalHospitaisFiltrados: processedFilteredHospitais.length,
        totalLeitosFiltrados: totalLeitos,
        hospitaisComLeitosFiltrados: hospitaisComLeitos,
        leitosSUSFiltrados: leitosSUS,
      }
    }

    // --- Cálculos para a aba "Evolução Anual" (Nacional ou Estadual) ---
    const hospitalsForEvolutionSource = filterUF === "all" ? hospitais : hospitais.filter((h) => h.uf === filterUF)

    const calculatedEvolutionTabYearlyStats: YearlyStatSummary[] = years.map((ano) => {
      const yearData = hospitalsForEvolutionSource.filter((h) => hasDataForYear(h, ano))
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

    const calculatedEvolutionTabChartData = calculatedEvolutionTabYearlyStats
      .sort((a, b) => a.ano - b.ano)
      .map((s) => ({
        ano: s.ano.toString(),
        leitos: s.totalLeitos,
        hospitais: s.total,
      }))

    setTimeout(() => setIsProcessing(false), 0)

    return {
      filteredHospitais: processedFilteredHospitais,
      evolutionTabYearlyStats: calculatedEvolutionTabYearlyStats,
      detailedDataSummary: calculatedDetailedDataSummary,
      filterOptions: { ufs: ufsOptions, tiposUnidade: tiposUnidadeOptions },
      availableYears: years,
      evolutionTabChartData: calculatedEvolutionTabChartData,
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
    ufsOptions,
  ])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="ml-4 text-lg font-medium">Carregando dados...</p>
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
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="ml-4 text-lg font-medium">Determinando ano inicial...</p>
      </div>
    )
  }

  const displaySelectedYearLabel =
    selectedYear === "all"
      ? `(Ano Mais Recente: ${detailedDataSummary.ano})`
      : selectedYear
        ? `(Ano: ${selectedYear})`
        : "(Nenhum ano selecionado)"

  const anoParaTabela =
    selectedYear === "all" || selectedYear === undefined ? detailedDataSummary.ano : Number.parseInt(selectedYear)

  const evolutionTitle = filterUF === "all" ? "Evolução Nacional de Leitos" : `Evolução de Leitos em ${filterUF}`
  const evolutionStatsTitle =
    filterUF === "all" ? "Estatísticas Nacionais por Ano" : `Estatísticas por Ano em ${filterUF}`

  return (
    <div className="space-y-6 h-full flex flex-col">
      {isProcessing && (
        <div className="flex items-center justify-center py-4 bg-muted/30 rounded-md">
          <Loader2 className="h-5 w-5 animate-spin text-blue-500 mr-2" />
          <p className="text-sm text-muted-foreground">Aplicando filtros e atualizando visualização...</p>
        </div>
      )}

      {!isLoading && hospitais.length === 0 && !error && (
        <Alert variant="default" className="mt-4">
          <Info className="h-4 w-4" />
          <AlertDescription className="ml-2">Nenhum dado de hospital foi encontrado.</AlertDescription>
        </Alert>
      )}
      {!isLoading && hospitais.length > 0 && availableYears.length === 0 && (
        <Alert variant="warning" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2">
            {hospitais.length} hospitais carregados, mas nenhum dado histórico (ano/leitos) foi encontrado.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="data" disabled={isProcessing}>
            Dados por Estado
          </TabsTrigger>
          <TabsTrigger value="yearly" disabled={isProcessing}>
            Evolução Anual {filterUF !== "all" ? `(${filterUF})` : "(Nacional)"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="space-y-6 flex-grow mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Filter className="h-5 w-5" /> Filtros Globais
              </CardTitle>
              <p className="text-sm text-muted-foreground">Estes filtros afetam ambas as abas.</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label htmlFor="select-uf-global" className="text-sm font-medium">
                    Estado (UF)
                  </label>
                  <Select
                    value={filterUF}
                    onValueChange={setFilterUF}
                    disabled={isProcessing || ufsOptions.length === 0}
                  >
                    <SelectTrigger id="select-uf-global">
                      <SelectValue placeholder="Nacional / Selecione UF" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Brasil (Nacional)</SelectItem>
                      {filterOptions.ufs.map((uf) => (
                        <SelectItem key={uf} value={uf}>
                          {uf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="select-year-global" className="text-sm font-medium">
                    Ano de Referência (para Dados Detalhados e Destaque)
                  </label>
                  <Select
                    value={selectedYear || "all"}
                    onValueChange={(value) => setSelectedYear(value)}
                    disabled={isProcessing || availableYears.length === 0}
                  >
                    <SelectTrigger id="select-year-global">
                      <SelectValue placeholder="Selecione o ano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Mais Recente ({detailedDataSummary.ano})</SelectItem>
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-medium mb-2">Filtros Adicionais para Tabela de Hospitais:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <div>
                    <label htmlFor="search-data" className="text-sm font-medium">
                      Buscar por Nome
                    </label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search-data"
                        placeholder="Nome do hospital..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                        disabled={isProcessing || filterUF === "all"}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="select-vinculo-data" className="text-sm font-medium">
                      Vínculo
                    </label>
                    <Select
                      value={filterTipo}
                      onValueChange={setFilterTipo}
                      disabled={isProcessing || filterUF === "all"}
                    >
                      <SelectTrigger id="select-vinculo-data">
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
                    <label htmlFor="select-tipo-unidade-data" className="text-sm font-medium">
                      Tipo Unidade
                    </label>
                    <Select
                      value={filterTipoUnidade}
                      onValueChange={setFilterTipoUnidade}
                      disabled={isProcessing || filterUF === "all"}
                    >
                      <SelectTrigger id="select-tipo-unidade-data">
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
              </div>
            </CardContent>
          </Card>

          {filterUF !== "all" && (
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-md font-medium">
                  Resumo para {detailedDataSummary.uf} (Ano: {detailedDataSummary.ano})
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm pb-4">
                <p>
                  <span className="font-semibold">{detailedDataSummary.totalLeitosFiltrados.toLocaleString()}</span>{" "}
                  leitos em{" "}
                  <span className="font-semibold">
                    {detailedDataSummary.hospitaisComLeitosFiltrados.toLocaleString()}
                  </span>{" "}
                  de{" "}
                  <span className="font-semibold">{detailedDataSummary.totalHospitaisFiltrados.toLocaleString()}</span>{" "}
                  hospitais listados.
                </p>
                <p>
                  Leitos SUS:{" "}
                  <span className="font-semibold">{detailedDataSummary.leitosSUSFiltrados.toLocaleString()}</span>
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="flex-grow flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-xl">
                <div className="flex items-center gap-2">
                  <ListChecks />
                  <span>
                    Hospitais em {filterUF !== "all" ? filterUF : "..."} ({filteredHospitais.length.toLocaleString()})
                  </span>
                </div>
                {filterUF !== "all" && <span className="text-sm text-muted-foreground">Ano: {anoParaTabela}</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto">
              {filterUF === "all" ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-lg font-medium">Selecione um Estado (UF) acima para listar os hospitais.</p>
                </div>
              ) : filteredHospitais.length === 0 && !isProcessing ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Building2 className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-lg font-medium">
                    Nenhum hospital encontrado para os filtros selecionados em {filterUF} no ano {anoParaTabela}.
                  </p>
                  <p className="text-sm">Tente ajustar os filtros ou o ano.</p>
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Hospital</TableHead>
                        <TableHead>Tipo Unidade</TableHead>
                        <TableHead className="text-right">Leitos ({anoParaTabela})</TableHead>
                        <TableHead>Vínculo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHospitais.slice(0, 100).map((hospital) => {
                        const leitos = getLeitos(hospital, anoParaTabela)
                        const nome = getNome(hospital)
                        const detalhesLeitos = getLeitosDetalhes(hospital, anoParaTabela)
                        return (
                          <TableRow key={hospital._id} className="hover:bg-muted/30">
                            <TableCell className="font-medium">
                              <span className="truncate max-w-xs block" title={nome}>
                                {nome}
                              </span>
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

        <TabsContent value="yearly" className="space-y-6 flex-grow mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                {filterUF === "all" ? <Globe className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
                {evolutionTitle}
              </CardTitle>
              {filterUF === "all" && <p className="text-sm text-muted-foreground">Visão geral de todos os estados.</p>}
              {filterUF !== "all" && (
                <p className="text-sm text-muted-foreground">Dados específicos para {filterUF}.</p>
              )}
            </CardHeader>
            <CardContent>
              {evolutionTabChartData.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Nenhum dado histórico para o gráfico {filterUF !== "all" ? `em ${filterUF}` : "nacional"}.
                  </p>
                  {filterUF === "all" && availableYears.length === 0 && (
                    <p className="text-xs mt-1">Verifique se há dados de hospitais carregados.</p>
                  )}
                  {filterUF !== "all" && (
                    <p className="text-xs mt-1">
                      Este estado pode não ter dados históricos ou não corresponder aos filtros.
                    </p>
                  )}
                </div>
              ) : (
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={evolutionTabChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="ano" />
                      <YAxis yAxisId="left" orientation="left" stroke="#f97316" />
                      <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          value.toLocaleString(),
                          name === "leitos" ? "Total Leitos" : name === "hospitais" ? "Nº Hospitais" : name,
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
              <CardTitle className="flex items-center gap-2 text-xl">
                <BarChart3 className="h-5 w-5" /> {evolutionStatsTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {evolutionTabYearlyStats.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Nenhuma estatística anual disponível {filterUF !== "all" ? `para ${filterUF}` : "em nível nacional"}
                    .
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {evolutionTabYearlyStats.map((stats) => (
                    <Card
                      key={stats.ano}
                      className={`border-2 hover:border-blue-400 transition-colors cursor-pointer ${selectedYear === stats.ano.toString() ? "border-blue-500 ring-2 ring-blue-300" : "border-border"}`}
                      onClick={() => {
                        setSelectedYear(stats.ano.toString())
                        // Opcional: mudar para a aba "Dados por Estado" ao clicar aqui, se fizer sentido para o fluxo.
                        // setActiveTab("data");
                      }}
                    >
                      <CardHeader className="pb-2 pt-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Calendar className="h-4 w-4" /> {stats.ano}{" "}
                          {selectedYear === stats.ano.toString() && (
                            <Badge className="ml-auto">Ano de Referência</Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1 text-sm pb-4">
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
      </Tabs>
    </div>
  )
}
