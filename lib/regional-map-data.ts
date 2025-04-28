// Dados geográficos e métricas de saúde detalhadas para o mapa regional

export const regionalMapData = {
  // Dados para a visualização do mapa
  regions: [
    {
      id: "north",
      name: "Norte",
      center: { lat: -3.4653, lng: -62.2159 },
      zoom: 5,
      color: "#0088FE",
      states: [
        { code: "AC", name: "Acre" },
        { code: "AM", name: "Amazonas" },
        { code: "AP", name: "Amapá" },
        { code: "PA", name: "Pará" },
        { code: "RO", name: "Rondônia" },
        { code: "RR", name: "Roraima" },
        { code: "TO", name: "Tocantins" },
      ],
    },
    {
      id: "northeast",
      name: "Nordeste",
      center: { lat: -9.6498, lng: -40.3494 },
      zoom: 5,
      color: "#00C49F",
      states: [
        { code: "AL", name: "Alagoas" },
        { code: "BA", name: "Bahia" },
        { code: "CE", name: "Ceará" },
        { code: "MA", name: "Maranhão" },
        { code: "PB", name: "Paraíba" },
        { code: "PE", name: "Pernambuco" },
        { code: "PI", name: "Piauí" },
        { code: "RN", name: "Rio Grande do Norte" },
        { code: "SE", name: "Sergipe" },
      ],
    },
    {
      id: "central-west",
      name: "Centro-Oeste",
      center: { lat: -15.7801, lng: -52.0702 },
      zoom: 5,
      color: "#FFBB28",
      states: [
        { code: "DF", name: "Distrito Federal" },
        { code: "GO", name: "Goiás" },
        { code: "MT", name: "Mato Grosso" },
        { code: "MS", name: "Mato Grosso do Sul" },
      ],
    },
    {
      id: "southeast",
      name: "Sudeste",
      center: { lat: -19.9208, lng: -43.9378 },
      zoom: 6,
      color: "#FF8042",
      states: [
        { code: "ES", name: "Espírito Santo" },
        { code: "MG", name: "Minas Gerais" },
        { code: "RJ", name: "Rio de Janeiro" },
        { code: "SP", name: "São Paulo" },
      ],
    },
    {
      id: "south",
      name: "Sul",
      center: { lat: -27.5954, lng: -51.5488 },
      zoom: 6,
      color: "#8884D8",
      states: [
        { code: "PR", name: "Paraná" },
        { code: "RS", name: "Rio Grande do Sul" },
        { code: "SC", name: "Santa Catarina" },
      ],
    },
  ],

  // Métricas de saúde detalhadas por região
  healthMetrics: {
    north: {
      hospitals: {
        total: 845,
        public: 520,
        private: 325,
        universitarios: 18,
        distribution: [
          { state: "AM", count: 210 },
          { state: "PA", count: 280 },
          { state: "TO", count: 95 },
          { state: "RO", count: 85 },
          { state: "AC", count: 65 },
          { state: "RR", count: 55 },
          { state: "AP", count: 55 },
        ],
      },
      doctors: {
        total: 32500,
        per100k: 180,
        specialists: 18500,
        generalPractitioners: 14000,
        distribution: [
          { state: "AM", count: 8500 },
          { state: "PA", count: 12000 },
          { state: "TO", count: 3500 },
          { state: "RO", count: 3200 },
          { state: "AC", count: 2100 },
          { state: "RR", count: 1600 },
          { state: "AP", count: 1600 },
        ],
      },
      beds: {
        total: 95000,
        per1000: 5.3,
        occupancyRate: 72,
        icu: 9500,
        distribution: [
          { state: "AM", count: 24000 },
          { state: "PA", count: 32000 },
          { state: "TO", count: 10500 },
          { state: "RO", count: 10000 },
          { state: "AC", count: 7500 },
          { state: "RR", count: 5500 },
          { state: "AP", count: 5500 },
        ],
      },
      access: {
        urban: 78,
        rural: 42,
        travelTimeMinutes: {
          urban: 35,
          rural: 120,
        },
        populationCovered: 0.82,
      },
    },
    northeast: {
      hospitals: {
        total: 2187,
        public: 1350,
        private: 837,
        universitarios: 42,
        distribution: [
          { state: "BA", count: 580 },
          { state: "PE", count: 380 },
          { state: "CE", count: 350 },
          { state: "MA", count: 240 },
          { state: "PB", count: 180 },
          { state: "PI", count: 165 },
          { state: "RN", count: 150 },
          { state: "AL", count: 92 },
          { state: "SE", count: 50 },
        ],
      },
      doctors: {
        total: 78000,
        per100k: 137,
        specialists: 42000,
        generalPractitioners: 36000,
        distribution: [
          { state: "BA", count: 21000 },
          { state: "PE", count: 14500 },
          { state: "CE", count: 13000 },
          { state: "MA", count: 7500 },
          { state: "PB", count: 6000 },
          { state: "PI", count: 5500 },
          { state: "RN", count: 5000 },
          { state: "AL", count: 3500 },
          { state: "SE", count: 2000 },
        ],
      },
      beds: {
        total: 198000,
        per1000: 3.5,
        occupancyRate: 78,
        icu: 19800,
        distribution: [
          { state: "BA", count: 52000 },
          { state: "PE", count: 35000 },
          { state: "CE", count: 32000 },
          { state: "MA", count: 22000 },
          { state: "PB", count: 16000 },
          { state: "PI", count: 15000 },
          { state: "RN", count: 14000 },
          { state: "AL", count: 8000 },
          { state: "SE", count: 4000 },
        ],
      },
      access: {
        urban: 82,
        rural: 48,
        travelTimeMinutes: {
          urban: 30,
          rural: 105,
        },
        populationCovered: 0.85,
      },
    },
    "central-west": {
      hospitals: {
        total: 912,
        public: 480,
        private: 432,
        universitarios: 22,
        distribution: [
          { state: "GO", count: 380 },
          { state: "MT", count: 250 },
          { state: "MS", count: 220 },
          { state: "DF", count: 62 },
        ],
      },
      doctors: {
        total: 45000,
        per100k: 281,
        specialists: 28000,
        generalPractitioners: 17000,
        distribution: [
          { state: "GO", count: 16000 },
          { state: "MT", count: 9500 },
          { state: "MS", count: 8500 },
          { state: "DF", count: 11000 },
        ],
      },
      beds: {
        total: 82000,
        per1000: 5.1,
        occupancyRate: 68,
        icu: 8200,
        distribution: [
          { state: "GO", count: 34000 },
          { state: "MT", count: 22000 },
          { state: "MS", count: 20000 },
          { state: "DF", count: 6000 },
        ],
      },
      access: {
        urban: 88,
        rural: 56,
        travelTimeMinutes: {
          urban: 25,
          rural: 90,
        },
        populationCovered: 0.89,
      },
    },
    southeast: {
      hospitals: {
        total: 3292,
        public: 1650,
        private: 1642,
        universitarios: 85,
        distribution: [
          { state: "SP", count: 1580 },
          { state: "MG", count: 950 },
          { state: "RJ", count: 620 },
          { state: "ES", count: 142 },
        ],
      },
      doctors: {
        total: 185000,
        per100k: 208,
        specialists: 125000,
        generalPractitioners: 60000,
        distribution: [
          { state: "SP", count: 95000 },
          { state: "MG", count: 45000 },
          { state: "RJ", count: 38000 },
          { state: "ES", count: 7000 },
        ],
      },
      beds: {
        total: 310000,
        per1000: 3.5,
        occupancyRate: 82,
        icu: 31000,
        distribution: [
          { state: "SP", count: 150000 },
          { state: "MG", count: 85000 },
          { state: "RJ", count: 65000 },
          { state: "ES", count: 10000 },
        ],
      },
      access: {
        urban: 94,
        rural: 62,
        travelTimeMinutes: {
          urban: 20,
          rural: 75,
        },
        populationCovered: 0.95,
      },
    },
    south: {
      hospitals: {
        total: 1221,
        public: 580,
        private: 641,
        universitarios: 35,
        distribution: [
          { state: "RS", count: 520 },
          { state: "PR", count: 450 },
          { state: "SC", count: 251 },
        ],
      },
      doctors: {
        total: 82000,
        per100k: 273,
        specialists: 52000,
        generalPractitioners: 30000,
        distribution: [
          { state: "RS", count: 35000 },
          { state: "PR", count: 30000 },
          { state: "SC", count: 17000 },
        ],
      },
      beds: {
        total: 154000,
        per1000: 5.1,
        occupancyRate: 74,
        icu: 15400,
        distribution: [
          { state: "RS", count: 65000 },
          { state: "PR", count: 58000 },
          { state: "SC", count: 31000 },
        ],
      },
      access: {
        urban: 92,
        rural: 58,
        travelTimeMinutes: {
          urban: 22,
          rural: 65,
        },
        populationCovered: 0.93,
      },
    },
  },

  // Dados de equipamentos médicos por região
  medicalEquipment: {
    north: {
      mri: 85,
      ct: 120,
      xray: 780,
      ultrasound: 650,
      mammography: 95,
      ventilators: 420,
      dialysisMachines: 380,
    },
    northeast: {
      mri: 210,
      ct: 320,
      xray: 1850,
      ultrasound: 1650,
      mammography: 280,
      ventilators: 980,
      dialysisMachines: 850,
    },
    "central-west": {
      mri: 120,
      ct: 180,
      xray: 920,
      ultrasound: 780,
      mammography: 150,
      ventilators: 520,
      dialysisMachines: 420,
    },
    southeast: {
      mri: 450,
      ct: 680,
      xray: 3200,
      ultrasound: 2800,
      mammography: 580,
      ventilators: 1850,
      dialysisMachines: 1650,
    },
    south: {
      mri: 220,
      ct: 320,
      xray: 1450,
      ultrasound: 1250,
      mammography: 280,
      ventilators: 850,
      dialysisMachines: 720,
    },
  },

  // Dados de profissionais de saúde por região
  healthcareProfessionals: {
    north: {
      doctors: 32500,
      nurses: 48000,
      technicians: 65000,
      communityHealthWorkers: 28000,
      specialists: {
        cardiologists: 1850,
        neurologists: 1200,
        oncologists: 950,
        pediatricians: 3800,
        obstetricians: 2900,
        surgeons: 2200,
        anesthesiologists: 1800,
        psychiatrists: 950,
        dermatologists: 850,
        ophthalmologists: 1100,
      },
    },
    northeast: {
      doctors: 78000,
      nurses: 120000,
      technicians: 165000,
      communityHealthWorkers: 85000,
      specialists: {
        cardiologists: 4500,
        neurologists: 2800,
        oncologists: 2200,
        pediatricians: 9500,
        obstetricians: 7200,
        surgeons: 5500,
        anesthesiologists: 4200,
        psychiatrists: 2300,
        dermatologists: 2100,
        ophthalmologists: 2600,
      },
    },
    "central-west": {
      doctors: 45000,
      nurses: 68000,
      technicians: 92000,
      communityHealthWorkers: 38000,
      specialists: {
        cardiologists: 2800,
        neurologists: 1800,
        oncologists: 1400,
        pediatricians: 5200,
        obstetricians: 3800,
        surgeons: 3200,
        anesthesiologists: 2500,
        psychiatrists: 1500,
        dermatologists: 1300,
        ophthalmologists: 1600,
      },
    },
    southeast: {
      doctors: 185000,
      nurses: 280000,
      technicians: 380000,
      communityHealthWorkers: 150000,
      specialists: {
        cardiologists: 12500,
        neurologists: 8500,
        oncologists: 7200,
        pediatricians: 21000,
        obstetricians: 16500,
        surgeons: 14500,
        anesthesiologists: 11000,
        psychiatrists: 7800,
        dermatologists: 6500,
        ophthalmologists: 8200,
      },
    },
    south: {
      doctors: 82000,
      nurses: 125000,
      technicians: 170000,
      communityHealthWorkers: 65000,
      specialists: {
        cardiologists: 5800,
        neurologists: 3900,
        oncologists: 3200,
        pediatricians: 9800,
        obstetricians: 7500,
        surgeons: 6800,
        anesthesiologists: 5200,
        psychiatrists: 3500,
        dermatologists: 3100,
        ophthalmologists: 3800,
      },
    },
  },
}

// Função para inicializar os dados do mapa regional no Firebase
export async function seedRegionalMapData(db) {
  try {
    // Criar uma coleção para os dados do mapa regional
    const regionalMapCollection = db.collection("regionalMap")

    // Adicionar dados de regiões
    for (const region of regionalMapData.regions) {
      await regionalMapCollection.doc(region.id).set({
        ...region,
        healthMetrics: regionalMapData.healthMetrics[region.id],
        medicalEquipment: regionalMapData.medicalEquipment[region.id],
        healthcareProfessionals: regionalMapData.healthcareProfessionals[region.id],
      })
    }

    console.log("Dados do mapa regional inseridos com sucesso")
    return { success: true, message: "Dados do mapa regional inseridos com sucesso" }
  } catch (error) {
    console.error("Erro ao inserir dados do mapa regional:", error)
    throw error
  }
}
