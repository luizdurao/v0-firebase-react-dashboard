// Interface para os dados do hospital
interface HospitalData {
  Hospitais_Privados_2024: number
  Leitos_Privados_2024: number
  Coordenadas: {
    Latitude: number
    Longitude: number
  }
  Regiao: string
  Distribuicao_Localizacao: {
    Capital: number
    Interior: number
  }
  Distribuicao_Porte_Populacional: {
    Ate_20k: number
    Entre_20k_e_100k: number
    Entre_100k_e_500k: number
    Mais_de_500k: number
  }
  Distribuicao_Porte_Hospitalar: {
    Ate_50_leitos: number
    Entre_51_e_150_leitos: number
    Entre_151_e_500_leitos: number
    Mais_de_500_leitos: number
  }
  Tipo_Hospital: {
    Geral: number
    Especializado: number
    Hospital_Dia: number
  }
  Tipo_Atendimento: {
    SUS: number
    Nao_SUS: number
  }
}

// Interface para dados processados do estado
interface StateChartData {
  id: string
  name: string
  region: string
  hospitals: number
  beds: number
  bedsPerThousand: number
  coordinates: {
    Latitude: number
    Longitude: number
  }
  locationDistribution: Array<{ name: string; value: number }>
  populationDistribution: Array<{ name: string; value: number }>
  hospitalSizeDistribution: Array<{ name: string; value: number }>
  hospitalTypeDistribution: Array<{ name: string; value: number }>
  serviceTypeDistribution: Array<{ name: string; value: number }>
}

