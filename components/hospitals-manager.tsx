"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db, isFirebaseInitialized } from "@/lib/firebase"
import { Loader2, RefreshCw, Edit, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"

// Dados de exemplo para quando o Firebase não está disponível
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
  },
  {
    id: "hosp4",
    name: "Hospital das Clínicas da UFMG",
    region: "Sudeste",
    city: "Belo Horizonte",
    beds: 510,
    occupancy: 71,
    doctors: 190,
    nurses: 420,
  },
  {
    id: "hosp5",
    name: "Hospital Universitário de Brasília",
    region: "Centro-Oeste",
    city: "Brasília",
    beds: 420,
    occupancy: 68,
    doctors: 160,
    nurses: 350,
  },
]

export default function HospitalsManager() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hospitalData, setHospitalData] = useState(sampleHospitalData)
  const [filteredHospitals, setFilteredHospitals] = useState(sampleHospitalData)
  const [usingMockData, setUsingMockData] = useState(!isFirebaseInitialized())
  const [searchTerm, setSearchTerm] = useState("")

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    // Se o Firebase não estiver inicializado, usar dados de exemplo
    if (!isFirebaseInitialized()) {
      console.log("Firebase não inicializado, usando dados de exemplo")
      setUsingMockData(true)
      setHospitalData(sampleHospitalData)
      setFilteredHospitals(sampleHospitalData)
      setLoading(false)
      return
    }

    try {
      // Buscar dados de hospitais
      const hospitalSnapshot = await getDocs(collection(db, "hospitals"))
      if (!hospitalSnapshot.empty) {
        const hospitals = hospitalSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setHospitalData(hospitals)
        setFilteredHospitals(hospitals)
        setUsingMockData(false)
      } else {
        // Se não houver dados de hospitais, usar dados de exemplo
        setHospitalData(sampleHospitalData)
        setFilteredHospitals(sampleHospitalData)
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

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = hospitalData.filter(
        (hospital) =>
          hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hospital.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hospital.region.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredHospitals(filtered)
    } else {
      setFilteredHospitals(hospitalData)
    }
  }, [searchTerm, hospitalData])

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Hospitais</h1>
          <p className="text-muted-foreground">Visualize e edite os dados dos hospitais do Brasil</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          {isFirebaseInitialized() && (
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Hospital
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
          <CardTitle>Hospitais do Brasil</CardTitle>
          <CardDescription>Lista de todos os hospitais e seus dados</CardDescription>
          <div className="mt-2">
            <Input
              placeholder="Buscar hospitais..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
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
                  <TableHead>Região</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead className="text-right">Leitos</TableHead>
                  <TableHead className="text-right">Ocupação</TableHead>
                  <TableHead className="text-right">Médicos</TableHead>
                  <TableHead className="text-right">Enfermeiros</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHospitals.length > 0 ? (
                  filteredHospitals.map((hospital) => (
                    <TableRow key={hospital.id}>
                      <TableCell className="font-medium">{hospital.name}</TableCell>
                      <TableCell>{hospital.region}</TableCell>
                      <TableCell>{hospital.city}</TableCell>
                      <TableCell className="text-right">{hospital.beds}</TableCell>
                      <TableCell className="text-right">{hospital.occupancy}%</TableCell>
                      <TableCell className="text-right">{hospital.doctors}</TableCell>
                      <TableCell className="text-right">{hospital.nurses}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" disabled={!isFirebaseInitialized()}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar {hospital.name}</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Nenhum hospital encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
