import Layout from "@/components/layout"
import RegionsManager from "@/components/regions-manager"

export const metadata = {
  title: "Regiões - Dashboard CN Saúde",
  description: "Gestão de regiões do sistema de saúde",
}

export default function RegionsPage() {
  return (
    <Layout>
      <RegionsManager />
    </Layout>
  )
}