// Dados hospitalares brasileiros embutidos
const hospitalData: Record<string, HospitalData> = {
  Acre: {
    Hospitais_Privados_2024: 10,
    Leitos_Privados_2024: 361,
    Coordenadas: { Latitude: -9.97499, Longitude: -67.8243 },
    Regiao: "Norte",
    Distribuicao_Localizacao: { Capital: 25.0, Interior: 75.0 },
    Distribuicao_Porte_Populacional: {
      Ate_20k: 77.9,
      Entre_20k_e_100k: 16.8,
      Entre_100k_e_500k: 5.3,
      Mais_de_500k: 0.0,
    },
    Distribuicao_Porte_Hospitalar: {
      Ate_50_leitos: 26.0,
      Entre_51_e_150_leitos: 67.0,
      Entre_151_e_500_leitos: 7.0,
      Mais_de_500_leitos: 0.0,
    },
    Tipo_Hospital: { Geral: 56.0, Especializado: 44.0, Hospital_Dia: 0.0 },
    Tipo_Atendimento: { SUS: 56.0, Nao_SUS: 44.0 },
  },
  Alagoas: {
    Hospitais_Privados_2024: 50,
    Leitos_Privados_2024: 3580,
    Coordenadas: { Latitude: -9.5713, Longitude: -36.782 },
    Regiao: "Nordeste",
    Distribuicao_Localizacao: { Capital: 31.9, Interior: 68.1 },
    Distribuicao_Porte_Populacional: {
      Ate_20k: 14.0,
      Entre_20k_e_100k: 68.1,
      Entre_100k_e_500k: 18.0,
      Mais_de_500k: 0.0,
    },
    Distribuicao_Porte_Hospitalar: {
      Ate_50_leitos: 48.5,
      Entre_51_e_150_leitos: 39.0,
      Entre_151_e_500_leitos: 12.5,
      Mais_de_500_leitos: 0.0,
    },
    Tipo_Hospital: { Geral: 44.0, Especializado: 48.3, Hospital_Dia: 7.7 },
    Tipo_Atendimento: { SUS: 29.6, Nao_SUS: 70.4 },
  },
  Amapá: {
    Hospitais_Privados_2024: 6,
    Leitos_Privados_2024: 293,
    Coordenadas: { Latitude: 1.41, Longitude: -51.77 },
    Regiao: "Norte",
    Distribuicao_Localizacao: { Capital: 16.5, Interior: 83.5 },
    Distribuicao_Porte_Populacional: {
      Ate_20k: 0.0,
      Entre_20k_e_100k: 0.0,
      Entre_100k_e_500k: 72.2,
      Mais_de_500k: 27.8,
    },
    Distribuicao_Porte_Hospitalar: {
      Ate_50_leitos: 78.4,
      Entre_51_e_150_leitos: 1.4,
      Entre_151_e_500_leitos: 20.3,
      Mais_de_500_leitos: 0.0,
    },
    Tipo_Hospital: { Geral: 19.0, Especializado: 74.7, Hospital_Dia: 6.3 },
    Tipo_Atendimento: { SUS: 67.1, Nao_SUS: 32.9 },
  },
  Amazonas: {
    Hospitais_Privados_2024: 32,
    Leitos_Privados_2024: 1082,
    Coordenadas: { Latitude: -3.07, Longitude: -60.02 },
    Regiao: "Norte",
    Distribuicao_Localizacao: { Capital: 12.1, Interior: 87.9 },
    Distribuicao_Porte_Populacional: {
      Ate_20k: 3.9,
      Entre_20k_e_100k: 87.9,
      Entre_100k_e_500k: 8.1,
      Mais_de_500k: 0.0,
    },
    Distribuicao_Porte_Hospitalar: {
      Ate_50_leitos: 62.2,
      Entre_51_e_150_leitos: 35.7,
      Entre_151_e_500_leitos: 2.1,
      Mais_de_500_leitos: 0.0,
    },
    Tipo_Hospital: { Geral: 17.6, Especializado: 30.7, Hospital_Dia: 51.7 },
    Tipo_Atendimento: { SUS: 54.9, Nao_SUS: 45.1 },
  },
  Bahia: {
    Hospitais_Privados_2024: 385,
    Leitos_Privados_2024: 13169,
    Coordenadas: { Latitude: -12.97, Longitude: -38.5011 },
    Regiao: "Nordeste",
    Distribuicao_Localizacao: { Capital: 75.5, Interior: 24.5 },
    Distribuicao_Porte_Populacional: {
      Ate_20k: 35.0,
      Entre_20k_e_100k: 25.6,
      Entre_100k_e_500k: 32.3,
      Mais_de_500k: 7.1,
    },
    Distribuicao_Porte_Hospitalar: {
      Ate_50_leitos: 0.4,
      Entre_51_e_150_leitos: 71.6,
      Entre_151_e_500_leitos: 24.7,
      Mais_de_500_leitos: 3.3,
    },
    Tipo_Hospital: { Geral: 28.4, Especializado: 15.5, Hospital_Dia: 56.1 },
    Tipo_Atendimento: { SUS: 39.6, Nao_SUS: 60.4 },
  },
  Ceará: {
    Hospitais_Privados_2024: 140,
    Leitos_Privados_2024: 9074,
    Coordenadas: { Latitude: -3.717, Longitude: -38.543 },
    Regiao: "Nordeste",
    Distribuicao_Localizacao: { Capital: 52.2, Interior: 47.8 },
    Distribuicao_Porte_Populacional: {
      Ate_20k: 33.3,
      Entre_20k_e_100k: 17.2,
      Entre_100k_e_500k: 47.8,
      Mais_de_500k: 1.7,
    },
    Distribuicao_Porte_Hospitalar: {
      Ate_50_leitos: 50.4,
      Entre_51_e_150_leitos: 40.5,
      Entre_151_e_500_leitos: 9.1,
      Mais_de_500_leitos: 0.0,
    },
    Tipo_Hospital: { Geral: 32.7, Especializado: 59.3, Hospital_Dia: 8.0 },
    Tipo_Atendimento: { SUS: 38.1, Nao_SUS: 61.9 },
  },
  "Distrito Federal": {
    Hospitais_Privados_2024: 87,
    Leitos_Privados_2024: 4519,
    Coordenadas: { Latitude: -15.7939, Longitude: -47.8828 },
    Regiao: "Centro-Oeste",
    Distribuicao_Localizacao: { Capital: 100.0, Interior: 0.0 },
    Distribuicao_Porte_Populacional: {
      Ate_20k: 0.0,
      Entre_20k_e_100k: 0.0,
      Entre_100k_e_500k: 0.0,
      Mais_de_500k: 100.0,
    },
    Distribuicao_Porte_Hospitalar: {
      Ate_50_leitos: 0.7,
      Entre_51_e_150_leitos: 62.3,
      Entre_151_e_500_leitos: 27.0,
      Mais_de_500_leitos: 10.1,
    },
    Tipo_Hospital: { Geral: 30.2, Especializado: 33.6, Hospital_Dia: 36.2 },
    Tipo_Atendimento: { SUS: 76.6, Nao_SUS: 23.4 },
  },
  "Espírito Santo": {
    Hospitais_Privados_2024: 87,
    Leitos_Privados_2024: 5378,
    Coordenadas: { Latitude: -19.9191, Longitude: -43.9345 },
    Regiao: "Sudeste",
    Distribuicao_Localizacao: { Capital: 8.8, Interior: 91.2 },
    Distribuicao_Porte_Populacional: {
      Ate_20k: 27.8,
      Entre_20k_e_100k: 54.8,
      Entre_100k_e_500k: 5.4,
      Mais_de_500k: 12.0,
    },
    Distribuicao_Porte_Hospitalar: {
      Ate_50_leitos: 51.9,
      Entre_51_e_150_leitos: 39.2,
      Entre_151_e_500_leitos: 9.0,
      Mais_de_500_leitos: 0.0,
    },
    Tipo_Hospital: { Geral: 13.7, Especializado: 80.7, Hospital_Dia: 5.6 },
    Tipo_Atendimento: { SUS: 36.5, Nao_SUS: 63.5 },
  },
  Goiás: {
    Hospitais_Privados_2024: 250,
    Leitos_Privados_2024: 10426,
    Coordenadas: { Latitude: -16.6864, Longitude: -49.2643 },
    Regiao: "Centro-Oeste",
    Distribuicao_Localizacao: { Capital: 58.4, Interior: 41.6 },
    Distribuicao_Porte_Populacional: {
      Ate_20k: 30.9,
      Entre_20k_e_100k: 16.2,
      Entre_100k_e_500k: 44.2,
      Mais_de_500k: 8.6,
    },
    Distribuicao_Porte_Hospitalar: {
      Ate_50_leitos: 72.9,
      Entre_51_e_150_leitos: 22.8,
      Entre_151_e_500_leitos: 4.3,
      Mais_de_500_leitos: 0.0,
    },
    Tipo_Hospital: { Geral: 30.6, Especializado: 64.1, Hospital_Dia: 5.3 },
    Tipo_Atendimento: { SUS: 45.5, Nao_SUS: 54.5 },
  },
  Maranhão: {
    Hospitais_Privados_2024: 65,
    Leitos_Privados_2024: 3933,
    Coordenadas: { Latitude: -2.5307, Longitude: -44.3068 },
    Regiao: "Nordeste",
    Distribuicao_Localizacao: { Capital: 52.3, Interior: 47.7 },
    Distribuicao_Porte_Populacional: {
      Ate_20k: 28.2,
      Entre_20k_e_100k: 17.5,
      Entre_100k_e_500k: 47.7,
      Mais_de_500k: 6.7,
    },
    Distribuicao_Porte_Hospitalar: {
      Ate_50_leitos: 61.1,
      Entre_51_e_150_leitos: 32.1,
      Entre_151_e_500_leitos: 6.8,
      Mais_de_500_leitos: 0.0,
    },
    Tipo_Hospital: { Geral: 24.2, Especializado: 66.4, Hospital_Dia: 9.4 },
    Tipo_Atendimento: { SUS: 47.4, Nao_SUS: 52.6 },
  },
  "Mato Grosso do Sul": {
    Hospitais_Privados_2024: 79,
    Leitos_Privados_2024: 4314,
    Coordenadas: { Latitude: -20.7722, Longitude: -54.7852 },
    Regiao: "Centro-Oeste",
    Distribuicao_Localizacao: { Capital: 74.3, Interior: 25.7 },
    Distribuicao_Porte_Populacional: {
      Ate_20k: 35.1,
      Entre_20k_e_100k: 15.4,
      Entre_100k_e_500k: 25.7,
      Mais_de_500k: 23.7,
    },
    Distribuicao_Porte_Hospitalar: {
      Ate_50_leitos: 1.2,
      Entre_51_e_150_leitos: 70.8,
      Entre_151_e_500_leitos: 22.6,
      Mais_de_500_leitos: 5.3,
    },
    Tipo_Hospital: { Geral: 12.6, Especializado: 84.2, Hospital_Dia: 3.2 },
    Tipo_Atendimento: { SUS: 38.0, Nao_SUS: 62.0 },
  },
  "Mato Grosso": {
    Hospitais_Privados_2024: 98,
    Leitos_Privados_2024: 3890,
    Coordenadas: { Latitude: -12.6819, Longitude: -56.9211 },
    Regiao: "Centro-Oeste",
    Distribuicao_Localizacao: { Capital: 78.2, Interior: 21.8 },
    Distribuicao_Porte_Populacional: {
      Ate_20k: 43.6,
      Entre_20k_e_100k: 12.3,
      Entre_100k_e_500k: 21.8,
      Mais_de_500k: 22.4,
    },
    Distribuicao_Porte_Hospitalar: {
      Ate_50_leitos: 77.9,
      Entre_51_e_150_leitos: 19.6,
      Entre_151_e_500_leitos: 2.5,
      Mais_de_500_leitos: 0.0,
    },
    Tipo_Hospital: { Geral: 10.6, Especializado: 85.2, Hospital_Dia: 4.2 },
    Tipo_Atendimento: { SUS: 42.5, Nao_SUS: 57.5 },
  },
  "Minas Gerais": {
    Hospitais_Privados_2024: 582,
    Leitos_Privados_2024: 32569,
    Coordenadas: { Latitude: -18.5122, Longitude: -44.555 },
    Regiao: "Sudeste",
    Distribuicao_Localizacao: { Capital: 86.3, Interior: 13.7 },
    Distribuicao_Porte_Populacional: {
      Ate_20k: 31.2,
      Entre_20k_e_100k: 20.2,
      Entre_100k_e_500k: 21.8,
      Mais_de_500k: 26.9,
    },
    Distribuicao_Porte_Hospitalar: {
      Ate_50_leitos: 0.2,
      Entre_51_e_150_leitos: 58.2,
      Entre_151_e_500_leitos: 34.7,
      Mais_de_500_leitos: 6.9,
    },
    Tipo_Hospital: { Geral: 13.1, Especializado: 77.4, Hospital_Dia: 9.5 },
    Tipo_Atendimento: { SUS: 29.2, Nao_SUS: 70.8 },
  },
  Pará: {
    Hospitais_Privados_2024: 121,
    Leitos_Privados_2024: 6304,
    Coordenadas: { Latitude: -3.4168, Longitude: -52.0976 },
    Regiao: "Norte",
    Distribuicao_Localizacao: { Capital: 75.0, Interior: 25.0 },
    Distribuicao_Porte_Populacional: {
      Ate_20k: 35.1,
      Entre_20k_e_100k: 34.6,
      Entre_100k_e_500k: 28.8,
      Mais_de_500k: 1.5,
    },
    Distribuicao_Porte_Hospitalar: {
      Ate_50_leitos: 53.1,
      Entre_51_e_150_leitos: 41.3,
      Entre_151_e_500_leitos: 5.6,
      Mais_de_500_leitos: 0.0,
    },
    Tipo_Hospital: { Geral: 17.9, Especializado: 77.5, Hospital_Dia: 4.6 },
    Tipo_Atendimento: { SUS: 42.5, Nao_SUS: 57.5 },
  },
  Paraíba: {
    Hospitais_Privados_2024: 80,
    Leitos_Privados_2024: 3658,
    Coordenadas: { Latitude: -7.1201, Longitude: -34.8731 },
    Regiao: "Nordeste",
    Distribuicao_Localizacao: { Capital: 58.1, Interior: 41.9 },
    Distribuicao_Porte_Populacional: {
      Ate_20k: 17.1,
      Entre_20k_e_100k: 25.0,
      Entre_100k_e_500k: 41.9,
      Mais_de_500k: 16.0,
    },
    Distribuicao_Porte_Hospitalar: {
      Ate_50_leitos: 66.5,
      Entre_51_e_150_leitos: 25.8,
      Entre_151_e_500_leitos: 7.7,
      Mais_de_500_leitos: 0.0,
    },
    Tipo_Hospital: { Geral: 15.8, Especializado: 34.9, Hospital_Dia: 49.3 },
    Tipo_Atendimento: { SUS: 33.7, Nao_SUS: 66.3 },
  },
  Paraná: {
    Hospitais_Privados_2024: 324,
    Leitos_Privados_2024: 19962,
    Coordenadas: { Latitude: -24.8949, Longitude: -51.9253 },
    Regiao: "Sul",
    Distribuicao_Localizacao: { Capital: 80.9, Interior: 19.1 },
    Distribuicao_Porte_Populacional: {
      Ate_20k: 27.4,
      Entre_20k_e_100k: 23.7,
      Entre_100k_e_500k: 25.9,
      Mais_de_500k: 23.0,
    },
    Distribuicao_Porte_Hospitalar: {
      Ate_50_leitos: 0.3,
      Entre_51_e_150_leitos: 57.6,
      Entre_151_e_500_leitos: 34.8,
      Mais_de_500_leitos: 7.3,
    },
    Tipo_Hospital: { Geral: 11.6, Especializado: 13.8, Hospital_Dia: 74.5 },
    Tipo_Atendimento: { SUS: 32.7, Nao_SUS: 67.3 },
  },
  Pernambuco: {
    Hospitais_Privados_2024: 161,
    Leitos_Privados_2024: 10280,
    Coordenadas: { Latitude: -8.0476, Longitude: -34.877 },
    Regiao: "Nordeste",
    Distribuicao_Localizacao: { Capital: 64.5, Interior: 35.5 },
    Distribuicao_Porte_Populacional: {
      Ate_20k: 29.6,
      Entre_20k_e_100k: 30.3,
      Entre_100k_e_500k: 39.7,
      Mais_de_500k: 0.4,
    },
    Distribuicao_Porte_Hospitalar: {
      Ate_50_leitos: 1.3,
      Entre_51_e_150_leitos: 56.2,
      Entre_151_e_500_leitos: 32.7,
      Mais_de_500_leitos: 9.8,
    },
    Tipo_Hospital: { Geral: 28.3, Especializado: 67.6, Hospital_Dia: 4.1 },
    Tipo_Atendimento: { SUS: 46.0, Nao_SUS: 54.0 },
  },
  Piauí: {
    Hospitais_Privados_2024: 55,
    Leitos_Privados_2024: 2455,
    Coordenadas: { Latitude: -6.5989, Longitude: -42.8431 },
    Regiao: "Nordeste",
    Distribuicao_Localizacao: { Capital: 61.7, Interior: 38.3 },
    Distribuicao_Porte_Populacional: {
      Ate_20k: 38.5,
      Entre_20k_e_100k: 10.5,
      Entre_100k_e_500k: 38.3,
      Mais_de_500k: 12.7,
    },
    Distribuicao_Porte_Hospitalar: {
      Ate_50_leitos: 76.2,
      Entre_51_e_150_leitos: 19.7,
      Entre_151_e_500_leitos: 4.1,
      Mais_de_500_leitos: 0.0,
    },
    Tipo_Hospital: { Geral: 23.1, Especializado: 72.1, Hospital_Dia: 4.9 },
    Tipo_Atendimento: { SUS: 26.2, Nao_SUS: 73.8 },
  },
  "Rio de Janeiro": {
    Hospitais_Privados_2024: 345,
    Leitos_Privados_2024: 17817,
    Coordenadas: { Latitude: -22.9068, Longitude: -43.1729 },
    Regiao: "Sudeste",
    Distribuicao_Localizacao: { Capital: 57.1, Interior: 42.9 },
    Distribuicao_Porte_Populacional: {
      Ate_20k: 9.9,
      Entre_20k_e_100k: 29.3,
      Entre_100k_e_500k: 58.1,
      Mais_de_500k: 2.6,
    },
    Distribuicao_Porte_Hospitalar: {
      Ate_50_leitos: 0.2,
      Entre_51_e_150_leitos: 56.4,
      Entre_151_e_500_leitos: 34.3,
      Mais_de_500_leitos: 9.0,
    },
    Tipo_Hospital: { Geral: 30.7, Especializado: 60.7, Hospital_Dia: 8.6 },
    Tipo_Atendimento: { SUS: 68.4, Nao_SUS: 31.6 },
  },
  "Rio Grande do Norte": {
    Hospitais_Privados_2024: 65,
    Leitos_Privados_2024: 3189,
    Coordenadas: { Latitude: -5.7945, Longitude: -35.211 },
    Regiao: "Nordeste",
    Distribuicao_Localizacao: { Capital: 44.8, Interior: 55.2 },
    Distribuicao_Porte_Populacional: {
      Ate_20k: 12.5,
      Entre_20k_e_100k: 15.9,
      Entre_100k_e_500k: 55.2,
      Mais_de_500k: 16.3,
    },
    Distribuicao_Porte_Hospitalar: {
      Ate_50_leitos: 58.3,
      Entre_51_e_150_leitos: 35.0,
      Entre_151_e_500_leitos: 6.7,
      Mais_de_500_leitos: 0.0,
    },
    Tipo_Hospital: { Geral: 22.8, Especializado: 29.6, Hospital_Dia: 47.7 },
    Tipo_Atendimento: { SUS: 26.2, Nao_SUS: 73.8 },
  },
  "Rio Grande do Sul": {
    Hospitais_Privados_2024: 300,
    Leitos_Privados_2024: 25950,
    Coordenadas: { Latitude: -30.0346, Longitude: -51.2177 },
    Regiao: "Sul",
    Distribuicao_Localizacao: { Capital: 9.1, Interior: 90.9 },
    Distribuicao_Porte_Populacional: {
      Ate_20k: 30.9,
      Entre_20k_e_100k: 15.9,
      Entre_100k_e_500k: 10.5,
      Mais_de_500k: 42.8,
    },
    Distribuicao_Porte_Hospitalar: {
      Ate_50_leitos: 1.3,
      Entre_51_e_150_leitos: 39.7,
      Entre_151_e_500_leitos: 46.5,
      Mais_de_500_leitos: 12.6,
    },
    Tipo_Hospital: { Geral: 90.9, Especializado: 3.9, Hospital_Dia: 0.0 },
    Tipo_Atendimento: { SUS: 11.3, Nao_SUS: 88.7 },
  },
  Rondônia: {
    Hospitais_Privados_2024: 61,
    Leitos_Privados_2024: 1436,
    Coordenadas: { Latitude: -11.5057, Longitude: -63.5806 },
    Regiao: "Norte",
    Distribuicao_Localizacao: { Capital: 71.6, Interior: 28.4 },
    Distribuicao_Porte_Populacional: {
      Ate_20k: 43.4,
      Entre_20k_e_100k: 34.7,
      Entre_100k_e_500k: 20.1,
      Mais_de_500k: 1.9,
    },
    Distribuicao_Porte_Hospitalar: {
      Ate_50_leitos: 88.1,
      Entre_51_e_150_leitos: 10.7,
      Entre_151_e_500_leitos: 1.2,
      Mais_de_500_leitos: 0.0,
    },
    Tipo_Hospital: { Geral: 10.9, Especializado: 80.6, Hospital_Dia: 8.6 },
    Tipo_Atendimento: { SUS: 73.4, Nao_SUS: 26.6 },
  },
  Roraima: {
    Hospitais_Privados_2024: 4,
    Leitos_Privados_2024: 310,
    Coordenadas: { Latitude: 2.8235, Longitude: -60.6753 },
    Regiao: "Norte",
    Distribuicao_Localizacao: { Capital: 100.0, Interior: 0.0 },
    Distribuicao_Porte_Populacional: {
      Ate_20k: 0.0,
      Entre_20k_e_100k: 0.0,
      Entre_100k_e_500k: 100.0,
      Mais_de_500k: 0.0,
    },
    Distribuicao_Porte_Hospitalar: {
      Ate_50_leitos: 70.7,
      Entre_51_e_150_leitos: 19.5,
      Entre_151_e_500_leitos: 9.8,
      Mais_de_500_leitos: 0.0,
    },
    Tipo_Hospital: { Geral: 95.1, Especializado: 4.9, Hospital_Dia: 0.0 },
    Tipo_Atendimento: { SUS: 63.4, Nao_SUS: 36.6 },
  },
  "Santa Catarina": {
    Hospitais_Privados_2024: 238,
    Leitos_Privados_2024: 12207,
    Coordenadas: { Latitude: -27.5954, Longitude: -48.548 },
    Regiao: "Sul",
    Distribuicao_Localizacao: { Capital: 87.9, Interior: 12.1 },
    Distribuicao_Porte_Populacional: {
      Ate_20k: 24.4,
      Entre_20k_e_100k: 26.8,
      Entre_100k_e_500k: 9.4,
      Mais_de_500k: 39.5,
    },
    Distribuicao_Porte_Hospitalar: {
      Ate_50_leitos: 60.9,
      Entre_51_e_150_leitos: 32.5,
      Entre_151_e_500_leitos: 6.6,
      Mais_de_500_leitos: 0.0,
    },
    Tipo_Hospital: { Geral: 15.2, Especializado: 77.6, Hospital_Dia: 7.2 },
    Tipo_Atendimento: { SUS: 25.7, Nao_SUS: 74.3 },
  },
  "São Paulo": {
    Hospitais_Privados_2024: 896,
    Leitos_Privados_2024: 65755,
    Coordenadas: { Latitude: -23.5505, Longitude: -46.6333 },
    Regiao: "Sudeste",
    Distribuicao_Localizacao: { Capital: 79.3, Interior: 20.7 },
    Distribuicao_Porte_Populacional: {
      Ate_20k: 23.3,
      Entre_20k_e_100k: 29.9,
      Entre_100k_e_500k: 36.0,
      Mais_de_500k: 10.8,
    },
    Distribuicao_Porte_Hospitalar: {
      Ate_50_leitos: 47.5,
      Entre_51_e_150_leitos: 1.2,
      Entre_151_e_500_leitos: 38.1,
      Mais_de_500_leitos: 13.2,
    },
    Tipo_Hospital: { Geral: 15.4, Especializado: 15.3, Hospital_Dia: 69.3 },
    Tipo_Atendimento: { SUS: 50.6, Nao_SUS: 49.4 },
  },
  Sergipe: {
    Hospitais_Privados_2024: 47,
    Leitos_Privados_2024: 1836,
    Coordenadas: { Latitude: -10.9472, Longitude: -37.0731 },
    Regiao: "Nordeste",
    Distribuicao_Localizacao: { Capital: 36.0, Interior: 64.0 },
    Distribuicao_Porte_Populacional: {
      Ate_20k: 25.1,
      Entre_20k_e_100k: 6.8,
      Entre_100k_e_500k: 64.0,
      Mais_de_500k: 4.1,
    },
    Distribuicao_Porte_Hospitalar: {
      Ate_50_leitos: 63.7,
      Entre_51_e_150_leitos: 27.2,
      Entre_151_e_500_leitos: 9.2,
      Mais_de_500_leitos: 0.0,
    },
    Tipo_Hospital: { Geral: 36.9, Especializado: 17.2, Hospital_Dia: 45.8 },
    Tipo_Atendimento: { SUS: 26.3, Nao_SUS: 73.7 },
  },
  Tocantins: {
    Hospitais_Privados_2024: 31,
    Leitos_Privados_2024: 896,
    Coordenadas: { Latitude: -10.1753, Longitude: -48.2982 },
    Regiao: "Norte",
    Distribuicao_Localizacao: { Capital: 42.3, Interior: 57.7 },
    Distribuicao_Porte_Populacional: {
      Ate_20k: 24.9,
      Entre_20k_e_100k: 75.1,
      Entre_100k_e_500k: 0.0,
      Mais_de_500k: 0.0,
    },
    Distribuicao_Porte_Hospitalar: {
      Ate_50_leitos: 77.7,
      Entre_51_e_150_leitos: 16.8,
      Entre_151_e_500_leitos: 5.5,
      Mais_de_500_leitos: 0.0,
    },
    Tipo_Hospital: { Geral: 15.4, Especializado: 82.9, Hospital_Dia: 1.7 },
    Tipo_Atendimento: { SUS: 67.2, Nao_SUS: 32.8 },
  },
}

