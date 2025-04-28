import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string
  description: string
  trend: string
  trendDirection: "up" | "down" | "neutral"
}

export default function StatsCard({ title, value, description, trend, trendDirection }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div
          className={`flex items-center text-xs font-medium ${
            trendDirection === "up" ? "text-emerald-600" : trendDirection === "down" ? "text-rose-600" : "text-gray-600"
          }`}
        >
          {trendDirection === "up" ? (
            <ArrowUpIcon className="mr-1 h-3 w-3" />
          ) : trendDirection === "down" ? (
            <ArrowDownIcon className="mr-1 h-3 w-3" />
          ) : null}
          {trend}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
