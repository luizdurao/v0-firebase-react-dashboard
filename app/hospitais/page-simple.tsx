import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Bed, Activity, BarChart3 } from "lucide-react"

// Dados de exemplo para demonstração
const hospitalData = {
  totalHospitais: 12847,
  totalLeitos: 456789,
  leitosSUS: 287543,
  mediaLeitos: 35,
  hospitaisExemplo: [
    {
      id: "1",
      nome: "Hospital das Clínicas de São Paulo",
      UF: "SP",
      tipo_unidade: "Hospital Geral",
      vinculo_sus: "SUS",
      leitos: 2200,
    },
    {
      id: "2",
      nome: "Hospital Sírio-Libanês",
      UF: "SP",
      tipo_unidade: "Hospital Geral",
      vinculo_sus: "Privado",
      leitos: 350,
    },
    {
      id: "3",
      nome: "Hospital de Base do Distrito Federal",
      UF: "DF",
      tipo_unidade: "Hospital Geral",
      vinculo_sus: "SUS",
      leitos: 650,
    },
  ],
}

export default function HospitaisSimplePage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            Hospitais do Brasil
          </h1>
          <p className="text-muted-foreground mt-1">Sistema Nacional de Saúde - Dados de Leitos 2024</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hospitais 2024</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{hospitalData.totalHospitais.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Unidades cadastradas</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rede SUS</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{hospitalData.leitosSUS.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Leitos públicos</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leitos</CardTitle>
            <Bed className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{hospitalData.totalLeitos.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Capacidade total</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média de Leitos</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{hospitalData.mediaLeitos}</div>
            <p className="text-xs text-muted-foreground">Por hospital</p>
          </CardContent>
        </Card>
      </div>

      {/* Sample Hospitals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Exemplos de Hospitais (Dados de Demonstração)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-semibold">Hospital</th>
                  <th className="text-left p-4 font-semibold">UF</th>
                  <th className="text-left p-4 font-semibold">Tipo</th>
                  <th className="text-right p-4 font-semibold">Leitos</th>
                  <th className="text-left p-4 font-semibold">Vínculo</th>
                </tr>
              </thead>
              <tbody>
                {hospitalData.hospitaisExemplo.map((hospital) => (
                  <tr key={hospital.id} className="border-b hover:bg-muted/30">
                    <td className="p-4 font-medium">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {hospital.nome}
                      </div>
                    </td>
                    <td className="p-4">{hospital.UF}</td>
                    <td className="p-4">
                      <Badge variant="outline" className="text-xs">
                        {hospital.tipo_unidade}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Bed className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{hospital.leitos.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={hospital.vinculo_sus === "SUS" ? "default" : "secondary"}>
                        {hospital.vinculo_sus}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Esta é uma versão de demonstração com dados de exemplo.
            <br />
            Para acessar dados reais, conecte ao Firebase e execute a versão completa.
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Sistema de Hospitais - Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700">Este é um preview do sistema de gestão hospitalar. A versão completa inclui:</p>
          <ul className="mt-2 space-y-1 text-blue-700">
            <li>• Dados históricos de 2010-2024</li>
            <li>• Gráficos interativos de evolução</li>
            <li>• Filtros avançados por estado, tipo e vínculo</li>
            <li>• Integração com Firebase para dados reais</li>
            <li>• Mapas geográficos interativos</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