// Carregar dados reais embutidos
export async function loadRealHospitalData(): Promise<Record<string, HospitalData>> {
  return hospitalData
}

// Obter lista de todos os estados
export function getAllStates() {
  const states = Object.keys(hospitalData).map((key) => {
    const data = hospitalData[key]
    return {
      id: key.toLowerCase().replace(/\s+/g, "-"),
      name: key,
      region: data.Regiao,
    }
  })
  return states.sort((a, b) => a.name.localeCompare(b.name))
}

// Obter dados de gráfico para um estado específico
export function getStateChartData(stateId: string): StateChartData | null {
  // Encontrar o estado pelo ID
  const stateKey = Object.keys(hospitalData).find(
    (key) => key.toLowerCase().replace(/\s+/g, "-") === stateId.toLowerCase(),
  )

  if (!stateKey) return null

  const data = hospitalData[stateKey]

  // Calcular densidade de leitos (estimativa baseada em população média)
  const estimatedPopulation = getEstimatedPopulation(stateKey)
  const bedsPerThousand = (data.Leitos_Privados_2024 / estimatedPopulation) * 1000

  return {
    id: stateId,
    name: stateKey,
    region: data.Regiao,
    hospitals: data.Hospitais_Privados_2024,
    beds: data.Leitos_Privados_2024,
    bedsPerThousand: Math.round(bedsPerThousand * 10) / 10,
    coordinates: data.Coordenadas,
    locationDistribution: [
      { name: "Capital", value: data.Distribuicao_Localizacao.Capital },
      { name: "Interior", value: data.Distribuicao_Localizacao.Interior },
    ],
    populationDistribution: [
      { name: "Até 20k", value: data.Distribuicao_Porte_Populacional.Ate_20k },
      { name: "20k-100k", value: data.Distribuicao_Porte_Populacional.Entre_20k_e_100k },
      { name: "100k-500k", value: data.Distribuicao_Porte_Populacional.Entre_100k_e_500k },
      { name: "Mais de 500k", value: data.Distribuicao_Porte_Populacional.Mais_de_500k },
    ],
    hospitalSizeDistribution: [
      { name: "Até 50 leitos", value: data.Distribuicao_Porte_Hospitalar.Ate_50_leitos },
      { name: "51-150 leitos", value: data.Distribuicao_Porte_Hospitalar.Entre_51_e_150_leitos },
      { name: "151-500 leitos", value: data.Distribuicao_Porte_Hospitalar.Entre_151_e_500_leitos },
      { name: "Mais de 500 leitos", value: data.Distribuicao_Porte_Hospitalar.Mais_de_500_leitos },
    ],
    hospitalTypeDistribution: [
      { name: "Geral", value: data.Tipo_Hospital.Geral },
      { name: "Especializado", value: data.Tipo_Hospital.Especializado },
      { name: "Hospital Dia", value: data.Tipo_Hospital.Hospital_Dia },
    ],
    serviceTypeDistribution: [
      { name: "SUS", value: data.Tipo_Atendimento.SUS },
      { name: "Não SUS", value: data.Tipo_Atendimento.Nao_SUS },
    ],
  }
}

