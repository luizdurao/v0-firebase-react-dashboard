import Layout from "@/components/layout"
import RealDataImporter from "@/components/real-data-importer"

export default function ImportDataPage() {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Importação de Dados</h1>
            <p className="text-muted-foreground">Importe dados hospitalares reais do Brasil para o sistema</p>
          </div>

          <RealDataImporter />
        </div>
      </div>
    </Layout>
  )
}
