"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Database,
  Shield,
  Zap,
  Settings,
} from "lucide-react"
import { getFirebaseStatus, testFirestoreConnection, seedDatabase } from "@/lib/firebase"

export default function FirebaseConnectionGuide() {
  const [status, setStatus] = useState(null)
  const [connectionTest, setConnectionTest] = useState(null)
  const [seeding, setSeeding] = useState(false)
  const [testing, setTesting] = useState(false)

  const checkStatus = () => {
    const firebaseStatus = getFirebaseStatus()
    setStatus(firebaseStatus)
    console.log("📊 Status do Firebase:", firebaseStatus)
  }

  const testConnection = async () => {
    setTesting(true)
    try {
      const result = await testFirestoreConnection()
      setConnectionTest(result)
      console.log("🔍 Resultado do teste:", result)
    } catch (error) {
      setConnectionTest({
        success: false,
        error: error.message,
        needsSetup: true,
      })
    } finally {
      setTesting(false)
    }
  }

  const handleSeedDatabase = async () => {
    setSeeding(true)
    try {
      await seedDatabase()
      alert("🎉 Banco de dados inicializado com sucesso!")
      // Testar conexão novamente após seed
      setTimeout(testConnection, 1000)
    } catch (error) {
      alert(`❌ Erro ao inicializar banco de dados: ${error.message}`)
    } finally {
      setSeeding(false)
    }
  }

  useEffect(() => {
    checkStatus()

    // Testar conexão após 3 segundos
    const timer = setTimeout(() => {
      testConnection()
    }, 3000)

    // Atualizar status a cada 10 segundos
    const interval = setInterval(checkStatus, 10000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  if (!status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Conectando com Firebase...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Status Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Status da Conexão Firebase
            <Button variant="outline" size="sm" onClick={checkStatus}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
          <CardDescription>Verificação em tempo real da conectividade com o Firebase</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Firebase App</span>
              </div>
              <Badge variant={status.hasApp ? "default" : "destructive"}>{status.hasApp ? "Conectado" : "Erro"}</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-green-50 to-green-100">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-green-600" />
                <span className="font-medium">Firestore</span>
              </div>
              <Badge variant={status.hasFirestore ? "default" : "secondary"}>
                {status.hasFirestore ? "Habilitado" : "Não habilitado"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-purple-100">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Authentication</span>
              </div>
              <Badge variant={status.hasAuth ? "default" : "secondary"}>{status.hasAuth ? "Ativo" : "Mock"}</Badge>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Configuração do Projeto:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Project ID:</span>
                <span className="font-mono">{status.config.projectId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Auth Domain:</span>
                <span className="font-mono text-xs">{status.config.authDomain}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerta para Firestore não habilitado */}
      {status.initialized && !status.hasFirestore && (
        <Alert className="border-orange-200 bg-orange-50">
          <Settings className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-800">🔧 Configuração Necessária</AlertTitle>
          <AlertDescription className="text-orange-700 space-y-4">
            <p>
              O Firestore Database precisa ser habilitado no seu projeto Firebase para usar todas as funcionalidades.
            </p>

            <div className="bg-orange-100 p-4 rounded-lg">
              <div className="font-medium mb-2">📋 Passos para habilitar:</div>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Acesse o Firebase Console</li>
                <li>Vá para "Firestore Database"</li>
                <li>Clique em "Criar banco de dados"</li>
                <li>Escolha "Iniciar no modo de teste"</li>
                <li>Selecione uma localização (ex: us-central1)</li>
                <li>Aguarde a criação do banco</li>
              </ol>
            </div>

            <Button
              variant="outline"
              onClick={() =>
                window.open(
                  `https://console.firebase.google.com/project/${status.config.projectId}/firestore`,
                  "_blank",
                )
              }
              className="border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Abrir Firebase Console
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Teste de Conexão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Teste de Conexão Firestore
            <Button variant="outline" size="sm" onClick={testConnection} disabled={testing}>
              {testing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {testing && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground p-4 bg-blue-50 rounded-lg">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Testando conexão com Firestore...
            </div>
          )}

          {connectionTest && !testing && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {connectionTest.success ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
                <span className="font-medium text-lg">
                  {connectionTest.success ? "✅ Conexão bem-sucedida!" : "⚠️ Firestore não disponível"}
                </span>
              </div>

              {connectionTest.success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Firestore Conectado</AlertTitle>
                  <AlertDescription className="text-green-700">
                    {connectionTest.message}
                    <div className="mt-4">
                      <Button
                        onClick={handleSeedDatabase}
                        disabled={seeding}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {seeding ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Inicializando...
                          </>
                        ) : (
                          <>
                            <Database className="h-4 w-4 mr-2" />
                            Inicializar Dados de Exemplo
                          </>
                        )}
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {!connectionTest.success && connectionTest.needsSetup && (
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">Firestore Não Habilitado</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    <p className="mb-3">O Firestore Database não foi habilitado no seu projeto Firebase.</p>
                    <p className="text-sm mb-4">
                      <strong>Erro:</strong>{" "}
                      <code className="bg-blue-100 px-2 py-1 rounded">{connectionTest.error}</code>
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `https://console.firebase.google.com/project/${status.config.projectId}/firestore`,
                          "_blank",
                        )
                      }
                      className="border-blue-300 text-blue-700 hover:bg-blue-100"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Habilitar Firestore
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Geral */}
      {status.initialized && status.hasFirestore && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">🎉 Firebase Conectado com Sucesso!</AlertTitle>
          <AlertDescription className="text-green-700">
            Todos os serviços estão funcionando corretamente. Você pode usar todas as funcionalidades do dashboard.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