// Calcular estatísticas regionais
export function calculateRegionalStats(data: Record<string, HospitalData>) {
  const regions: Record<string, any> = {}

  Object.entries(data).forEach(([state, stateData]) => {
    const region = stateData.Regiao
    if (!regions[region]) {
      regions[region] = {
        id: region.toLowerCase().replace(/\s+/g, "-"),
        name: region,
        hospitals: 0,
        totalBeds: 0,
        states: [],
      }
    }

    regions[region].hospitals += stateData.Hospitais_Privados_2024
    regions[region].totalBeds += stateData.Leitos_Privados_2024
    regions[region].states.push(state)
  })

  return regions
}

// Função auxiliar para obter população estimada
function getEstimatedPopulation(state: string): number {
  // Estimativas populacionais aproximadas (em milhares)
  const populations: Record<string, number> = {
    "São Paulo": 46649,
    "Minas Gerais": 21411,
    "Rio de Janeiro": 17463,
    Bahia: 14985,
    Paraná: 11597,
    "Rio Grande do Sul": 11466,
    Pernambuco: 9674,
    Ceará: 9240,
    Pará: 8777,
    "Santa Catarina": 7338,
    Maranhão: 7153,
    Goiás: 7206,
    Paraíba: 4059,
    "Espírito Santo": 4108,
    Piauí: 3289,
    Alagoas: 3365,
    "Rio Grande do Norte": 3560,
    "Mato Grosso": 3567,
    "Mato Grosso do Sul": 2839,
    "Distrito Federal": 3094,
    Sergipe: 2338,
    Rondônia: 1815,
    Tocantins: 1607,
    Acre: 906,
    Amapá: 877,
    Roraima: 652,
  }
  return populations[state] || 1000
}

// Funções de compatibilidade para Firebase (não utilizadas)
export async function importRealDataToFirebase() {
  console.log("Função de compatibilidade - dados já carregados localmente")
  return { success: true, message: "Dados carregados com sucesso" }
}

export async function checkRealDataImported() {
  const totalStates = Object.keys(hospitalData).length
  const totalHospitals = Object.values(hospitalData).reduce((sum, state) => sum + state.Hospitais_Privados_2024, 0)
  const totalBeds = Object.values(hospitalData).reduce((sum, state) => sum + state.Leitos_Privados_2024, 0)

  return {
    imported: true,
    totalStates,
    totalHospitals,
    totalBeds,
  }
}
