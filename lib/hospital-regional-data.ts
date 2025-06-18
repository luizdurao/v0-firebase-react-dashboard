// Dados reais dos hospitais privados por região - 2024
export interface RegionalHospitalData {
  id: string
  name: string
  hospitais: number
  distribuicaoHospitais: number
  distribuicaoBeneficiarios: number
  semFinsLucrativos: number
  comFinsLucrativos: number
  leitos: number
  distribuicaoLeitos: number
  distribuicaoLeitosBeneficiarios: number
  leitosSemFinsLucrativos: number
  leitosComFinsLucrativos: number
}

export const regionalHospitalData: RegionalHospitalData[] = [
  {
    id: "north",
    name: "Norte",
    hospitais: 265,
    distribuicaoHospitais: 4,
    distribuicaoBeneficiarios: 6,
    semFinsLucrativos: 55,
    comFinsLucrativos: 25,
    leitos: 10682,
    distribuicaoLeitos: 4,
    distribuicaoLeitosBeneficiarios: 4,
    leitosSemFinsLucrativos: 64,
    leitosComFinsLucrativos: 36,
  },
  {
    id: "northeast",
    name: "Nordeste",
    hospitais: 938,
    distribuicaoHospitais: 14,
    distribuicaoBeneficiarios: 19,
    semFinsLucrativos: 48,
    comFinsLucrativos: 52,
    leitos: 53738,
    distribuicaoLeitos: 18,
    distribuicaoLeitosBeneficiarios: 20,
    leitosSemFinsLucrativos: 52,
    leitosComFinsLucrativos: 48,
  },
  {
    id: "central-west",
    name: "Centro-Oeste",
    hospitais: 514,
    distribuicaoHospitais: 8,
    distribuicaoBeneficiarios: 8,
    semFinsLucrativos: 42,
    comFinsLucrativos: 58,
    leitos: 23149,
    distribuicaoLeitos: 8,
    distribuicaoLeitosBeneficiarios: 8,
    leitosSemFinsLucrativos: 45,
    leitosComFinsLucrativos: 55,
  },
  {
    id: "southeast",
    name: "Sudeste",
    hospitais: 3910,
    distribuicaoHospitais: 58,
    distribuicaoBeneficiarios: 52,
    semFinsLucrativos: 35,
    comFinsLucrativos: 65,
    leitos: 151519,
    distribuicaoLeitos: 51,
    distribuicaoLeitosBeneficiarios: 49,
    leitosSemFinsLucrativos: 38,
    leitosComFinsLucrativos: 62,
  },
  {
    id: "south",
    name: "Sul",
    hospitais: 1062,
    distribuicaoHospitais: 16,
    distribuicaoBeneficiarios: 15,
    semFinsLucrativos: 58,
    comFinsLucrativos: 42,
    leitos: 58048,
    distribuicaoLeitos: 19,
    distribuicaoLeitosBeneficiarios: 19,
    leitosSemFinsLucrativos: 61,
    leitosComFinsLucrativos: 39,
  },
]

export const calculateFilteredHospitalStats = (selectedRegions: string[]) => {
  const filteredData = regionalHospitalData.filter((region) => selectedRegions.includes(region.id))

  const totals = filteredData.reduce(
    (acc, region) => ({
      hospitais: acc.hospitais + region.hospitais,
      leitos: acc.leitos + region.leitos,
      leitosPorHospital: 0, // Calculado depois
    }),
    { hospitais: 0, leitos: 0, leitosPorHospital: 0 },
  )

  totals.leitosPorHospital = totals.hospitais > 0 ? Math.round(totals.leitos / totals.hospitais) : 0

  return {
    ...totals,
    regioes: filteredData.length,
    data: filteredData,
  }
}
