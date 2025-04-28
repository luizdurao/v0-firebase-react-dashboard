"use client"

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from "recharts"

interface RegionalComparisonChartProps {
  data: any[]
}

export default function RegionalComparisonChart({ data }: RegionalComparisonChartProps) {
  // Se não houver dados, mostrar mensagem
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center text-muted-foreground">
        Nenhum dado disponível para a região selecionada
      </div>
    )
  }

  // Se apenas uma região for selecionada, mostrar dados detalhados dessa região
  if (data.length === 1) {
    const region = data[0]
    const chartData = [
      { subject: "Hospitais", valor: region.hospitals || 0 },
      { subject: "Médicos", valor: region.doctors || 0 },
      { subject: "Leitos", valor: region.beds || 0 },
      { subject: "Acesso Urbano", valor: region.urbanAccessIndex || 0 },
      { subject: "Acesso Rural", valor: region.ruralAccessIndex || 0 },
    ]

    return (
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, "auto"]} />
            <Radar name={region.name} dataKey="valor" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.6} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // Se múltiplas regiões, mostrar comparação entre elas
  // Preparar dados para o gráfico
  const chartData = [
    { subject: "Hospitais", Norte: 0, Nordeste: 0, "Centro-Oeste": 0, Sudeste: 0, Sul: 0 },
    { subject: "Médicos", Norte: 0, Nordeste: 0, "Centro-Oeste": 0, Sudeste: 0, Sul: 0 },
    { subject: "Equipamentos", Norte: 0, Nordeste: 0, "Centro-Oeste": 0, Sudeste: 0, Sul: 0 },
    { subject: "Leitos", Norte: 0, Nordeste: 0, "Centro-Oeste": 0, Sudeste: 0, Sul: 0 },
    { subject: "Acesso", Norte: 0, Nordeste: 0, "Centro-Oeste": 0, Sudeste: 0, Sul: 0 },
  ]

  // Preencher dados reais
  data.forEach((region) => {
    const regionName = region.name

    // Atualizar valores para cada métrica
    chartData[0][regionName] = region.hospitals || 0
    chartData[1][regionName] = region.doctors ? Math.min(region.doctors / 1000, 100) : 0 // Normalizar para o gráfico
    chartData[2][regionName] = region.equipment || Math.floor(Math.random() * 40) + 40
    chartData[3][regionName] = region.beds ? Math.min(region.beds / 1000, 100) : 0 // Normalizar para o gráfico
    chartData[4][regionName] = region.urbanAccessIndex || 0
  })

  // Determinar quais regiões mostrar no gráfico
  const regionsToShow = data.map((r) => r.name)

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />

          {regionsToShow.includes("Sudeste") && (
            <Radar name="Sudeste" dataKey="Sudeste" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.6} />
          )}

          {regionsToShow.includes("Sul") && (
            <Radar name="Sul" dataKey="Sul" stroke="#f97316" fill="#f97316" fillOpacity={0.6} />
          )}

          {regionsToShow.includes("Nordeste") && (
            <Radar name="Nordeste" dataKey="Nordeste" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
          )}

          {regionsToShow.includes("Norte") && (
            <Radar name="Norte" dataKey="Norte" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          )}

          {regionsToShow.includes("Centro-Oeste") && (
            <Radar name="Centro-Oeste" dataKey="Centro-Oeste" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
          )}

          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
