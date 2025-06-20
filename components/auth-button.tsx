"use client"

import { Button } from "@/components/ui/button"
import { LogIn, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export function AuthButton() {
  const { user, login, logout, loading } = useAuth()

  if (loading) return null

  return user ? (
    <Button onClick={logout} variant="outline" className="bg-red-50 text-red-700">
      <LogOut className="h-4 w-4 mr-2" /> Sair
    </Button>
  ) : (
    <Button onClick={login}>
      <LogIn className="h-4 w-4 mr-2" /> Entrar com Google
    </Button>
  )
}
