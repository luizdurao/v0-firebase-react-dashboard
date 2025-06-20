import { Suspense } from "react"
import HospitaisPageClient from "./HospitaisPageClient"
import { RefreshCw } from "lucide-react"

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
      <div className="flex flex-col items-center space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-lg font-medium">Carregando dados dos hospitais...</p>
        <p className="text-sm text-muted-foreground">Aguarde um momento.</p>
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
