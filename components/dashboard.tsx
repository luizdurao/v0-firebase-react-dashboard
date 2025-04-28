"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db, isFirebaseInitialized, seedDatabase, updateStats } from "@/lib/firebase"
import { Loader2, RefreshCw, AlertTriangle, Edit, Save, Filter } from "lucide-react"

import HospitalDistributionChart from "@/components/charts/hospital-distribution"
import HealthcareAccessChart from "@/components/charts/healthcare-access"
import PatientOutcomeChart from "@/components/charts/patient-outcome"
import RegionalComparisonChart from "@/components/charts/regional-comparison"
import StatsCard from "@/components/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Adicione esta importação no início do arquivo
import { useAuth } from "@/contexts/auth-context"

// Dados de exemplo para quando o Firebase não está disponível
const sampleStats = {
  totalHospitals: 2457,
  totalBeds: 489632,
  averageOccupancy: 72.5,
  patientsServed: 1245789,
}

const sampleRegionData = [
  { id: "north", name: "Norte", hospitals: 245, urbanAccessIndex: 78, ruralAccessIndex: 42 },
  { id: "northeast", name: "Nordeste", hospitals: 587, urbanAccessIndex: 82, ruralAccessIndex: 48 },
  { id: "central-west", name: "Centro-Oeste", hospitals: 312, urbanAccessIndex: 88, ruralAccessIndex: 56 },
  { id: "southeast", name: "Sudeste", hospitals: 892, urbanAccessIndex: 94, ruralAccessIndex: 62 },
  { id: "south", name: "Sul", hospitals: 421, urbanAccessIndex: 92, ruralAccessIndex: 58 },
]

