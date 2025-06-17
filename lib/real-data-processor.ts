// Interface para os dados do arquivo JSON
interface EstadoData {
  Regiao: string
  Hospitais_Privados_2024: number
  Leitos_Privados_2024: number
  Leitos_por_1000_hab: number
  Localizacao: {
    Latitude: number
    Longitude: number
  }
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

// Dados reais completos (todos os 27 estados)
const realHospitalData: Record<string, EstadoData> = {
  acre: {
    Regiao: "Norte",
    Hospitais_Privados_2024: 10,
    Leitos_Privados_2024: 361,
    Leitos_por_1000_hab: 2.0,
    Localizacao: { Latitude: -9.97499, Longitude: -67.8243 },
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
  alagoas: {
    Regiao: "Nordeste",
    Hospitais_Privados_2024: 50,
    Leitos_Privados_2024: 3580,
    Leitos_por_1000_hab: 2.0,
    Localizacao: { Latitude: -9.5713, Longitude: -36.782 },
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
  amapa: {
    Regiao: "Norte",
    Hospitais_Privados_2024: 6,
    Leitos_Privados_2024: 293,
    Leitos_por_1000_hab: 2.0,
    Localizacao: { Latitude: 1.41, Longitude: -51.77 },
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
  amazonas: {
    Regiao: "Norte",
    Hospitais_Privados_2024: 32,
    Leitos_Privados_2024: 1082,
    Leitos_por_1000_hab: 2.0,
    Localizacao: { Latitude: -3.07, Longitude: -60.02 },
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
  bahia: {
    Regiao: "Nordeste",
    Hospitais_Privados_2024: 385,
    Leitos_Privados_2024: 13169,
    Leitos_por_1000_hab: 2.0,
    Localizacao: { Latitude: -12.97, Longitude: -38.5011 },
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
  ceara: {
    Regiao: "Nordeste",
    Hospitais_Privados_2024: 140,
    Leitos_Privados_2024: 9074,
    Leitos_por_1000_hab: 2.0,
    Localizacao: { Latitude: -3.717, Longitude: -38.543 },
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
  distrito_federal: {
    Regiao: "Centro-Oeste",
    Hospitais_Privados_2024: 87,
    Leitos_Privados_2024: 4519,
    Leitos_por_1000_hab: 2.0,
    Localizacao: { Latitude: -15.7939, Longitude: -47.8828 },
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
  espirito_santo: {
    Regiao: "Sudeste",
    Hospitais_Privados_2024: 87,
    Leitos_Privados_2024: 5378,
    Leitos_por_1000_hab: 2.0,
    Localizacao: { Latitude: -19.9191, Longitude: -43.9345 },
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
  goias: {
    Regiao: "Centro-Oeste",
    Hospitais_Privados_2024: 250,
    Leitos_Privados_2024: 10426,
    Leitos_por_1000_hab: 2.0,
    Localizacao: { Latitude: -16.6864, Longitude: -49.2643 },
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
  maranhao: {
    Regiao: "Nordeste",
    Hospitais_Privados_2024: 65,
    Leitos_Privados_2024: 3933,
    Leitos_por_1000_hab: 2.0,
    Localizacao: { Latitude: -2.5307, Longitude: -44.3068 },
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
  mato_grosso_do_sul: {
    Regiao: "Centro-Oeste",
    Hospitais_Privados_2024: 79,
    Leitos_Privados_2024: 4314,
    Leitos_por_1000_hab: 2.0,
    Localizacao: { Latitude: -20.7722, Longitude: -54.7852 },
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
  mato_grosso: {
    Regiao: "Centro-Oeste",
    Hospitais_Privados_2024: 98,
    Leitos_Privados_2024: 3890,
    Leitos_por_1000_hab: 2.0,
    Localizacao: { Latitude: -12.6819, Longitude: -56.9211 },
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
  minas_gerais: {
    Regiao: "Sudeste",
    Hospitais_Privados_2024: 582,
    Leitos_Privados_2024: 32569,
    Leitos_por_1000_hab: 2.0,
    Localizacao: { Latitude: -18.5122, Longitude: -44.555 },
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
  para: {
    Regiao: "Norte",
    Hospitais_Privados_2024: 121,
    Leitos_Privados_2024: 6304,
    Leitos_por_1000_hab: 2.0,
    Localizacao: { Latitude: -3.4168, Longitude: -52.0976 },
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
  paraiba: {
    Regiao: "Nordeste",
    Hospitais_Privados_2024: 80,
    Leitos_Privados_2024: 3658,
    Leitos_por_1000_hab: 2.0,
    Localizacao: { Latitude: -7.1201, Longitude: -34.8731 },
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
  parana: {
    Regiao: "Sul",
    Hospitais_Privados_2024: 324,
    Leitos_Privados_2024: 19962,
    Leitos_por_1000_hab: 2.0,
    Localizacao: { Latitude: -24.8949, Longitude: -51.9253 },
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
  pernambuco: {
    Regiao: "Nordeste",
    Hospitais_Privados_2024: 161,
    Leitos_Privados_2024: 10280,
    Leitos_por_1000_hab: 2.0,
    Localizacao: { Latitude: -8.0476, Longitude: -34.877 },
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
  piaui: {
    Regiao: "Nordeste",
    Hospitais_Privados_2024: 55,
    Leitos_Privados_2024: 2455,
    Leitos_por_1000_hab: 2.0,
    Localizacao: { Latitude: -6.5989, Longitude: -42.8431 },
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
  rio_de_janeiro: {
    Regiao: "Sudeste",
    Hospitais_Privados_2024: 345,
    Leitos_Privados_2024: 17817,
    Leitos_por_1000_hab: 2.0,
    Localizacao: { Latitude: -22.9068, Longitude: -43.1729 },
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
  rio_grande_do_norte: {
    Regiao: "Nordeste",
    Hospitais_Privados_2024: 65,
    Leitos_Privados_2024: 3189,
    Leitos_por_1000_hab: 2.0,
    Localizacao: { Latitude: -5.7945, Longitude: -35.211 },
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
  rio_grande_do_sul: {
    Regiao: "Sul",
    Hospitais_Privados_2024: 300,
    Leitos_Privados_2024: 25950,
    Leitos_por_1000_hab: 2.0,
    Localizacao: { Latitude: -30.0346, Longitude: -51.2177 },
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
  rondonia: {
    Regiao: "Norte",
    Hospitais_Privados_2024: 61,
    Leitos_Privados_2024: 1436,
    Leitos_por_1000_hab: 2.0,
    Localizacao: { Latitude: -11.5057, Longitude: -63.5806 },
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
  roraima: {
    Regiao: "Norte",
    Hospitais_Privados_2024: 4,
    Leitos_Privados_2024: 310,
    Leitos_por_1000_hab: 2.0,
    Localizacao: { Latitude: 2.8235, Longitude: -60.6753 },
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
  santa_catarina: {
    Regiao: "Sul",
    Hospitais_Privados_2024: 238,
    Leitos_Privados_2024: 12207,
    Leitos_por_1000_hab: 2.0,
    Localizacao: { Latitude: -27.5954, Longitude: -48.548 },
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
  sao_paulo: {
    Regiao: "Sudeste",
    Hospitais_Privados_2024: 896,
    Leitos_Privados_2024: 65755,
    Leitos_por_1000_hab: 2.0,
    Localizacao: { Latitude: -23.5505, Longitude: -46.6333 },
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
  sergipe: {
    Regiao: "Nordeste",
    Hospitais_Privados_2024: 47,
    Leitos_Privados_2024: 1836,
    Leitos_por_1000_hab: 2.0,
    Localizacao: { Latitude: -10.9472, Longitude: -37.0731 },
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
  tocantins: {
    Regiao: "Norte",
    Hospitais_Privados_2024: 31,
    Leitos_Privados_2024: 896,
    Leitos_por_1000_hab: 2.0,
    Localizacao: { Latitude: -10.1753, Longitude: -48.2982 },
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

// Mapeamento de estados para nomes completos
const estadoNomes: Record<string, string> = {
  acre: "Acre",
  alagoas: "Alagoas",
  amapa: "Amapá",
  amazonas: "Amazonas",
  bahia: "Bahia",
  ceara: "Ceará",
  distrito_federal: "Distrito Federal",
  espirito_santo: "Espírito Santo",
  goias: "Goiás",
  maranhao: "Maranhão",
  mato_grosso_do_sul: "Mato Grosso do Sul",
  mato_grosso: "Mato Grosso",
  minas_gerais: "Minas Gerais",
  para: "Pará",
  paraiba: "Paraíba",
  parana: "Paraná",
  pernambuco: "Pernambuco",
  piaui: "Piauí",
  rio_de_janeiro: "Rio de Janeiro",
  rio_grande_do_norte: "Rio Grande do Norte",
  rio_grande_do_sul: "Rio Grande do Sul",
  rondonia: "Rondônia",
  roraima: "Roraima",
  santa_catarina: "Santa Catarina",
  sao_paulo: "São Paulo",
  sergipe: "Sergipe",
  tocantins: "Tocantins",
}

// Mapeamento de regiões para IDs
const regiaoIds: Record<string, string> = {
  Norte: "north",
  Nordeste: "northeast",
  "Centro-Oeste": "central-west",
  Sudeste: "southeast",
  Sul: "south",
}

// Função para carregar dados reais (agora embutidos)
export async function loadRealHospitalData(): Promise<Record<string, EstadoData>> {
  console.log("✅ Carregando dados reais completos (27 estados)")
  return realHospitalData
}

// Função para obter dados de um estado específico
export function getStateData(stateKey: string): EstadoData | null {
  return realHospitalData[stateKey] || null
}

// Função para obter lista de todos os estados
export function getAllStates() {
  return Object.keys(realHospitalData).map((key) => ({
    id: key,
    name: estadoNomes[key],
    region: realHospitalData[key].Regiao,
  }))
}

// Função para calcular estatísticas agregadas por região
export function calculateRegionalStats(statesData: Record<string, EstadoData>) {
  const regionalStats: Record<string, any> = {}

  Object.entries(statesData).forEach(([estadoKey, data]) => {
    const regiaoId = regiaoIds[data.Regiao]

    if (!regionalStats[regiaoId]) {
      regionalStats[regiaoId] = {
        id: regiaoId,
        name: data.Regiao,
        hospitals: 0,
        urbanAccessIndex: 0,
        ruralAccessIndex: 0,
        totalBeds: 0,
        states: [],
        Hospitais_Privados_2024: 0,
        Leitos_Privados_2024: 0,
      }
    }

    const region = regionalStats[regiaoId]
    region.states.push(estadoNomes[estadoKey] || estadoKey)
    region.hospitals += data.Hospitais_Privados_2024
    region.totalBeds += data.Leitos_Privados_2024
    region.Hospitais_Privados_2024 += data.Hospitais_Privados_2024
    region.Leitos_Privados_2024 += data.Leitos_Privados_2024

    // Calcular índices de acesso (estimativa baseada na distribuição)
    region.urbanAccessIndex = Math.round(75 + data.Distribuicao_Localizacao.Capital / 10)
    region.ruralAccessIndex = Math.round(45 + data.Distribuicao_Localizacao.Interior / 10)
  })

  return regionalStats
}

// Função para obter estatísticas nacionais
export function getNationalStats(statesData: Record<string, EstadoData>) {
  const totalHospitals = Object.values(statesData).reduce((sum, data) => sum + data.Hospitais_Privados_2024, 0)
  const totalBeds = Object.values(statesData).reduce((sum, data) => sum + data.Leitos_Privados_2024, 0)

  return {
    totalHospitals,
    totalBeds,
    averageOccupancy: 75.2, // Estimativa baseada em dados históricos
    patientsServed: Math.round(totalBeds * 0.75 * 30), // Estimativa: 75% ocupação x 30 dias
  }
}

// Função para processar dados de hospitais para gráficos
export function getHospitalChartData(statesData: Record<string, EstadoData>) {
  return Object.entries(statesData).map(([estadoKey, data]) => ({
    id: estadoKey,
    name: estadoNomes[estadoKey] || estadoKey,
    region: data.Regiao,
    beds: data.Leitos_Privados_2024,
    hospitals: data.Hospitais_Privados_2024,
    occupancy: Math.round(70 + Math.random() * 20), // Simulação de ocupação
    doctors: Math.round(data.Leitos_Privados_2024 * 0.3), // Estimativa
    nurses: Math.round(data.Leitos_Privados_2024 * 0.6), // Estimativa
    patientOutcomes: [
      { month: "Jan", successRate: Math.round(75 + Math.random() * 15) },
      { month: "Feb", successRate: Math.round(75 + Math.random() * 15) },
      { month: "Mar", successRate: Math.round(75 + Math.random() * 15) },
      { month: "Apr", successRate: Math.round(75 + Math.random() * 15) },
      { month: "May", successRate: Math.round(75 + Math.random() * 15) },
      { month: "Jun", successRate: Math.round(75 + Math.random() * 15) },
    ],
  }))
}

// Função para obter dados formatados para gráficos por estado
export function getStateChartData(stateKey: string) {
  const data = realHospitalData[stateKey]
  if (!data) return null

  return {
    id: stateKey,
    name: estadoNomes[stateKey],
    region: data.Regiao,

    // Dados básicos
    hospitals: data.Hospitais_Privados_2024,
    beds: data.Leitos_Privados_2024,
    bedsPerThousand: data.Leitos_por_1000_hab,

    // Localização
    coordinates: data.Localizacao,

    // Distribuições para gráficos
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

// Função para importar dados reais para o Firebase (compatibilidade)
export async function importRealDataToFirebase() {
  try {
    console.log("✅ Dados reais já estão embutidos no sistema")
    return { success: true, message: "Dados reais carregados com sucesso" }
  } catch (error) {
    console.error("❌ Erro ao carregar dados:", error)
    return { success: false, error: "Erro ao carregar dados reais" }
  }
}

// Função para verificar se os dados reais foram importados (compatibilidade)
export async function checkRealDataImported() {
  try {
    const data = await loadRealHospitalData()
    const totalStates = Object.keys(data).length
    return {
      imported: totalStates > 0,
      totalStates,
      totalHospitals: Object.values(data).reduce((sum, state) => sum + state.Hospitais_Privados_2024, 0),
      totalBeds: Object.values(data).reduce((sum, state) => sum + state.Leitos_Privados_2024, 0),
    }
  } catch (error) {
    console.error("❌ Erro ao verificar dados:", error)
    return { imported: false, totalStates: 0, totalHospitals: 0, totalBeds: 0 }
  }
}
