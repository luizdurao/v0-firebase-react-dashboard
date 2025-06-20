"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useFirestore } from "@/hooks/useFirestore"
import { Activity, Database, Eye, AlertCircle, RefreshCw, Plus, Edit, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function FirestoreDataViewer() {
  const { documents, loading, error, addDocument, updateDocument, deleteDocument } = useFirestore("hospitais")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newDocData, setNewDocData] = useState("")

  const filteredDocuments = documents.filter((doc) =>
    Object.values(doc).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleAddDocument = async () => {
    try {
      const data = JSON.parse(newDocData)
      await addDocument(data)
      setNewDocData("")
      setIsAddDialogOpen(false)
    } catch (err) {
      alert("Erro ao adicionar documento. Verifique o JSON.")
    }
  }

  const handleDeleteDocument = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar este documento?")) {
      try {
        await deleteDocument(id)
      } catch (err) {
        alert("Erro ao deletar documento.")
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Carregando dados do Firestore...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-600" />
          <h3 className="text-lg font-semibold text-red-600 mb-2">Erro ao conectar com Firestore</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Documentos</p>
                <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
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
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className="text-lg font-bold text-green-600">Conectado</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Buscar nos documentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Documento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Documento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="docData">Dados do Documento (JSON)</Label>
                <Textarea
                  id="docData"
                  placeholder='{"nome": "João", "idade": 30, "tipo": "paciente"}'
                  value={newDocData}
                  onChange={(e) => setNewDocData(e.target.value)}
                  rows={10}
                />
              </div>
              <Button onClick={handleAddDocument} className="w-full">
                Adicionar Documento
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabela de documentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Documentos da Coleção "hospitais" ({filteredDocuments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-8">
              <Database className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Nenhum documento encontrado</p>
              {documents.length === 0 && (
                <p className="text-sm text-gray-400 mt-2">
                  A coleção está vazia. Adicione alguns documentos para começar.
                </p>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Dados</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-mono text-sm">{doc.id.substring(0, 8)}...</TableCell>
                    <TableCell>
                      <div className="space-y-1 max-w-md">
                        {Object.entries(doc)
                          .filter(([key]) => !["id", "createdAt", "updatedAt"].includes(key))
                          .slice(0, 4)
                          .map(([key, value]) => (
                            <div key={key} className="flex gap-2 items-center">
                              <Badge variant="outline" className="text-xs">
                                {key}
                              </Badge>
                              <span className="text-sm truncate">
                                {typeof value === "object" && value !== null
                                  ? JSON.stringify(value).substring(0, 30) + "..."
                                  : String(value || "").substring(0, 30)}
                              </span>
                            </div>
                          ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {doc.createdAt instanceof Date ? doc.createdAt.toLocaleDateString("pt-BR") : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteDocument(doc.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Detalhes de um documento (exemplo) */}
      {filteredDocuments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Estrutura de Documento (Exemplo)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm max-h-96">
              {JSON.stringify(filteredDocuments[0], null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
