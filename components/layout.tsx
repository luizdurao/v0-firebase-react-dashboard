"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth, isFirebaseInitialized } from "@/lib/firebase"
import {
  Loader2,
  BarChart2,
  Map,
  Activity,
  Settings,
  LogOut,
  AlertTriangle,
  Globe,
  Building2,
  Database,
  Lock,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AuthProvider, useAuth } from "@/contexts/auth-context"

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const router = useRouter()
  const { user, isAdmin, logout } = useAuth()

  useEffect(() => {
    // Pular autenticação se o Firebase não estiver inicializado
    if (!isFirebaseInitialized()) {
      console.log("Firebase não inicializado, pulando autenticação")
      setLoading(false)
      return () => {}
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setLoading(false)
      },
      (error) => {
        console.error("Erro de alteração de estado de autenticação:", error)
        setAuthError(`Erro de autenticação: ${error.message}`)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  const handleSignOut = async () => {
    if (!isFirebaseInitialized()) return

    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Erro ao sair:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando...</span>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden w-64 flex-shrink-0 flex-col bg-white shadow-md md:flex">
        <div className="flex h-16 items-center justify-center border-b">
          <h1 className="text-xl font-bold text-primary">Saúde Brasil</h1>
        </div>
        <nav className="flex flex-1 flex-col p-4">
          <div className="space-y-1">
            <a
              href="/"
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <BarChart2 className="mr-3 h-5 w-5 text-gray-500" />
              Dashboard
            </a>
            <a
              href="/regions"
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <Globe className="mr-3 h-5 w-5 text-gray-500" />
              Regiões
            </a>
            <a
              href="/hospitals"
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <Building2 className="mr-3 h-5 w-5 text-gray-500" />
              Hospitais
            </a>
            <a
              href="/map"
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <Map className="mr-3 h-5 w-5 text-gray-500" />
              Mapa Regional
            </a>
            <a
              href="/analytics"
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <Activity className="mr-3 h-5 w-5 text-gray-500" />
              Análises
            </a>
            {isAdmin && (
              <a
                href="/external-db"
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <Database className="mr-3 h-5 w-5 text-gray-500" />
                Banco Externo
              </a>
            )}
            <a
              href="/settings"
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <Settings className="mr-3 h-5 w-5 text-gray-500" />
              Configurações
            </a>
            {!user && (
              <a
                href="/admin"
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <Lock className="mr-3 h-5 w-5 text-gray-500" />
                Área Administrativa
              </a>
            )}
          </div>
        </nav>
        {isFirebaseInitialized() && user && (
          <div className="border-t p-4">
            <div className="mb-2 text-sm text-gray-500">
              {isAdmin ? "Logado como Administrador" : "Logado como Usuário"}
            </div>
            <button
              onClick={handleSignOut}
              className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-500" />
              Sair
            </button>
          </div>
        )}
      </div>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="bg-white shadow md:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-lg font-bold text-primary">Saúde Brasil</h1>
            <button className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600">
              <span className="sr-only">Abrir menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {!isFirebaseInitialized() && (
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Firebase Não Disponível</AlertTitle>
              <AlertDescription>
                Os serviços do Firebase não estão disponíveis. O dashboard está rodando em modo de demonstração com
                dados de exemplo.
              </AlertDescription>
            </Alert>
          )}

          {authError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erro de Autenticação</AlertTitle>
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}

          {children}
        </main>
      </div>
    </div>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  )
}
