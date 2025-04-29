"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth, isFirebaseInitialized } from "@/lib/firebase"
import { Loader2, BarChart2, Map, LogOut, AlertTriangle, Globe, Building2, Database, Lock, X, Menu } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AuthProvider, useAuth } from "@/contexts/auth-context"

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const { user, isAdmin, logout } = useAuth()

  useEffect(() => {
    // Pular autenticação se o Firebase não estiver inicializado
    if (!isFirebaseInitialized()) {
      console.log("Firebase não inicializado, pulando autenticação")
      setLoading(false)
      return () => {}
    }

    try {
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
    } catch (error) {
      console.error("Erro ao configurar listener de autenticação:", error)
      setAuthError(`Erro ao configurar autenticação: ${error instanceof Error ? error.message : String(error)}`)
      setLoading(false)
      return () => {}
    }
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando...</span>
      </div>
    )
  }

  const navigationLinks = [
    { href: "/", icon: <BarChart2 className="h-5 w-5" />, label: "Dashboard" },
    { href: "/regions", icon: <Globe className="h-5 w-5" />, label: "Regiões" },
    { href: "/hospitals", icon: <Building2 className="h-5 w-5" />, label: "Hospitais" },
    { href: "/map", icon: <Map className="h-5 w-5" />, label: "Mapa Regional" },
  ]

  // Add admin-only links
  if (isAdmin) {
    navigationLinks.push({
      href: "/external-db",
      icon: <Database className="h-5 w-5" />,
      label: "Banco Externo",
    })
  }

  // Add login link if not logged in
  if (!user) {
    navigationLinks.push({
      href: "/admin",
      icon: <Lock className="h-5 w-5" />,
      label: "Área Administrativa",
    })
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden w-64 flex-shrink-0 flex-col bg-white shadow-md md:flex">
        <div className="flex h-16 items-center justify-center border-b">
          <h1 className="text-xl font-bold text-primary">Dashboard CN Saúde</h1>
        </div>
        <nav className="flex flex-1 flex-col p-4">
          <div className="space-y-1">
            {navigationLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <span className="mr-3 text-gray-500">{link.icon}</span>
                {link.label}
              </a>
            ))}
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

      {/* Mobile header and menu */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="bg-white shadow">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-lg font-bold text-primary md:hidden">Dashboard CN Saúde</h1>

            <div className="flex items-center gap-2">
              {/* Mobile Menu Button */}
              <button
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 md:hidden"
                onClick={toggleMobileMenu}
                aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="border-t bg-white md:hidden">
              <nav className="flex flex-col p-4">
                <div className="space-y-2">
                  {navigationLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="flex items-center rounded-md px-3 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      onClick={closeMobileMenu}
                    >
                      <span className="mr-3 text-gray-500">{link.icon}</span>
                      {link.label}
                    </a>
                  ))}

                  {isFirebaseInitialized() && user && (
                    <button
                      onClick={() => {
                        handleSignOut()
                        closeMobileMenu()
                      }}
                      className="flex w-full items-center rounded-md px-3 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      <LogOut className="mr-3 h-5 w-5 text-gray-500" />
                      Sair
                    </button>
                  )}
                </div>
              </nav>
            </div>
          )}
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
