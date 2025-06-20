"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface HealthcareAccessChartProps {
  data: any[]
}

export default function HealthcareAccessChart({ data }: HealthcareAccessChartProps) {
  // Se não houver dados, mostrar mensagem
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center text-muted-foreground">
        Nenhum dado disponível para a região selecionada
      </div>
    )
  }

  // Preparar dados para o gráfico
  const chartData = data.map((region) => ({
    name: region.name,
    urban: region.urbanAccessIndex || Math.floor(Math.random() * 30) + 70,
    rural: region.ruralAccessIndex || Math.floor(Math.random() * 40) + 40,
  }))

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
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
          <YAxis domain={[0, 100]} />
          <Tooltip formatter={(value) => [`${value}%`, ""]} />
          <Legend />
          <Line
            type="monotone"
            dataKey="urban"
            stroke="#0ea5e9"
            activeDot={{ r: 8 }}
            name="Acesso Urbano"
            strokeWidth={2}
          />
          <Line type="monotone" dataKey="rural" stroke="#f97316" name="Acesso Rural" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
