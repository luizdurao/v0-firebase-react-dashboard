"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertTriangle, CheckCircle, Database } from "lucide-react"
import { isFirebaseInitialized, seedDatabase, ensureAdminUser } from "@/lib/firebase"

export default function AdminPanel() {
  const { isAdmin, user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const firebaseStatus = isFirebaseInitialized()

  const handleInitializeDatabase = async () => {
    if (!isAdmin) return

    setLoading(true)
    setMessage(null)

    try {
      await seedDatabase()
      setMessage({ type: "success", text: "Banco de dados inicializado com sucesso!" })
    } catch (error) {
      console.error("Erro ao inicializar banco de dados:", error)
      setMessage({ type: "error", text: `Erro ao inicializar banco de dados: ${error.message}` })
    } finally {
      setLoading(false)
    }
  }

  const handleEnsureAdmin = async () => {
    setLoading(true)
    setMessage(null)

    try {
      await ensureAdminUser()
      setMessage({ type: "success", text: "Usuário admin verificado/criado com sucesso!" })
    } catch (error) {
      console.error("Erro ao verificar usuário admin:", error)
      setMessage({ type: "error", text: `Erro ao verificar usuário admin: ${error.message}` })
    } finally {
      setLoading(false)
    }
  }

  if (!isAdmin) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Painel de Administração</CardTitle>
        <CardDescription>Gerencie o sistema e o banco de dados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert variant={firebaseStatus ? "default" : "destructive"}>
            {firebaseStatus ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            <AlertTitle>Status do Firebase</AlertTitle>
            <AlertDescription>
              {firebaseStatus
                ? "Firebase inicializado corretamente."
                : "Firebase não está inicializado. Verifique as configurações."}
            </AlertDescription>
          </Alert>

          {user && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Usuário Autenticado</AlertTitle>
              <AlertDescription>
                Email: {user.email}
                <br />
                UID: {user.uid}
                <br />
                Função: Administrador
              </AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert variant={message.type === "success" ? "default" : "destructive"}>
              {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              <AlertTitle>{message.type === "success" ? "Sucesso" : "Erro"}</AlertTitle>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-2 sm:flex-row sm:justify-end">
        <Button onClick={handleEnsureAdmin} disabled={loading || !firebaseStatus} variant="outline">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Verificar Usuário Admin
        </Button>
        <Button onClick={handleInitializeDatabase} disabled={loading || !firebaseStatus} variant="default">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          <Database className="mr-2 h-4 w-4" />
          Inicializar Banco de Dados
        </Button>
      </CardFooter>
    </Card>
  )
}