const sampleHospitalData = [
  {
    id: "hosp1",
    name: "Hospital São Paulo",
    region: "Sudeste",
    city: "São Paulo",
    beds: 850,
    occupancy: 78,
    doctors: 320,
    nurses: 680,
    patientOutcomes: [
      { month: "Jan", successRate: 76 },
      { month: "Feb", successRate: 78 },
      { month: "Mar", successRate: 77 },
      { month: "Apr", successRate: 80 },
      { month: "May", successRate: 82 },
      { month: "Jun", successRate: 81 },
    ],
  },
  {
    id: "hosp2",
    name: "Hospital Albert Einstein",
    region: "Sudeste",
    city: "São Paulo",
    beds: 620,
    occupancy: 82,
    doctors: 280,
    nurses: 520,
    patientOutcomes: [
      { month: "Jan", successRate: 86 },
      { month: "Feb", successRate: 87 },
      { month: "Mar", successRate: 85 },
      { month: "Apr", successRate: 88 },
      { month: "May", successRate: 90 },
      { month: "Jun", successRate: 89 },
    ],
  },
  {
    id: "hosp3",
    name: "Hospital de Clínicas de Porto Alegre",
    region: "Sul",
    city: "Porto Alegre",
    beds: 580,
    occupancy: 75,
    doctors: 210,
    nurses: 450,
    patientOutcomes: [
      { month: "Jan", successRate: 79 },
      { month: "Feb", successRate: 80 },
      { month: "Mar", successRate: 78 },
      { month: "Apr", successRate: 82 },
      { month: "May", successRate: 83 },
      { month: "Jun", successRate: 81 },
    ],
  },
]

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState(sampleStats)
  const [editableStats, setEditableStats] = useState(sampleStats)
  const [hospitalData, setHospitalData] = useState(sampleHospitalData)
  const [regionData, setRegionData] = useState(sampleRegionData)
  const [usingMockData, setUsingMockData] = useState(!isFirebaseInitialized())
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [regionStats, setRegionStats] = useState(sampleStats)
  // E adicione esta linha dentro da função Dashboard
  const { isAdmin } = useAuth()

  // Função auxiliar para obter o nome da região pelo ID
  function getRegionNameById(id: string): string {
    const region = regionData.find((r) => r.id === id)
    return region ? region.name : ""
  }

  // Filtrar dados com base na região selecionada
  const filteredRegionData = selectedRegion === "all" ? regionData : regionData.filter((r) => r.id === selectedRegion)

  const filteredHospitalData =
    selectedRegion === "all"
      ? hospitalData
      : hospitalData.filter((hospital) => {
          const regionName = getRegionNameById(selectedRegion)
          return hospital.region.toLowerCase() === regionName.toLowerCase()
        })

  // Atualizar estatísticas baseadas na região selecionada
  useEffect(() => {
    if (selectedRegion === "all") {
      setRegionStats(stats)
    } else {
      const region = regionData.find((r) => r.id === selectedRegion)
      if (region) {
        // Calcular estatísticas para a região selecionada
        const regionHospitals = hospitalData.filter((h) => h.region.toLowerCase() === region.name.toLowerCase())

        const totalBeds = regionHospitals.reduce((sum, h) => sum + (h.beds || 0), 0)
        const totalOccupancy = regionHospitals.reduce((sum, h) => sum + (h.occupancy || 0), 0)
        const avgOccupancy = regionHospitals.length > 0 ? (totalOccupancy / regionHospitals.length).toFixed(1) : "0.0"

        setRegionStats({
          totalHospitals: region.hospitals || 0,
          totalBeds: totalBeds || 0,
          averageOccupancy: Number.parseFloat(avgOccupancy),
          patientsServed: Math.round(totalBeds * 0.8 * 30), // Estimativa simples
        })
      }
    }
  }, [selectedRegion, regionData, hospitalData, stats])

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    // Se o Firebase não estiver inicializado, usar dados de exemplo
    if (!isFirebaseInitialized()) {
      console.log("Firebase não inicializado, usando dados de exemplo")
      setUsingMockData(true)
      setLoading(false)
      return
    }

    try {
      // Buscar dados de estatísticas
      const statsSnapshot = await getDocs(collection(db, "stats"))
      if (!statsSnapshot.empty) {
        const statsData = statsSnapshot.docs[0].data()
        const newStats = {
          totalHospitals: statsData.totalHospitals || 0,
          totalBeds: statsData.totalBeds || 0,
          averageOccupancy: statsData.averageOccupancy || 0,
          patientsServed: statsData.patientsServed || 0,
        }
        setStats(newStats)
        setRegionStats(newStats)
        setEditableStats(newStats)
      } else {
        // Se não houver dados de estatísticas, usar dados de exemplo
        setStats(sampleStats)
        setRegionStats(sampleStats)
        setEditableStats(sampleStats)
        setUsingMockData(true)
      }

      // Buscar dados de hospitais
      const hospitalSnapshot = await getDocs(collection(db, "hospitals"))
      if (!hospitalSnapshot.empty) {
        const hospitals = hospitalSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setHospitalData(hospitals)
      } else {
        // Se não houver dados de hospitais, usar dados de exemplo
        setHospitalData(sampleHospitalData)
        setUsingMockData(true)
      }

      // Buscar dados de regiões
      const regionSnapshot = await getDocs(collection(db, "regions"))
      if (!regionSnapshot.empty) {
        const regions = regionSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setRegionData(regions)
      } else {
        // Se não houver dados de regiões, usar dados de exemplo
        setRegionData(sampleRegionData)
        setUsingMockData(true)
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      setError(`Erro ao buscar dados: ${error instanceof Error ? error.message : String(error)}`)
      setUsingMockData(true)
    } finally {
      setLoading(false)
    }
  }

  const handleSeedData = async () => {
    if (!isFirebaseInitialized()) {
      setError("Não é possível inicializar dados: Firebase não está inicializado corretamente")
      return
    }

    setSeeding(true)
    setError(null)
    try {
      await seedDatabase()
      await fetchData()
      setUsingMockData(false)
    } catch (error) {
      console.error("Erro ao inicializar dados:", error)
      setError(`Erro ao inicializar dados: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setSeeding(false)
    }
  }

  const handleSaveStats = async () => {
    if (!isFirebaseInitialized()) {
      setError("Não é possível salvar dados: Firebase não está inicializado corretamente")
      return
    }

    setSaving(true)
    setError(null)
    try {
      await updateStats(editableStats)
      setStats(editableStats)
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Erro ao salvar dados:", error)
      setError(`Erro ao salvar dados: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard de Saúde do Brasil</h1>
          <p className="text-muted-foreground">
            Visualização em tempo real da infraestrutura hospitalar e dados de saúde
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          {isFirebaseInitialized() && isAdmin && (
            <Button onClick={handleSeedData} disabled={seeding}>
              {seeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {seeding ? "Inicializando..." : "Inicializar Dados"}
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {usingMockData && !error && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Usando Dados de Exemplo</AlertTitle>
          <AlertDescription>
            O dashboard está exibindo dados de exemplo.{" "}
            {isFirebaseInitialized()
              ? "Clique em 'Inicializar Dados' para popular seu banco de dados."
              : "O Firebase não está inicializado corretamente."}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="w-full md:w-64">
          <Label htmlFor="region-select" className="mb-2 block">
            Filtrar por Região
          </Label>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger id="region-select" className="w-full">
              <SelectValue placeholder="Selecione uma região" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Regiões</SelectItem>
              {regionData.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {selectedRegion === "all"
              ? "Mostrando dados de todas as regiões"
              : `Mostrando dados da região ${getRegionNameById(selectedRegion)}`}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <StatsCard
            title="Total de Hospitais"
            value={regionStats.totalHospitals.toLocaleString()}
            description={
              selectedRegion === "all" ? "Em todas as regiões" : `Na região ${getRegionNameById(selectedRegion)}`
            }
            trend="+2.1%"
            trendDirection="up"
          />
          {isFirebaseInitialized() && selectedRegion === "all" && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Editar estatísticas</span>
            </Button>
          )}
        </div>
        <StatsCard
          title="Total de Leitos"
          value={regionStats.totalBeds.toLocaleString()}
          description={
            selectedRegion === "all" ? "Capacidade disponível" : `Na região ${getRegionNameById(selectedRegion)}`
          }
          trend="+5.3%"
          trendDirection="up"
        />
        <StatsCard
          title="Ocupação Média"
          value={`${regionStats.averageOccupancy}%`}
          description={selectedRegion === "all" ? "Utilização atual" : `Na região ${getRegionNameById(selectedRegion)}`}
          trend="-1.2%"
          trendDirection="down"
        />
        <StatsCard
          title="Pacientes Atendidos"
          value={regionStats.patientsServed.toLocaleString()}
          description={selectedRegion === "all" ? "Últimos 30 dias" : `Na região ${getRegionNameById(selectedRegion)}`}
          trend="+12.5%"
          trendDirection="up"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Hospitais por Região</CardTitle>
            <CardDescription>
              {selectedRegion === "all"
                ? "Número de unidades de saúde por região"
                : `Hospitais na região ${getRegionNameById(selectedRegion)}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-[300px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <HospitalDistributionChart data={filteredRegionData} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Índice de Acesso à Saúde</CardTitle>
            <CardDescription>
              {selectedRegion === "all"
                ? "Medindo a acessibilidade dos serviços de saúde"
                : `Acessibilidade na região ${getRegionNameById(selectedRegion)}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-[300px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <HealthcareAccessChart data={filteredRegionData} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resultados dos Pacientes</CardTitle>
            <CardDescription>
              {selectedRegion === "all"
                ? "Taxas de sucesso de tratamento ao longo do tempo"
                : `Resultados na região ${getRegionNameById(selectedRegion)}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-[300px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <PatientOutcomeChart data={filteredHospitalData} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comparação Regional</CardTitle>
            <CardDescription>
              {selectedRegion === "all"
                ? "Métricas-chave entre diferentes regiões"
                : `Métricas detalhadas da região ${getRegionNameById(selectedRegion)}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-[300px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <RegionalComparisonChart data={filteredRegionData} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Diálogo para editar estatísticas */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Estatísticas</DialogTitle>
            <DialogDescription>Atualize os valores das estatísticas principais do dashboard.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalHospitals" className="text-right">
                Total de Hospitais
              </Label>
              <Input
                id="totalHospitals"
                type="number"
                value={editableStats.totalHospitals}
                onChange={(e) => setEditableStats({ ...editableStats, totalHospitals: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalBeds" className="text-right">
                Total de Leitos
              </Label>
              <Input
                id="totalBeds"
                type="number"
                value={editableStats.totalBeds}
                onChange={(e) => setEditableStats({ ...editableStats, totalBeds: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="averageOccupancy" className="text-right">
                Ocupação Média (%)
              </Label>
              <Input
                id="averageOccupancy"
                type="number"
                step="0.1"
                value={editableStats.averageOccupancy}
                onChange={(e) => setEditableStats({ ...editableStats, averageOccupancy: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patientsServed" className="text-right">
                Pacientes Atendidos
              </Label>
              <Input
                id="patientsServed"
                type="number"
                value={editableStats.patientsServed}
                onChange={(e) => setEditableStats({ ...editableStats, patientsServed: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveStats} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
