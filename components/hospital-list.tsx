"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin } from "lucide-react"

interface HospitalListProps {
  filteredData?: any[]
}

export default function HospitalList({ filteredData = [] }: HospitalListProps) {
  return (
    <div className="space-y-4">
      <div className="text-center py-8">
        <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Dados Regionais Agregados</h3>
        <p className="text-muted-foreground">Visualização de dados agregados por região brasileira</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredData.map((region) => (
          <Card key={region.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {region.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total de Hospitais</span>
                  <Badge variant="default">{region.hospitais}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total de Leitos</span>
                  <Badge variant="secondary">{region.leitos}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Média Leitos/Hospital</span>
                  <Badge variant="outline">{Math.round(region.leitos / region.hospitais)}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
