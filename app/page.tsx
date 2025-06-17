import Layout from "@/components/layout"
import ClientDashboard from "@/components/client-dashboard"

export default function Home() {
  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Dashboard CNS Saúde
          </h1>
          <p className="text-gray-600">Sistema de Monitoramento de Saúde Pública</p>
        </div>
        <ClientDashboard />
      </div>
    </Layout>
  )
}
