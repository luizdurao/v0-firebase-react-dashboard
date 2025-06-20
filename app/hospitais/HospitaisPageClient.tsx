"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building2, MapPin, Bed, Search, Filter, RefreshCw, AlertCircle, Activity, Phone } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Hospital {
  id: string
  nome: string
  endereco?: string
  cidade?: string
  estado?: string
  regiao?: string
  tipo?: string
  tipo_unidade?: string
  vinculo_sus?: string
  leitos?: number
  telefone?: string
  status?: string
  [key: string]: any
}

export default function HospitaisPageClient() {
  const [hospitais, setHospitais] = useState<Hospital[]>([])
  const [filteredHospitais, setFilteredHospitais] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRegiao, setFilterRegiao] = useState<string>("all")
  const [filterTipo, setFilterTipo] = useState<string>("all")
  const [filterTipoUnidade, setFilterTipoUnidade] = useState<string>("all")
  const [stats, setStats] = useState({
    total: 0,
    publicos: 0,
    privados: 0,
    totalLeitos: 0,
  })

  const loadHospitais = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/hospitais")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()

      if (!data || data.length === 0) {
        setError("Nenhum hospital encontrado na base de dados.")
        setHospitais([])
        setFilteredHospitais([])
        return
      }

      setHospitais(data)
      setFilteredHospitais(data)

      // Calcular estatísticas - públicos são os que têm vinculo_sus: "SUS"
      const totalLeitos = data.reduce((sum: number, h: Hospital) => sum + (h.leitos || 0), 0)
      const publicos = data.filter((h: Hospital) => h.vinculo_sus === "SUS").length
      const privados = data.filter((h: Hospital) => h.vinculo_sus !== "SUS").length

      setStats({
        total: data.length,
        publicos,
        privados,
        totalLeitos,
      })

      toast({
        title: "Dados carregados",
        description: `${data.length} hospitais encontrados.`,
      })
    } catch (err) {
      console.error("Erro ao carregar hospitais:", err)
      setError("Erro ao carregar dados dos hospitais. Verifique sua conexão.")
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados dos hospitais.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filtrar hospitais
  useEffect(() => {
    let filtered = hospitais

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (hospital) =>
          hospital.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hospital.cidade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hospital.endereco?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtro por região
    if (filterRegiao !== "all") {
      filtered = filtered.filter((hospital) => hospital.regiao?.toLowerCase() === filterRegiao.toLowerCase())
    }

    // Filtro por tipo (público/privado baseado em vinculo_sus)
    if (filterTipo !== "all") {
      if (filterTipo === "publico") {
        filtered = filtered.filter((hospital) => hospital.vinculo_sus === "SUS")
      } else if (filterTipo === "privado") {
        filtered = filtered.filter((hospital) => hospital.vinculo_sus !== "SUS")
      }
    }

    // Filtro por tipo de unidade
    if (filterTipoUnidade !== "all") {
      filtered = filtered.filter((hospital) => hospital.tipo_unidade === filterTipoUnidade)
    }

    setFilteredHospitais(filtered)
  }, [hospitais, searchTerm, filterRegiao, filterTipo, filterTipoUnidade])

  // Carregar dados na inicialização
  useEffect(() => {
    loadHospitais()
  }, [])

  // Obter regiões únicas
  const regioes = Array.from(new Set(hospitais.map((h) => h.regiao).filter(Boolean)))
  const tiposUnidade = Array.from(new Set(hospitais.map((h) => h.tipo_unidade).filter(Boolean)))

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Carregando hospitais...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            Hospitais
          </h1>
          <p className="text-muted-foreground mt-2">Gestão e visualização de hospitais cadastrados</p>
        </div>
        <Button onClick={loadHospitais} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Hospitais</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Hospitais cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hospitais Públicos (SUS)</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.publicos}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.publicos / stats.total) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hospitais Privados</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.privados}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.privados / stats.total) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leitos</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeitos.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Capacidade total</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nome, cidade ou endereço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Região</label>
              <Select value={filterRegiao} onValueChange={setFilterRegiao}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as regiões" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as regiões</SelectItem>
                  {regioes.map((regiao) => (
                    <SelectItem key={regiao} value={regiao}>
                      {regiao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <Select value={filterTipo} onValueChange={setFilterTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="publico">Público (SUS)</SelectItem>
                  <SelectItem value="privado">Privado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Unidade</label>
              <Select value={filterTipoUnidade} onValueChange={setFilterTipoUnidade}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos de unidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos de unidade</SelectItem>
                  {tiposUnidade.map((tipoUnidade) => (
                    <SelectItem key={tipoUnidade} value={tipoUnidade}>
                      {tipoUnidade}
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
          <CardTitle>Lista de Hospitais ({filteredHospitais.length} resultados)</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredHospitais.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum hospital encontrado</h3>
              <p className="text-muted-foreground">Tente ajustar os filtros ou termos de busca.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Tipo de Unidade</TableHead>
                    <TableHead>Leitos</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Vínculo SUS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHospitais.map((hospital) => (
                    <TableRow key={hospital.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {hospital.nome}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                          <div className="text-sm">
                            {hospital.endereco && <div>{hospital.endereco}</div>}
                            <div className="text-muted-foreground">
                              {hospital.cidade}
                              {hospital.estado && `, ${hospital.estado}`}
                              {hospital.regiao && ` - ${hospital.regiao}`}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {hospital.tipo_unidade && <Badge variant="outline">{hospital.tipo_unidade}</Badge>}
                      </TableCell>
                      <TableCell>
                        {hospital.leitos && (
                          <div className="flex items-center gap-1">
                            <Bed className="h-4 w-4 text-muted-foreground" />
                            {hospital.leitos}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {hospital.telefone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{hospital.telefone}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={hospital.vinculo_sus === "SUS" ? "default" : "secondary"}>
                          {hospital.vinculo_sus === "SUS" ? "Público" : "Privado"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
