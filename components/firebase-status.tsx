"use client"

import { useState, useEffect } from "react"
import { getFirebaseStatus } from "@/lib/firebase"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, Info } from "lucide-react"

export default function FirebaseStatus() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setStatus(getFirebaseStatus())
    setLoading(false)
  }, [])

  if (loading) {
    return <div>Verificando status do Firebase...</div>
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" /> Status do Firebase
        </CardTitle>
        <CardDescription>Informações sobre a configuração do Firebase</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Status de inicialização:</span>
            {status.initialized ? (
              <span className="flex items-center text-green-600">
                <CheckCircle className="mr-1 h-4 w-4" /> Inicializado com sucesso
              </span>
            ) : (
              <span className="flex items-center text-red-600">
                <AlertTriangle className="mr-1 h-4 w-4" /> Não inicializado
              </span>
            )}
          </div>

          <div>
            <h3 className="mb-2 font-medium">Configuração atual:</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <span className="font-medium">API Key:</span> {status.config.apiKey}
              </li>
              <li>
                <span className="font-medium">Auth Domain:</span> {status.config.authDomain}
              </li>
              <li>
                <span className="font-medium">Project ID:</span> {status.config.projectId}
              </li>
              <li>
                <span className="font-medium">App ID:</span> {status.config.appId}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 font-medium">Variáveis de ambiente:</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <span className="font-medium">NEXT_PUBLIC_FIREBASE_API_KEY:</span>{" "}
                {status.envVars.apiKey ? (
                  <span className="text-green-600">Definida</span>
                ) : (
                  <span className="text-red-600">Não definida</span>
                )}
              </li>
              <li>
                <span className="font-medium">NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:</span>{" "}
                {status.envVars.authDomain ? (
                  <span className="text-green-600">Definida</span>
                ) : (
                  <span className="text-red-600">Não definida</span>
                )}
              </li>
              <li>
                <span className="font-medium">NEXT_PUBLIC_FIREBASE_PROJECT_ID:</span>{" "}
                {status.envVars.projectId ? (
                  <span className="text-green-600">Definida</span>
                ) : (
                  <span className="text-red-600">Não definida</span>
                )}
              </li>
              <li>
                <span className="font-medium">NEXT_PUBLIC_FIREBASE_APP_ID:</span>{" "}
                {status.envVars.appId ? (
                  <span className="text-green-600">Definida</span>
                ) : (
                  <span className="text-red-600">Não definida</span>
                )}
              </li>
            </ul>
          </div>

          {!status.initialized && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erro de inicialização do Firebase</AlertTitle>
              <AlertDescription>
                O Firebase não foi inicializado corretamente. Verifique se as variáveis de ambiente estão configuradas
                corretamente.
              </AlertDescription>
            </Alert>
          )}

          {!status.envVars.apiKey && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Usando configuração de fallback</AlertTitle>
              <AlertDescription>
                As variáveis de ambiente do Firebase não estão definidas. O sistema está usando uma configuração de
                fallback para desenvolvimento.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => window.location.reload()} variant="outline">
          Verificar novamente
        </Button>
      </CardFooter>
    </Card>
  )
}
