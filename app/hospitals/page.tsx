import Layout from "@/components/layout"
import HospitalsManager from "@/components/hospitals-manager"

export const metadata = {
  title: "Hospitais - Dashboard CN Saúde",
  description: "Gestão de hospitais do sistema de saúde",
}

export default function HospitalsPage() {
  return (
    <Layout>
      <HospitalsManager />
    </Layout>
  )
}
