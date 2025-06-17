"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import AdminLogin from "@/components/admin-login"

export default function AdminPage() {
  const { isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAdmin) {
      router.push("/admin-panel")
    }
  }, [isAdmin, router])

  return (
    <div className="container mx-auto py-8 max-w-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Acesso Administrativo</h1>
        <p className="text-muted-foreground">Entre com suas credenciais para acessar o painel administrativo</p>
      </div>
      <AdminLogin />
    </div>
  )
}
