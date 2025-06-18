"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { User, Shield, Database, Settings, Activity, CheckCircle, AlertTriangle, LogOut } from "lucide-react"
import FirebaseStatus from "./firebase-status"
import { seedDatabase, ensureAdminUser } from "@/lib/firebase"

export default function AdminPanel() {
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSeedDatabase = async () => {
    setLoading(true)
    setMessage("")

    try {
      await seedDatabase()
      setMessage("Banco de dados inicializado com sucesso!")
    } catch (error) {
      setMessage(`Erro ao inicializar banco de dados: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleEnsureAdmin = async () => {
    setLoading(true)
    setMessage("")

    try {
      await ensureAdminUser()
      setMessage("Usuário admin verificado/criado com sucesso!")
    } catch (error) {
      setMessage(`Erro ao verificar usuário admin: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header do Admin */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <p className="text-muted-foreground">Gerenciamento do sistema de saúde</p>
        </div>
        {user && (
          <Button variant="outline" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        )}
      </div>

      {/* Status de Autenticação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Status de Autenticação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Usuário:</span>
              {user ? (
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Logado
                  </Badge>
                  <span className="text-sm">{user.email}</span>
                </div>
              ) : (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  Nenhum usuário logado
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">Permissões:</span>
              {user ? (
                <Badge variant="default" className="bg-blue-100 text-blue-800">
                  <Shield className="mr-1 h-3 w-3" />
                  Administrador
                </Badge>
              ) : (
                <Badge variant="secondary">Sem permissões</Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">Ambiente:</span>
              <Badge variant="outline">
                <Activity className="mr-1 h-3 w-3" />
                Cliente (Browser)
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status do Firebase */}
      <FirebaseStatus />

      {/* Ações Administrativas */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Ações Administrativas
            </CardTitle>
            <CardDescription>Ferramentas para gerenciar o sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Button onClick={handleSeedDatabase} disabled={loading} className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  {loading ? "Inicializando..." : "Inicializar Banco de Dados"}
                </Button>

                <Button
                  onClick={handleEnsureAdmin}
                  disabled={loading}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  {loading ? "Verificando..." : "Verificar Usuário Admin"}
                </Button>
              </div>

              {message && (
                <Alert className={message.includes("Erro") ? "border-red-200" : "border-green-200"}>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas do Sistema */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estados Cadastrados</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">27</div>
            <p className="text-xs text-muted-foreground">Incluindo Distrito Federal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regiões</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Norte, Nordeste, Centro-Oeste, Sudeste, Sul</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dados Atualizados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2024</div>
            <p className="text-xs text-muted-foreground">Última atualização</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
