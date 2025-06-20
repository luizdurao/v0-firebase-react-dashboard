import { Suspense } from "react"
import Layout from "@/components/layout"
import HospitaisPageClient from "./HospitaisPageClient"
import { Skeleton } from "@/components/ui/skeleton"

function HospitaisPageSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>

      <Skeleton className="h-96" />
    </div>
  )
}

export default function HospitaisPage() {
  return (
    <Layout>
      <Suspense fallback={<HospitaisPageSkeleton />}>
        <HospitaisPageClient />
      </Suspense>
    </Layout>
  )
}
