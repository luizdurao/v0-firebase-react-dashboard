"use client"

import { useCallback, useEffect, useState, useMemo } from "react"
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
  municipio?: string // Mantido na interface, mas não usado ativamente na UI para filtros/exibição principal
  uf: string
  dependencia?: string
  tipo_unidade: string
  vinculo_sus: string
  historico: HistoricoItem[]
  [key: string]: any
}

interface YearlyStatSummary {
  ano: number
  totalHospitais: number
  totalLeitos: number
  hospitaisComLeitos: number
  leitosSUS: number
  hospitaisSUS: number
}

interface UFYearSummary {
  totalHospitais: number
  totalLeitos: number
  hospitaisComLeitos: number
  leitosSUS: number
  hospitaisSUS: number
}

export default function HospitaisPageClient() {
  const [hospitais, setHospitais] = useState<Hospital[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [filterUF, setFilterUF] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string | undefined>(undefined)

  const [searchTerm, setSearchTerm] = useState("")
  const [filterVinculoSUS, setFilterVinculoSUS] = useState<string>("all")
  const [filterTipoUnidade, setFilterTipoUnidade] = useState<string>("all")

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
      const data: Hospital[] = await response.json()
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

  const getAllAvailableYears = useCallback((data: Hospital[]): number[] => {
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

  const ufsList = useMemo(() => {
    return Array.from(new Set(hospitais.map((h) => h.uf).filter(Boolean))).sort()
  }, [hospitais])

  const tiposUnidadeList = useMemo(() => {
    return Array.from(new Set(hospitais.map((h) => h.tipo_unidade).filter(Boolean))).sort()
  }, [hospitais])

  const availableYears = useMemo(() => getAllAvailableYears(hospitais), [hospitais, getAllAvailableYears])

  useEffect(() => {
    if (!isLoading && hospitais.length > 0 && selectedYear === undefined) {
      if (availableYears.length > 0) {
        setSelectedYear(availableYears.includes(2024) ? "2024" : availableYears[0].toString())
      } else {
        setSelectedYear("all")
      }
    }
  }, [isLoading, hospitais, selectedYear, availableYears])

  const getLeitosNoAno = useCallback((hospital: Hospital, ano: number): number | null => {
    if (!hospital.historico) return null
    const dataAno = hospital.historico.find((h) => h.ano === ano)
    return dataAno?.leitos?.total ?? null
  }, [])

  const getLeitosDetalhesNoAno = useCallback((hospital: Hospital, ano: number): HistoricoItem["leitos"] | null => {
    if (!hospital.historico) return null
    const dataAno = hospital.historico.find((h) => h.ano === ano)
    return dataAno?.leitos ?? null
  }, [])

  const { hospitaisParaTabela, resumoUFSelecionado, statsEvolucaoAnual, chartDataEvolucao } = useMemo(() => {
    setIsProcessing(true)
    let anoReferencia: number | null = null
    if (selectedYear && selectedYear !== "all") {
      anoReferencia = Number.parseInt(selectedYear, 10)
    } else if (availableYears.length > 0) {
      anoReferencia = availableYears.includes(2024) ? 2024 : availableYears[0]
    }

    let baseHospitaisUF = hospitais
    if (filterUF !== "all") {
      baseHospitaisUF = hospitais.filter((h) => h.uf === filterUF)
    }

    let hospitaisFiltradosParaTabela = baseHospitaisUF
    if (anoReferencia !== null) {
      hospitaisFiltradosParaTabela = hospitaisFiltradosParaTabela.filter(
        (h) => getLeitosNoAno(h, anoReferencia as number) !== null,
      )
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      // Removida a busca por município aqui
      hospitaisFiltradosParaTabela = hospitaisFiltradosParaTabela.filter((h) => h.nome.toLowerCase().includes(search))
    }
    if (filterVinculoSUS !== "all") {
      hospitaisFiltradosParaTabela = hospitaisFiltradosParaTabela.filter((h) =>
        filterVinculoSUS === "SUS" ? h.vinculo_sus === "SUS" : h.vinculo_sus !== "SUS",
      )
    }
    if (filterTipoUnidade !== "all") {
      hospitaisFiltradosParaTabela = hospitaisFiltradosParaTabela.filter((h) => h.tipo_unidade === filterTipoUnidade)
    }

    const currentUFYearSummary: UFYearSummary = {
      totalHospitais: 0,
      totalLeitos: 0,
      hospitaisComLeitos: 0,
      leitosSUS: 0,
      hospitaisSUS: 0,
    }
    if (filterUF !== "all" && anoReferencia !== null) {
      const hospitaisParaResumo = hospitaisFiltradosParaTabela

      currentUFYearSummary.totalHospitais = hospitaisParaResumo.length
      hospitaisParaResumo.forEach((h) => {
        const leitos = getLeitosNoAno(h, anoReferencia as number)
        if (leitos !== null) {
          currentUFYearSummary.totalLeitos += leitos
          currentUFYearSummary.hospitaisComLeitos += 1
          if (h.vinculo_sus === "SUS") {
            currentUFYearSummary.leitosSUS += leitos
          }
        }
        if (h.vinculo_sus === "SUS") {
          currentUFYearSummary.hospitaisSUS += 1
        }
      })
    }

    const calculatedStatsEvolucao: YearlyStatSummary[] = availableYears.map((ano) => {
      let totalLeitosAno = 0
      let hospitaisComLeitosAno = 0
      let leitosSUSAno = 0
      let hospitaisSUSAno = 0
      const hospitaisNoAno = baseHospitaisUF.filter((h) => getLeitosNoAno(h, ano) !== null)

      hospitaisNoAno.forEach((h) => {
        const leitos = getLeitosNoAno(h, ano) as number
        totalLeitosAno += leitos
        hospitaisComLeitosAno += 1
        if (h.vinculo_sus === "SUS") {
          leitosSUSAno += leitos
          hospitaisSUSAno += 1
        }
      })
      return {
        ano,
        totalHospitais: hospitaisNoAno.length,
        totalLeitos: totalLeitosAno,
        hospitaisComLeitos: hospitaisComLeitosAno,
        leitosSUS: leitosSUSAno,
        hospitaisSUS: hospitaisSUSAno,
      }
    })

    const calculatedChartDataEvolucao = calculatedStatsEvolucao
      .sort((a, b) => a.ano - b.ano)
      .map((s) => ({
        ano: s.ano.toString(),
        leitos: s.totalLeitos,
        hospitais: s.totalHospitais,
      }))

    setTimeout(() => setIsProcessing(false), 300)

    return {
      hospitaisParaTabela: hospitaisFiltradosParaTabela,
      resumoUFSelecionado: currentUFYearSummary,
      statsEvolucaoAnual: calculatedStatsEvolucao,
      chartDataEvolucao: calculatedChartDataEvolucao,
    }
  }, [
    hospitais,
    filterUF,
    selectedYear,
    searchTerm,
    filterVinculoSUS,
    filterTipoUnidade,
    availableYears,
    getLeitosNoAno,
  ])

  const anoAtualParaExibicao = useMemo(() => {
    if (selectedYear && selectedYear !== "all") return Number.parseInt(selectedYear, 10)
    if (availableYears.length > 0) return availableYears.includes(2024) ? 2024 : availableYears[0]
    return new Date().getFullYear()
  }, [selectedYear, availableYears])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)] p-6">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="ml-4 text-lg font-medium">Carregando dados...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
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
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)] p-6">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="ml-4 text-lg font-medium">Determinando ano de referência...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            Painel de Hospitais
          </h1>
          <p className="text-muted-foreground mt-1">
            Análise de leitos por Estado e Ano ({filterUF === "all" ? "Brasil" : filterUF}
            {selectedYear && selectedYear !== "all" ? `, ${selectedYear}` : ", Ano Mais Recente"})
          </p>
        </div>
        <Button onClick={loadHospitais} variant="outline" disabled={isLoading || isProcessing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading || isProcessing ? "animate-spin" : ""}`} />
          Atualizar Dados
        </Button>
      </div>

      {isProcessing && (
        <div className="flex items-center justify-center py-3 bg-muted/50 rounded-md border border-dashed">
          <Loader2 className="h-5 w-5 animate-spin text-blue-500 mr-2" />
          <p className="text-sm text-muted-foreground">Processando filtros e atualizando visualizações...</p>
        </div>
      )}

      {!isLoading && hospitais.length === 0 && !error && (
        <Alert variant="default" className="mt-4">
          <Info className="h-4 w-4" />
          <AlertDescription className="ml-2">
            Nenhum dado de hospital foi encontrado na base. Verifique a fonte de dados.
          </AlertDescription>
        </Alert>
      )}
      {!isLoading && hospitais.length > 0 && availableYears.length === 0 && (
        <Alert variant="warning" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2">
            {hospitais.length} hospitais carregados, mas nenhum dado histórico (ano/leitos) foi encontrado para popular
            os filtros de ano.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="data" disabled={isProcessing}>
            Dados Detalhados por Estado
          </TabsTrigger>
          <TabsTrigger value="yearly" disabled={isProcessing}>
            Evolução Anual {filterUF !== "all" ? `(${filterUF})` : "(Nacional)"}
          </TabsTrigger>
        </TabsList>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Filter className="h-5 w-5" /> Filtros Principais
            </CardTitle>
            <p className="text-sm text-muted-foreground">Selecione o Estado (UF) e o Ano de referência.</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label htmlFor="select-uf-main" className="text-sm font-medium">
                  Estado (UF)
                </label>
                <Select value={filterUF} onValueChange={setFilterUF} disabled={isProcessing || ufsList.length === 0}>
                  <SelectTrigger id="select-uf-main">
                    <SelectValue placeholder="Brasil (Todos os Estados)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Brasil (Todos os Estados)</SelectItem>
                    {ufsList.map((uf) => (
                      <SelectItem key={uf} value={uf}>
                        {uf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="select-year-main" className="text-sm font-medium">
                  Ano de Referência
                </label>
                <Select
                  value={selectedYear || "all"}
                  onValueChange={(value) => setSelectedYear(value)}
                  disabled={isProcessing || availableYears.length === 0}
                >
                  <SelectTrigger id="select-year-main">
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      Mais Recente (
                      {availableYears.length > 0 ? (availableYears.includes(2024) ? 2024 : availableYears[0]) : "N/A"})
                    </SelectItem>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <TabsContent value="data" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Search className="h-5 w-5" /> Filtros Adicionais para Tabela
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label htmlFor="search-table" className="text-sm font-medium">
                    Buscar por Nome
                  </label>
                  <Input
                    id="search-table"
                    placeholder="Digite o nome do hospital..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isProcessing || filterUF === "all"}
                  />
                </div>
                <div>
                  <label htmlFor="select-vinculo-table" className="text-sm font-medium">
                    Vínculo SUS
                  </label>
                  <Select
                    value={filterVinculoSUS}
                    onValueChange={setFilterVinculoSUS}
                    disabled={isProcessing || filterUF === "all"}
                  >
                    <SelectTrigger id="select-vinculo-table">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="SUS">SUS</SelectItem>
                      <SelectItem value="NaoSUS">Não SUS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="select-tipo-unidade-table" className="text-sm font-medium">
                    Tipo de Unidade
                  </label>
                  <Select
                    value={filterTipoUnidade}
                    onValueChange={setFilterTipoUnidade}
                    disabled={isProcessing || filterUF === "all" || tiposUnidadeList.length === 0}
                  >
                    <SelectTrigger id="select-tipo-unidade-table">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {tiposUnidadeList.map((tipo) => (
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

          {filterUF !== "all" && (
            <Card className="border-l-4 border-blue-600">
              <CardHeader className="pb-3 pt-4">
                <CardTitle className="text-md font-medium">
                  Resumo para {filterUF} - Ano: {anoAtualParaExibicao}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm pb-4 grid grid-cols-2 gap-x-4 gap-y-1">
                <p>
                  Hospitais Listados:{" "}
                  <span className="font-semibold">{resumoUFSelecionado.totalHospitais.toLocaleString()}</span>
                </p>
                <p>
                  Total de Leitos:{" "}
                  <span className="font-semibold">{resumoUFSelecionado.totalLeitos.toLocaleString()}</span>
                </p>
                <p>
                  Hospitais (SUS):{" "}
                  <span className="font-semibold">{resumoUFSelecionado.hospitaisSUS.toLocaleString()}</span>
                </p>
                <p>
                  Leitos (SUS): <span className="font-semibold">{resumoUFSelecionado.leitosSUS.toLocaleString()}</span>
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
                    Hospitais em {filterUF !== "all" ? filterUF : "..."} ({hospitaisParaTabela.length.toLocaleString()})
                  </span>
                </div>
                {filterUF !== "all" && (
                  <span className="text-sm text-muted-foreground">Ano: {anoAtualParaExibicao}</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto">
              {filterUF === "all" ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-lg font-medium">Selecione um Estado (UF) para listar os hospitais.</p>
                </div>
              ) : hospitaisParaTabela.length === 0 && !isProcessing ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Building2 className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-lg font-medium">
                    Nenhum hospital encontrado para os filtros selecionados em {filterUF} no ano {anoAtualParaExibicao}.
                  </p>
                  <p className="text-sm">Tente ajustar os filtros ou o ano.</p>
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Hospital</TableHead>
                        {/* Removida a coluna Município */}
                        <TableHead>Tipo Unidade</TableHead>
                        <TableHead className="text-right">Leitos ({anoAtualParaExibicao})</TableHead>
                        <TableHead>Vínculo SUS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {hospitaisParaTabela.slice(0, 100).map((hospital) => {
                        const leitos = getLeitosNoAno(hospital, anoAtualParaExibicao)
                        const detalhesLeitos = getLeitosDetalhesNoAno(hospital, anoAtualParaExibicao)
                        const nome = hospital.nome || `Hospital ${hospital._id}`

                        let tooltipDetalhesLeitos = "Detalhes não disponíveis"
                        if (detalhesLeitos) {
                          tooltipDetalhesLeitos = Object.entries(detalhesLeitos)
                            .map(
                              ([key, value]) =>
                                `${key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}: ${value}`,
                            )
                            .join(" | ")
                        }

                        return (
                          <TableRow key={hospital.id || hospital._id} className="hover:bg-muted/30">
                            <TableCell className="font-medium">
                              <span className="truncate max-w-xs block" title={nome}>
                                {nome}
                              </span>
                            </TableCell>
                            {/* Removida a célula do Município */}
                            <TableCell>
                              {hospital.tipo_unidade && (
                                <Badge variant="outline" className="text-xs whitespace-nowrap">
                                  {hospital.tipo_unidade}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {leitos !== null && leitos > 0 ? (
                                <div className="flex items-center justify-end gap-1">
                                  <Bed className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium" title={tooltipDetalhesLeitos}>
                                    {leitos.toLocaleString()}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">N/A</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={hospital.vinculo_sus === "SUS" ? "default" : "secondary"}>
                                {hospital.vinculo_sus === "SUS" ? "SUS" : "Não SUS"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                  {hospitaisParaTabela.length > 100 && (
                    <div className="p-4 text-center text-sm text-muted-foreground bg-muted/30 border-t">
                      Mostrando os primeiros 100 de {hospitaisParaTabela.length.toLocaleString()} resultados.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yearly" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                {filterUF === "all" ? <Globe className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
                Evolução de Leitos e Hospitais {filterUF !== "all" ? `em ${filterUF}` : "(Nacional)"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chartDataEvolucao.length === 0 && !isProcessing ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4" />
                  <p>Nenhum dado histórico para o gráfico {filterUF !== "all" ? `em ${filterUF}` : "nacional"}.</p>
                </div>
              ) : (
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartDataEvolucao} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="ano" />
                      <YAxis yAxisId="left" orientation="left" stroke="#f97316" name="Leitos" />
                      <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" name="Hospitais" />
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
                <BarChart3 className="h-5 w-5" />
                Estatísticas Anuais {filterUF !== "all" ? `em ${filterUF}` : "(Nacional)"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsEvolucaoAnual.length === 0 && !isProcessing ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4" />
                  <p>Nenhuma estatística anual disponível.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {statsEvolucaoAnual.map((stats) => (
                    <Card
                      key={stats.ano}
                      className={`border-2 hover:border-blue-400 transition-colors cursor-pointer ${selectedYear === stats.ano.toString() ? "border-blue-500 ring-2 ring-blue-300" : "border-border"}`}
                      onClick={() => setSelectedYear(stats.ano.toString())}
                    >
                      <CardHeader className="pb-2 pt-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Calendar className="h-4 w-4" /> {stats.ano}
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
                            {stats.totalHospitais.toLocaleString()} ({stats.hospitaisComLeitos} c/ leitos)
                          </span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>SUS:</span>
                          <span className="text-green-600">
                            {stats.hospitaisSUS.toLocaleString()} hosp. ({stats.leitosSUS.toLocaleString()} leitos)
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
