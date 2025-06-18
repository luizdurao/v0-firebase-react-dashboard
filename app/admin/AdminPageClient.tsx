"use client"

import Layout from "@/components/layout"
import AdminLogin from "@/components/admin-login"
import AdminPanel from "@/components/admin-panel"
import { useAuth } from "@/contexts/auth-context"

function AdminPageContent() {
  const { user } = useAuth()

  return <Layout>{user ? <AdminPanel /> : <AdminLogin />}</Layout>
}

export default function AdminPageClient() {
  return <AdminPageContent />
}
