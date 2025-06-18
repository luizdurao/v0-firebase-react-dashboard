import Layout from "@/components/layout"
import ExternalDbConfig from "@/components/external-db-config"

export const metadata = {
  title: "Banco Externo - Dashboard CN Saúde",
  description: "Configuração de banco de dados externo",
}

export default function ExternalDbPage() {
  return (
    <Layout>
      <ExternalDbConfig />
    </Layout>
  )
}
