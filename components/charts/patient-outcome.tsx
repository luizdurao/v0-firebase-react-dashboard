"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface PatientOutcomeChartProps {
  data: any[]
}

export default function PatientOutcomeChart({ data }: PatientOutcomeChartProps) {
  // Se não houver dados, mostrar mensagem
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center text-muted-foreground">
        Nenhum dado disponível para a região selecionada
      </div>
    )
  }

  // Usar dados do primeiro hospital ou dados de exemplo
  const chartData = data[0]?.patientOutcomes || [
    { month: "Jan", successRate: 76 },
    { month: "Fev", successRate: 78 },
    { month: "Mar", successRate: 77 },
    { month: "Abr", successRate: 80 },
    { month: "Mai", successRate: 82 },
    { month: "Jun", successRate: 81 },
    { month: "Jul", successRate: 83 },
    { month: "Ago", successRate: 84 },
    { month: "Set", successRate: 86 },
    { month: "Out", successRate: 88 },
    { month: "Nov", successRate: 87 },
    { month: "Dez", successRate: 89 },
  ]

  // Se houver mais de um hospital, mostrar o nome do hospital
  const hospitalName = data.length === 1 ? data[0].name : "Média de hospitais"

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[70, 100]} />
          <Tooltip formatter={(value) => [`${value}%`, "Taxa de Sucesso"]} />
          <Area
            type="monotone"
            dataKey="successRate"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.3}
            name={hospitalName}
          />
        </AreaChart>
      </ResponsiveContainer>
      {data.length > 1 && (
        <div className="mt-2 text-center text-sm text-muted-foreground">Mostrando dados de {data.length} hospitais</div>
      )}
    </div>
  )
}
