"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Shield, Database, Users, Settings, CheckCircle, Info, LogOut, RefreshCw } from "lucide-react"
import FirebaseStatus from "./firebase-status"

export default function AdminPanel() {
  const { logout, user } = useAuth()
  const [isInitializing, setIsInitializing] = useState(false)

  const handleInitializeDatabase = async () => {
    setIsInitializing(true)
    // Simular inicialização do banco
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsInitializing(false)
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header do Admin */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Painel Administrativo</h2>
            <p className="text-muted-foreground">Gerenciamento do sistema de saúde</p>
          </div>
        </div>
        <Button onClick={handleLogout} variant="outline" size="sm">
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>

      {/* Status do Usuário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Status do Administrador
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Logado como Administrador
            </Badge>
            {user && <span className="text-sm text-muted-foreground">Usuário: {user.email || "luiz.durao"}</span>}
          </div>
        </CardContent>
      </Card>

      {/* Status do Firebase */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Status do Sistema
          </CardTitle>
          <CardDescription>Informações técnicas sobre a configuração do Firebase</CardDescription>
        </CardHeader>
        <CardContent>
          <FirebaseStatus />
        </CardContent>
      </Card>

      {/* Ações Administrativas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Ações Administrativas
          </CardTitle>
          <CardDescription>Ferramentas para gerenciar o sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleInitializeDatabase}
              disabled={isInitializing}
              className="h-auto p-4 flex flex-col items-start"
            >
              {isInitializing ? (
                <RefreshCw className="h-5 w-5 mb-2 animate-spin" />
              ) : (
                <Database className="h-5 w-5 mb-2" />
              )}
              <span className="font-semibold">
                {isInitializing ? "Inicializando..." : "Inicializar Banco de Dados"}
              </span>
              <span className="text-xs opacity-80">Popula o banco com dados iniciais</span>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <Shield className="h-5 w-5 mb-2" />
              <span className="font-semibold">Verificar Permissões</span>
              <span className="text-xs opacity-80">Validar acesso administrativo</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas do Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">Regiões</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Settings className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">27</p>
                <p className="text-sm text-muted-foreground">Estados + DF</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">Admin Ativo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aviso de Desenvolvimento */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Ambiente de Desenvolvimento</AlertTitle>
        <AlertDescription>
          Este painel administrativo está em modo de desenvolvimento. Algumas funcionalidades podem estar limitadas.
        </AlertDescription>
      </Alert>
    </div>
  )
}
