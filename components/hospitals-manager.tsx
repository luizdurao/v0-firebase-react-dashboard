"use client"

import { useEffect, useState } from "react"
import { Loader2, Search, Building2, MapPin, Bed, Activity } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { loadRealHospitalData, getAllStates } from "@/lib/real-data-processor"

export default function HospitalsManager() {
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [allStates, setAllStates] = useState<any[]>([])
  const [filteredStates, setFilteredStates] = useState<any[]>([])
  const [hospitalData, setHospitalData] = useState<Record<string, any>>({})
  const [viewMode, setViewMode] = useState<"cards" | "table">("table")

  const regions = [
    { id: "all", name: "Todas as Regiões" },
    { id: "Norte", name: "Norte" },
    { id: "Nordeste", name: "Nordeste" },
    { id: "Centro-Oeste", name: "Centro-Oeste" },
    { id: "Sudeste", name: "Sudeste" },
    { id: "Sul", name: "Sul" },
  ]

  const fetchData = async () => {
    setLoading(true)
    try {
      const realData = await loadRealHospitalData()
      const states = getAllStates()

      setAllStates(states)
      setHospitalData(realData)
      setFilteredStates(states)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar estados baseado na região e termo de busca
  useEffect(() => {
    let filtered = allStates

    // Filtro por região
    if (selectedRegion !== "all") {
      filtered = filtered.filter((state) => state.region === selectedRegion)
    }

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter((state) => state.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    setFilteredStates(filtered)
  }, [allStates, selectedRegion, searchTerm])

  useEffect(() => {
    fetchData()
  }, [])

  // Calcular estatísticas dos estados filtrados
  const filteredStats = filteredStates.reduce(
    (acc, state) => {
      const stateData = hospitalData[state.id]
      if (stateData) {
        acc.totalHospitals += stateData.Hospitais_Privados_2024
        acc.totalBeds += stateData.Leitos_Privados_2024
        acc.totalStates += 1
      }
      return acc
    },
    { totalHospitals: 0, totalBeds: 0, totalStates: 0 },
  )

  const getRegionColor = (region: string) => {
    const colors = {
      Norte: "bg-green-500",
      Nordeste: "bg-yellow-500",
      "Centro-Oeste": "bg-orange-500",
      Sudeste: "bg-blue-500",
      Sul: "bg-purple-500",
    }
    return colors[region] || "bg-gray-500"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hospitais por Estado</h1>
          <p className="text-muted-foreground">Análise detalhada dos hospitais privados brasileiros - Dados de 2024</p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading}>
          <Loader2 className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      {/* Estatísticas Resumo */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estados Selecionados</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredStats.totalStates}</div>
            <p className="text-xs text-muted-foreground">
              {selectedRegion === "all" ? "de 27 estados" : `na região ${selectedRegion}`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Hospitais</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredStats.totalHospitals.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">hospitais privados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leitos</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredStats.totalBeds.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">leitos disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média por Estado</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredStats.totalStates > 0 ? Math.round(filteredStats.totalHospitals / filteredStats.totalStates) : 0}
            </div>
            <p className="text-xs text-muted-foreground">hospitais por estado</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre os dados por região ou busque por estado específico</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="search">Buscar Estado</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Digite o nome do estado..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="region-filter">Filtrar por Região</Label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger id="region-filter">
                  <SelectValue placeholder="Selecione uma região" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="view-mode">Modo de Visualização</Label>
              <Select value={viewMode} onValueChange={(value: "cards" | "table") => setViewMode(value)}>
                <SelectTrigger id="view-mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="table">Tabela</SelectItem>
                  <SelectItem value="cards">Cards</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dados dos Estados */}
      <Card>
        <CardHeader>
          <CardTitle>Estados Brasileiros</CardTitle>
          <CardDescription>
            {filteredStates.length} estado{filteredStates.length !== 1 ? "s" : ""} encontrado
            {filteredStates.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-[400px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : viewMode === "table" ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estado</TableHead>
                  <TableHead>Região</TableHead>
                  <TableHead className="text-right">Hospitais</TableHead>
                  <TableHead className="text-right">Leitos</TableHead>
                  <TableHead className="text-right">Leitos/1000 hab</TableHead>
                  <TableHead className="text-right">Capital (%)</TableHead>
                  <TableHead className="text-right">SUS (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStates.map((state) => {
                  const stateHospitalData = hospitalData[state.id]
                  if (!stateHospitalData) return null

                  return (
                    <TableRow key={state.id}>
                      <TableCell className="font-medium">{state.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getRegionColor(state.region)}`}></div>
                          {state.region}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {stateHospitalData.Hospitais_Privados_2024}
                      </TableCell>
                      <TableCell className="text-right">
                        {stateHospitalData.Leitos_Privados_2024.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">{stateHospitalData.Leitos_por_1000_hab.toFixed(1)}</TableCell>
                      <TableCell className="text-right">
                        {stateHospitalData.Distribuicao_Localizacao.Capital.toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={stateHospitalData.Tipo_Atendimento.SUS >= 50 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {stateHospitalData.Tipo_Atendimento.SUS.toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredStates.map((state) => {
                const stateHospitalData = hospitalData[state.id]
                if (!stateHospitalData) return null

                return (
                  <Card key={state.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{state.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getRegionColor(state.region)}`}></div>
                          <span className="text-sm text-muted-foreground">{state.region}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {stateHospitalData.Hospitais_Privados_2024}
                          </div>
                          <div className="text-xs text-muted-foreground">Hospitais</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {stateHospitalData.Leitos_Privados_2024.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">Leitos</div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Capital:</span>
                          <span className="font-medium">
                            {stateHospitalData.Distribuicao_Localizacao.Capital.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>SUS:</span>
                          <Badge
                            variant={stateHospitalData.Tipo_Atendimento.SUS >= 50 ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {stateHospitalData.Tipo_Atendimento.SUS.toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Leitos/1000 hab:</span>
                          <span className="font-medium">{stateHospitalData.Leitos_por_1000_hab.toFixed(1)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {filteredStates.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum estado encontrado</h3>
              <p className="text-muted-foreground text-center">
                Tente ajustar os filtros ou termo de busca para encontrar os estados desejados.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
