"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface HospitalDistributionChartProps {
  data: any[]
}

export default function HospitalDistributionChart({ data }: HospitalDistributionChartProps) {
  // Se não houver dados, mostrar mensagem
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center text-muted-foreground">
        Nenhum dado disponível para a região selecionada
      </div>
    )
  }

  // Transformar dados para o gráfico
  const chartData = data.map((region) => ({
    name: region.name,
    hospitals: region.hospitals,
  }))

  // Cores para as barras
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value} hospitais`, "Quantidade"]} />
          <Bar dataKey="hospitals" name="Hospitais" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
