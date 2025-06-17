import Layout from "@/components/layout"
import Dashboard from "@/components/dashboard"
import ClientDashboard from "@/components/client-dashboard"

export default function Home() {
  return (
    <Layout>
      <ClientDashboard />
      <Dashboard />
    </Layout>
  )
}
