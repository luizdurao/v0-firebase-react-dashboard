"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, BarChart2, Map, Building2, Users, LogOut, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { user, isAdmin, logout } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Navegação para usuários comuns
  const publicNavigation = [
    { name: "Dashboard", href: "/", icon: BarChart2 },
    { name: "Mapa", href: "/map", icon: Map },
    { name: "Hospitais", href: "/hospitals", icon: Building2 },
    { name: "Regiões", href: "/regions", icon: Users },
  ]

  // Navegação completa para administradores
  const adminNavigation = [...publicNavigation, { name: "Painel Admin", href: "/admin-panel", icon: Users }]

  const navigation = isAdmin ? adminNavigation : publicNavigation

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
          <span className="text-xl font-semibold text-gray-800 dark:text-white">CNS Saúde</span>
          <button
            type="button"
            className="lg:hidden text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-5 px-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors",
                pathname === item.href
                  ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
              )}
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon className="mr-4 h-6 w-6 flex-shrink-0" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {user ? (
                <>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.displayName || user.email}
                  </span>
                  {isAdmin && <span className="text-xs text-blue-600 dark:text-blue-400">Administrador</span>}
                </>
              ) : (
                <Link
                  href="/admin"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Fazer Login
                </Link>
              )}
            </div>
            <div className="flex items-center gap-2">
              {user && (
                <button
                  className="p-1 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  onClick={handleLogout}
                  title="Sair"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              )}
              {mounted && (
                <button
                  className="p-1 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  title="Alternar tema"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <button
                  type="button"
                  className="lg:hidden text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </button>
                <div className="hidden lg:block ml-4">
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {navigation.find((item) => item.href === pathname)?.name || "Dashboard"}
                  </h1>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date().toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-6">{children}</main>
      </div>
    </div>
  )
}
