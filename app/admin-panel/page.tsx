"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2, Database, TestTube, Settings, BarChart3, Shield, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RealDataImporter from "@/components/real-data-importer"
import FirebaseStatus from "@/components/firebase-status"
import { isFirebaseInitialized, seedDatabase } from "@/lib/firebase"

export default function AdminPanel() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const [seeding, setSeeding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/admin")
    }
  }, [isAdmin, loading, router])

  const handleSeedData = async () => {
    if (!isFirebaseInitialized()) {
      setError("Firebase não está inicializado corretamente")
      return
    }

    setSeeding(true)
    setError(null)
    try {
      await seedDatabase()
    } catch (error) {
      console.error("Erro ao inicializar dados:", error)
      setError(`Erro ao inicializar dados: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setSeeding(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Verificando permissões...</span>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertTitle>Acesso Negado</AlertTitle>
          <AlertDescription>Você precisa ser um administrador para acessar esta página.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Painel Administrativo</h1>
          <p className="text-muted-foreground">Gerenciamento de dados e configurações do sistema</p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium">Admin: {user?.email}</span>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="data" className="space-y-4">
        <TabsList>
          <TabsTrigger value="data">Dados</TabsTrigger>
          <TabsTrigger value="firebase">Firebase</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Importação de Dados
                </CardTitle>
                <CardDescription>Importe dados hospitalares reais para o sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <RealDataImporter />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Dados de Exemplo
                </CardTitle>
                <CardDescription>Inicialize o banco com dados de exemplo para testes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Use esta opção para popular o banco de dados com dados de exemplo para desenvolvimento e testes.
                </p>
                <Button onClick={handleSeedData} disabled={seeding || !isFirebaseInitialized()}>
                  {seeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {seeding ? "Inicializando..." : "Inicializar Dados de Exemplo"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="firebase" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Status do Firebase
              </CardTitle>
              <CardDescription>Verificação da conexão e configuração do Firebase</CardDescription>
            </CardHeader>
            <CardContent>
              <FirebaseStatus />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Testes do Sistema
                </CardTitle>
                <CardDescription>Ferramentas de teste e diagnóstico</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Acesse ferramentas de teste para verificar o funcionamento do sistema.
                </p>
                <Button variant="outline" onClick={() => router.push("/test-pages")}>
                  Acessar Página de Testes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informações do Sistema</CardTitle>
                <CardDescription>Detalhes sobre a configuração atual</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Firebase:</span>
                  <span className={isFirebaseInitialized() ? "text-green-600" : "text-red-600"}>
                    {isFirebaseInitialized() ? "Conectado" : "Desconectado"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Usuário:</span>
                  <span>{user?.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Permissão:</span>
                  <span className="text-green-600">Administrador</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
