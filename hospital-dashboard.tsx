"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFirestore } from "@/hooks/useFirestore"
import { FirestoreDataViewer } from "@/components/firestore-data-viewer"
import { Users, Activity, Heart, AlertCircle, Database } from "lucide-react"
import { AuthButton } from "@/components/auth-button"

export default function HospitalDashboard() {
  const { documents: hospitalData, loading, error } = useFirestore("hospitais", true)
  const [searchTerm, setSearchTerm] = useState("")

  // Filtrar e categorizar dados
  const patients = hospitalData.filter(
    (doc) => doc.type === "patient" || doc.tipo === "paciente" || (doc.nome && doc.idade && !doc.especialidade),
  )

  const doctors = hospitalData.filter((doc) => doc.type === "doctor" || doc.tipo === "medico" || doc.especialidade)

  const departments = hospitalData.filter(
    (doc) => doc.type === "department" || doc.tipo === "departamento" || doc.capacidade,
  )

  const filteredData = hospitalData.filter((doc) =>
    Object.values(doc).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Activity className="h-8 w-8 animate-spin" />
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="h-8 w-8 text-red-600" />
        <p className="text-lg text-red-700 max-w-md">{error}</p>
        <AuthButton />
      </div>
    )

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Database className="h-6 w-6" /> Hospitais ({hospitalData.length})
        </h1>
        <AuthButton />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Documentos</p>
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
                <p className="text-sm font-medium text-gray-600">Pacientes</p>
                <p className="text-2xl font-bold text-green-600">{patients.length}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Médicos</p>
                <p className="text-2xl font-bold text-purple-600">{doctors.length}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Departamentos</p>
                <p className="text-2xl font-bold text-orange-600">{departments.length}</p>
              </div>
              <Heart className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="firestore" className="space-y-6">
        <TabsList>
          <TabsTrigger value="firestore">Dados do Firestore</TabsTrigger>
          <TabsTrigger value="patients">Pacientes</TabsTrigger>
          <TabsTrigger value="doctors">Médicos</TabsTrigger>
          <TabsTrigger value="departments">Departamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="firestore">
          <FirestoreDataViewer />
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registros de Pacientes</CardTitle>
            </CardHeader>
            <CardContent>
              {patients.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Nenhum paciente encontrado</p>
                  <p className="text-sm text-gray-400 mt-2">Os dados podem estar em um formato diferente do esperado</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {patients.map((patient) => (
                    <Card key={patient.id}>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg">
                          {patient.nome || patient.name || "Nome não informado"}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          {patient.idade && <p>Idade: {patient.idade}</p>}
                          {patient.age && <p>Age: {patient.age}</p>}
                          {patient.departamento && <p>Departamento: {patient.departamento}</p>}
                          {patient.department && <p>Department: {patient.department}</p>}
                          {patient.status && <Badge variant="outline">{patient.status}</Badge>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="doctors">
          <Card>
            <CardHeader>
              <CardTitle>Equipe Médica</CardTitle>
            </CardHeader>
            <CardContent>
              {doctors.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Nenhum médico encontrado</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {doctors.map((doctor) => (
                    <Card key={doctor.id}>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg">{doctor.nome || doctor.name || "Nome não informado"}</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          {doctor.especialidade && <p>Especialidade: {doctor.especialidade}</p>}
                          {doctor.specialization && <p>Specialization: {doctor.specialization}</p>}
                          {doctor.departamento && <p>Departamento: {doctor.departamento}</p>}
                          {doctor.department && <p>Department: {doctor.department}</p>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle>Departamentos Hospitalares</CardTitle>
            </CardHeader>
            <CardContent>
              {departments.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Nenhum departamento encontrado</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {departments.map((dept) => (
                    <Card key={dept.id}>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg">{dept.nome || dept.name || "Nome não informado"}</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          {dept.capacidade && <p>Capacidade: {dept.capacidade}</p>}
                          {dept.capacity && <p>Capacity: {dept.capacity}</p>}
                          {dept.chefe && <p>Chefe: {dept.chefe}</p>}
                          {dept.head && <p>Head: {dept.head}</p>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
