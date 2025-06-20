import { Suspense } from "react"
import HospitaisPageClient from "./HospitaisPageClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, RefreshCw } from "lucide-react"

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-lg font-medium">Carregando sistema de hospitais...</p>
        <p className="text-sm text-muted-foreground">Conectando ao Firebase...</p>
      </div>
    </div>
  )
}

function ErrorFallback() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            Hospitais do Brasil
          </h1>
          <p className="text-muted-foreground mt-1">Sistema Nacional de Saúde - Preview</p>
        </div>
      </div>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-800">Sistema em Modo Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-yellow-700 mb-4">O sistema está funcionando em modo preview. Para acessar dados reais:</p>
          <ol className="list-decimal list-inside space-y-2 text-yellow-700">
            <li>Configure as variáveis de ambiente do Firebase</li>
            <li>Execute os scripts de importação de dados</li>
            <li>Reinicie a aplicação</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}

export default function HospitaisPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HospitaisPageClient />
    </Suspense>
  )
}
