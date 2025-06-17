"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface HospitalListProps {
  hospitals: any[]
}

export default function HospitalList({ hospitals }: HospitalListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredHospitals = hospitals.filter(
    (hospital) =>
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.region.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRegionColor = (region: string) => {
    const colors = {
      Norte: "bg-green-100 text-green-800",
      Nordeste: "bg-yellow-100 text-yellow-800",
      "Centro-Oeste": "bg-orange-100 text-orange-800",
      Sudeste: "bg-blue-100 text-blue-800",
      Sul: "bg-purple-100 text-purple-800",
    }
    return colors[region as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy >= 90) return "bg-red-100 text-red-800"
    if (occupancy >= 80) return "bg-yellow-100 text-yellow-800"
    return "bg-green-100 text-green-800"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diretório de Hospitais</CardTitle>
        <CardDescription>Lista abrangente de hospitais por estado no Brasil</CardDescription>
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estado/Hospital</TableHead>
                <TableHead>Região</TableHead>
                <TableHead className="text-right">Total Hospitais</TableHead>
                <TableHead className="text-right">Leitos</TableHead>
                <TableHead className="text-right">Ocupação</TableHead>
                <TableHead className="text-right">Médicos Est.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHospitals.length > 0 ? (
                filteredHospitals.map((hospital) => (
                  <TableRow key={hospital.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{hospital.city}</div>
                        <div className="text-sm text-muted-foreground">{hospital.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRegionColor(hospital.region)}>{hospital.region}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">{hospital.hospitals}</TableCell>
                    <TableCell className="text-right">{hospital.beds.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Badge className={getOccupancyColor(hospital.occupancy)}>{hospital.occupancy}%</Badge>
                    </TableCell>
                    <TableCell className="text-right">{hospital.doctors.toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Nenhum hospital encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Mostrando {filteredHospitals.length} de {hospitals.length} registros
        </div>
      </CardContent>
    </Card>
  )
}
