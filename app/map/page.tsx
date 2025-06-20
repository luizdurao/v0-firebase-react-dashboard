import MapPageClient from "./MapPageClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mapa Interativo - CN Saúde",
  description: "Visualização geográfica dos dados de saúde no Brasil.",
}

export default function MapPage() {
  // Este componente é um Server Component.
  // Ele apenas renderiza o MapPageClient.
  // O Layout global (com menu lateral) é aplicado pelo app/layout.tsx e NÃO deve ser re-aplicado aqui.
  return <MapPageClient />
}
