"use client"

import { useAuth } from "@/contexts/auth-context"
import AdminLogin from "@/components/admin-login"
import AdminPanel from "@/components/admin-panel"

export default function AdminPageClient() {
  const { isAdmin } = useAuth()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Administração do Sistema</h1>
      {isAdmin ? <AdminPanel /> : <AdminLogin />}
    </div>
  )
}
