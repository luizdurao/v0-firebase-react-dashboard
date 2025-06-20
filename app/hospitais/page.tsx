import { Suspense } from "react"
import HospitaisPageClient from "./HospitaisPageClient"
import { RefreshCw } from "lucide-react"

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

export default function HospitaisPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HospitaisPageClient />
    </Suspense>
  )
}
