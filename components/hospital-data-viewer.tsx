"use client"

import { useState, useEffect } from "react"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Database, Eye, AlertCircle } from "lucide-react"

interface HospitalData {
  id: string
  [key: string]: any
}

export function HospitalDataViewer() {
  const [hospitalData, setHospitalData] = useState<HospitalData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "hospitais"),
      (snapshot) => {
        try {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as HospitalData[]
          setHospitalData(data)
          setLoading(false)
        } catch (err) {
          console.error("Error processing data:", err)
          setError(err instanceof Error ? err.message : "Error processing data")
          setLoading(false)
        }
      },
      (err) => {
        console.error("Firebase error:", err)
        setError(err.message)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Carregando dados do hospital...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center text-red-600">
          <AlertCircle className="h-8 w-8 mx-auto mb-4" />
          <p>Erro: {error}</p>
        </div>
      </div>
    )
  }

  // Agrupar dados por tipo se existir campo 'type'
  const groupedData = hospitalData.reduce(
    (acc, item) => {
      const type = item.type || "outros"
      if (!acc[type]) acc[type] = []
      acc[type].push(item)
      return acc
    },
    {} as Record<string, HospitalData[]>,
  )

  const renderDataTable = (data: HospitalData[], title: string) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          {title} ({data.length} registros)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Nenhum registro encontrado</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Dados</TableHead>
                <TableHead>Tipo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.slice(0, 10).map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">{item.id.substring(0, 8)}...</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {Object.entries(item)
                        .filter(([key]) => key !== "id")
                        .slice(0, 3)
                        .map(([key, value]) => (
                          <div key={key} className="flex gap-2">
                            <Badge variant="outline" className="text-xs">
                              {key}
                            </Badge>
                            <span className="text-sm truncate max-w-xs">
                              {typeof value === "object" && value !== null
                                ? JSON.stringify(value).substring(0, 30) + "..."
                                : String(value || "").substring(0, 30)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.type || "N/A"}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Registros</p>
                <p className="text-2xl font-bold text-gray-900">{hospitalData.length}</p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tipos de Dados</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(groupedData).length}</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Coleção</p>
                <p className="text-lg font-bold text-gray-900">hospitais</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dados agrupados por tipo */}
      {Object.keys(groupedData).length > 1 ? (
        <Tabs defaultValue={Object.keys(groupedData)[0]} className="space-y-6">
          <TabsList>
            {Object.keys(groupedData).map((type) => (
              <TabsTrigger key={type} value={type} className="capitalize">
                {type} ({groupedData[type].length})
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(groupedData).map(([type, data]) => (
            <TabsContent key={type} value={type}>
              {renderDataTable(data, `Dados do tipo: ${type}`)}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        renderDataTable(hospitalData, "Todos os Dados")
      )}

      {/* Estrutura de dados detalhada */}
      {hospitalData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Estrutura dos Dados (Exemplo)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm max-h-96">
              {JSON.stringify(hospitalData[0], null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
