"use client"

import { useEffect, useState } from "react"
import { Loader2, RefreshCw, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import HospitalList from "@/components/hospital-list"
import { loadRealHospitalData, getAllStates } from "@/lib/real-data-processor"

export default function HospitalsManager() {
  const [loading, setLoading] = useState(true)
  const [hospitalData, setHospitalData] = useState<any[]>([])
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [selectedState, setSelectedState] = useState("all")

  const fetchData = async () => {
    setLoading(true)
    try {
      const realData = await loadRealHospitalData()
      const states = getAllStates()

      // Converter dados reais para formato de hospitais
      const hospitals = states.map((state) => {
        const stateData = realData[state.name]
        return {
          id: state.id,
          name: `Hospital Central de ${state.name}`,
          city: state.name,
          region: state.region,
          beds: stateData.Leitos_Privados_2024,
          occupancy: Math.floor(Math.random() * 30) + 70, // 70-100%
          doctors: Math.floor(stateData.Leitos_Privados_2024 * 0.3), // Estimativa
          hospitals: stateData.Hospitais_Privados_2024,
          coordinates: stateData.Coordenadas,
        }
      })

      setHospitalData(hospitals)
      setFilteredData(hospitals)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    let filtered = hospitalData

    if (selectedRegion !== "all") {
      filtered = filtered.filter((hospital) => hospital.region === selectedRegion)
    }

    if (selectedState !== "all") {
      filtered = filtered.filter((hospital) => hospital.city === selectedState)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (hospital) =>
          hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hospital.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hospital.region.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredData(filtered)
  }, [hospitalData, searchTerm, selectedRegion, selectedState])

  const regions = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"]
  const states = getAllStates()

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Hospitais</h1>
          <p className="text-muted-foreground">Visualize dados dos hospitais por estado e região</p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre os hospitais por região, estado ou nome</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar hospitais..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar região" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as regiões</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state.id} value={state.name}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground flex items-center">
              {filteredData.length} hospital(is) encontrado(s)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Hospitais */}
      {loading ? (
        <Card>
          <CardContent className="flex h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      ) : (
        <HospitalList hospitals={filteredData} />
      )}
    </div>
  )
}
