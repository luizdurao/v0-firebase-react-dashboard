import Layout from "@/components/layout"
import AdminPageClient from "./AdminPageClient"

export const metadata = {
  title: "Área Administrativa - Dashboard CN Saúde",
  description: "Painel administrativo do sistema de saúde",
}

export default function AdminPage() {
  return (
    <Layout>
      <AdminPageClient />
    </Layout>
  )
}
