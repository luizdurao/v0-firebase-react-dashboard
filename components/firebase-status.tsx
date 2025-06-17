"use client"

import { useState, useEffect } from "react"
import { getFirebaseStatus, isFirebaseInitialized, isFirestoreAvailable, isAuthAvailable } from "@/lib/firebase"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, ExternalLink } from "lucide-react"

export default function FirebaseStatus() {
  const [status, setStatus] = useState({
    initialized: false,
    firestoreAvailable: false,
    authAvailable: false,
    browser: false,
    config: {
      apiKey: "",
      authDomain: "",
      projectId: "",
      appId: "",
    },
  })
  const [loading, setLoading] = useState(true)

  const updateStatus = () => {
    const firebaseStatus = getFirebaseStatus()
    setStatus({
      ...firebaseStatus,
      initialized: isFirebaseInitialized(),
      firestoreAvailable: isFirestoreAvailable(),
      authAvailable: isAuthAvailable(),
    })
  }

  useEffect(() => {
    // Verificar status inicial
    updateStatus()
    setLoading(false)

    // Verificar status periodicamente
    const interval = setInterval(updateStatus, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Status do Firebase</CardTitle>
        <CardDescription>Informações sobre a conexão com o Firebase</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">Firebase App:</span>
                <span className="flex items-center">
                  {status.initialized ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                      <span className="text-green-500">OK</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-500 mr-1" />
                      <span className="text-red-500">Erro</span>
                    </>
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">Firestore:</span>
                <span className="flex items-center">
                  {status.firestoreAvailable ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                      <span className="text-green-500">OK</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-500 mr-1" />
                      <span className="text-red-500">Não habilitado</span>
                    </>
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">Authentication:</span>
                <span className="flex items-center">
                  {status.authAvailable ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                      <span className="text-green-500">OK</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-orange-500 mr-1" />
                      <span className="text-orange-500">Limitado</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Configuração do Projeto:</h4>
              <div className="pl-4 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Project ID:</span>
                  <span className="font-mono">{status.config.projectId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Auth Domain:</span>
                  <span className="font-mono">{status.config.authDomain}</span>
                </div>
              </div>
            </div>

            {!status.firestoreAvailable && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Firestore Database não habilitado</AlertTitle>
                <AlertDescription className="space-y-2">
                  <p>O Firestore Database precisa ser habilitado no Firebase Console.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `https://console.firebase.google.com/project/${status.config.projectId}/firestore`,
                        "_blank",
                      )
                    }
                    className="mt-2"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir Firebase Console
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {status.initialized && status.firestoreAvailable && (
              <Alert className="mt-4">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Firebase configurado com sucesso!</AlertTitle>
                <AlertDescription>
                  Todos os serviços estão funcionando corretamente. Você pode usar todas as funcionalidades do
                  dashboard.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={updateStatus}>
          Atualizar Status
        </Button>
        <Button
          variant="default"
          onClick={() => {
            window.location.reload()
          }}
        >
          Recarregar Página
        </Button>
      </CardFooter>
    </Card>
  )
}

// Exportação nomeada para compatibilidade
export { FirebaseStatus }
