"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, ExternalLink, RefreshCw } from "lucide-react"
import {
  getFirebaseStatus,
  testFirestoreConnection,
  seedDatabase,
  syncWithExistingData,
  checkExistingData,
} from "@/lib/firebase"

export function FirebaseSetupGuide() {
  const [status, setStatus] = useState(null)
  const [connectionTest, setConnectionTest] = useState(null)
  const [existingData, setExistingData] = useState(null)
  const [seeding, setSeeding] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [checking, setChecking] = useState(false)
  const [testing, setTesting] = useState(false)

  const checkStatus = () => {
    const firebaseStatus = getFirebaseStatus()
    setStatus(firebaseStatus)
  }

  const testConnection = async () => {
    setTesting(true)
    try {
      const result = await testFirestoreConnection()
      setConnectionTest(result)
    } catch (error) {
      setConnectionTest({
        success: false,
        error: error.message,
      })
    } finally {
      setTesting(false)
    }
  }

  const handleCheckExistingData = async () => {
    setChecking(true)
    try {
      const result = await checkExistingData()
      setExistingData(result)
    } catch (error) {
      setExistingData({
        success: false,
        error: error.message,
      })
    } finally {
      setChecking(false)
    }
  }

  const handleSeedDatabase = async () => {
    setSeeding(true)
    try {
      await seedDatabase()
      alert("Banco de dados inicializado com sucesso!")
      await handleCheckExistingData() // Atualizar dados existentes
    } catch (error) {
      alert(`Erro ao inicializar banco de dados: ${error.message}`)
    } finally {
      setSeeding(false)
    }
  }

  const handleSyncData = async () => {
    setSyncing(true)
    try {
      await syncWithExistingData()
      alert("Dados sincronizados com sucesso!")
      await handleCheckExistingData() // Atualizar dados existentes
    } catch (error) {
      alert(`Erro ao sincronizar dados: ${error.message}`)
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    checkStatus()

    // Testar conexão após 2 segundos
    const timer = setTimeout(() => {
      testConnection()
    }, 2000)

    // Verificar dados existentes após 3 segundos
    const dataTimer = setTimeout(() => {
      handleCheckExistingData()
    }, 3000)

    // Atualizar status a cada 5 segundos
    const interval = setInterval(checkStatus, 5000)

    return () => {
      clearTimeout(timer)
      clearTimeout(dataTimer)
      clearInterval(interval)
    }
  }, [])

  if (!status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando status do Firebase...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Status do Firebase
            <Button variant="outline" size="sm" onClick={checkStatus}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
          <CardDescription>Verificação da configuração e conectividade do Firebase</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Navegador:</span>
              <Badge variant={status.browser ? "default" : "secondary"}>{status.browser ? "OK" : "Servidor"}</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Firebase App:</span>
              <Badge variant={status.hasApp ? "default" : "destructive"}>{status.hasApp ? "OK" : "Erro"}</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Firestore:</span>
              <Badge variant={status.hasFirestore ? "default" : "destructive"}>
                {status.hasFirestore ? "OK" : "Erro"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Auth:</span>
              <Badge variant={status.hasAuth ? "default" : "secondary"}>{status.hasAuth ? "OK" : "Mock"}</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Configuração:</h4>
            <div className="text-xs space-y-1 bg-muted p-3 rounded font-mono">
              <div>Project ID: {status.config.projectId}</div>
              <div>Auth Domain: {status.config.authDomain}</div>
              <div>API Key: {status.config.apiKey}</div>
              <div>App ID: {status.config.appId}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Teste de Conexão
            <Button variant="outline" size="sm" onClick={testConnection} disabled={testing}>
              {testing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {testing && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Testando conexão com Firestore...
            </div>
          )}

          {connectionTest && !testing && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {connectionTest.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium">
                  {connectionTest.success ? "Conexão bem-sucedida" : "Falha na conexão"}
                </span>
              </div>

              {connectionTest.success && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Firestore Conectado</AlertTitle>
                  <AlertDescription>
                    {connectionTest.message}
                    <div className="mt-3 flex gap-2">
                      <Button onClick={handleSeedDatabase} disabled={seeding}>
                        {seeding ? "Inicializando..." : "Inicializar Dados"}
                      </Button>
                      <Button variant="outline" onClick={handleSyncData} disabled={syncing}>
                        {syncing ? "Sincronizando..." : "Sincronizar Dados"}
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {!connectionTest.success && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Erro de Conexão</AlertTitle>
                  <AlertDescription className="space-y-3">
                    <div>{connectionTest.error}</div>

                    {connectionTest.needsSetup && (
                      <div className="p-3 bg-red-50 rounded border border-red-200">
                        <div className="font-medium text-red-800 mb-2">🔧 Firestore precisa ser configurado</div>
                        <div className="text-sm text-red-700 mb-3">
                          Você precisa habilitar o Firestore Database no Firebase Console:
                        </div>
                        <ol className="text-sm text-red-700 mb-3 list-decimal list-inside space-y-1">
                          <li>Acesse o Firebase Console</li>
                          <li>Vá para "Firestore Database"</li>
                          <li>Clique em "Criar banco de dados"</li>
                          <li>Escolha "Iniciar no modo de teste"</li>
                          <li>Selecione uma localização</li>
                        </ol>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `https://console.firebase.google.com/project/${status.config.projectId}/firestore`,
                              "_blank",
                            )
                          }
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Abrir Firebase Console
                        </Button>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Dados Existentes
            <Button variant="outline" size="sm" onClick={handleCheckExistingData} disabled={checking}>
              {checking ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {checking && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Verificando dados existentes...
            </div>
          )}

          {existingData && !checking && (
            <div className="space-y-3">
              {existingData.success ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Dados verificados com sucesso</span>
                  </div>

                  {existingData.hasAdmin && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>Usuário Admin Encontrado</AlertTitle>
                      <AlertDescription>
                        Email: {existingData.adminData?.email || "N/A"}
                        <br />
                        Role: {existingData.adminData?.role || "N/A"}
                      </AlertDescription>
                    </Alert>
                  )}

                  {existingData.collections && existingData.collections.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Coleções Existentes:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {existingData.collections.map((collection) => (
                          <div key={collection.name} className="p-2 border rounded text-center">
                            <div className="font-medium text-sm">{collection.name}</div>
                            <div className="text-xs text-muted-foreground">{collection.count} docs</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!existingData.collections || existingData.collections.length === 0) && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Nenhum Dado Encontrado</AlertTitle>
                      <AlertDescription>
                        Não foram encontrados dados no Firestore. Use os botões acima para inicializar ou sincronizar
                        dados.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Erro ao Verificar Dados</AlertTitle>
                  <AlertDescription>{existingData.error}</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {!status.initialized && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Firebase não inicializado</AlertTitle>
          <AlertDescription>
            O Firebase não foi inicializado corretamente. Verifique:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Se as variáveis de ambiente estão configuradas</li>
              <li>Se a configuração do Firebase está correta</li>
              <li>Se você está executando no navegador</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default FirebaseSetupGuide
