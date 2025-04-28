"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db, isFirebaseInitialized } from "@/lib/firebase"
import { Loader2, RefreshCw, Edit, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import EditRegionDialog from "@/components/edit-region-dialog"

// Dados de exemplo para quando o Firebase não está disponível
const sampleRegionData = [
  {
    id: "north",
    name: "Norte",
    hospitals: 245,
    urbanAccessIndex: 78,
    ruralAccessIndex: 42,
    doctors: 12500,
    beds: 45000,
    population: 18000000,
  },
  {
    id: "northeast",
    name: "Nordeste",
    hospitals: 587,
    urbanAccessIndex: 82,
    ruralAccessIndex: 48,
    doctors: 28000,
    beds: 98000,
    population: 57000000,
  },
  {
    id: "central-west",
    name: "Centro-Oeste",
    hospitals: 312,
    urbanAccessIndex: 88,
    ruralAccessIndex: 56,
    doctors: 15000,
    beds: 52000,
    population: 16000000,
  },
  {
    id: "southeast",
    name: "Sudeste",
    hospitals: 892,
    urbanAccessIndex: 94,
    ruralAccessIndex: 62,
    doctors: 85000,
    beds: 210000,
    population: 89000000,
  },
  {
    id: "south",
    name: "Sul",
    hospitals: 421,
    urbanAccessIndex: 92,
    ruralAccessIndex: 58,
    doctors: 32000,
    beds: 84000,
    population: 30000000,
  },
]

export default function RegionsManager() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [regionData, setRegionData] = useState(sampleRegionData)
  const [usingMockData, setUsingMockData] = useState(!isFirebaseInitialized())
  const [selectedRegion, setSelectedRegion] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

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
      // Buscar dados de regiões
      const regionSnapshot = await getDocs(collection(db, "regions"))
      if (!regionSnapshot.empty) {
        const regions = regionSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setRegionData(regions)
        setUsingMockData(false)
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

  const handleEditRegion = (region) => {
    setSelectedRegion(region)
    setIsEditDialogOpen(true)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Regiões</h1>
          <p className="text-muted-foreground">Visualize e edite os dados das regiões do Brasil</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          {isFirebaseInitialized() && (
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Região
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {usingMockData && !error && (
        <Alert>
          <AlertTitle>Usando Dados de Exemplo</AlertTitle>
          <AlertDescription>
            A página está exibindo dados de exemplo.{" "}
            {isFirebaseInitialized()
              ? "Você pode inicializar o banco de dados na página principal."
              : "O Firebase não está inicializado corretamente."}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Regiões do Brasil</CardTitle>
          <CardDescription>Lista de todas as regiões e seus dados</CardDescription>
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
                  <TableHead>Nome</TableHead>
                  <TableHead className="text-right">Hospitais</TableHead>
                  <TableHead className="text-right">Médicos</TableHead>
                  <TableHead className="text-right">Leitos</TableHead>
                  <TableHead className="text-right">Acesso Urbano</TableHead>
                  <TableHead className="text-right">Acesso Rural</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regionData.map((region) => (
                  <TableRow key={region.id}>
                    <TableCell className="font-medium">{region.name}</TableCell>
                    <TableCell className="text-right">{region.hospitals}</TableCell>
                    <TableCell className="text-right">{region.doctors?.toLocaleString() || "N/A"}</TableCell>
                    <TableCell className="text-right">{region.beds?.toLocaleString() || "N/A"}</TableCell>
                    <TableCell className="text-right">{region.urbanAccessIndex || "N/A"}</TableCell>
                    <TableCell className="text-right">{region.ruralAccessIndex || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditRegion(region)}
                        disabled={!isFirebaseInitialized()}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar {region.name}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedRegion && (
        <EditRegionDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          region={selectedRegion}
          onRegionUpdated={fetchData}
        />
      )}
    </div>
  )
}
