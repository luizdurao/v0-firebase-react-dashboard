import Layout from "@/components/layout"
import AdminLogin from "@/components/admin-login"

export default function AdminPage() {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Administração do Sistema</h1>
        <AdminLogin />
      </div>
    </Layout>
  )
}
