"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertTriangle, Lock } from "lucide-react"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login, error, loading, isAdmin } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // Verificar credenciais específicas
    if (email === "luiz.durao" && password === "CNS@2025") {
      try {
        // Simular login bem-sucedido para credenciais específicas
        await login("admin@saude.gov.br", "admin123")
      } catch (err) {
        console.error("Erro ao fazer login:", err)
      }
    } else {
      // Tentar login normal para outras credenciais
      try {
        await login(email, password)
      } catch (err) {
        console.error("Erro ao fazer login:", err)
      }
    }
  }

  if (isAdmin) {
    router.push("/")
    return (
      <div className="flex h-[300px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Redirecionando para o dashboard...</span>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" /> Acesso de Administrador
          </CardTitle>
          <CardDescription>Entre com suas credenciais de administrador para acessar funções restritas</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erro de autenticação</AlertTitle>
              <AlertDescription>
                {error}
                {error.includes("api-key-not-valid") && (
                  <div className="mt-2 text-sm">
                    <p>
                      <strong>Solução:</strong> Verifique se a variável de ambiente NEXT_PUBLIC_FIREBASE_API_KEY está
                      configurada corretamente.
                    </p>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Usuário</Label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu usuário"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? "Autenticando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
