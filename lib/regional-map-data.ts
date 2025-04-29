// Dados geográficos e métricas de saúde detalhadas para o mapa regional

export const regionalData = [
  {
    id: "north",
    name: "Norte",
    hospitals: 845,
    urbanAccessIndex: 78,
    ruralAccessIndex: 42,
    doctors: 32500,
    beds: 95000,
    population: 18000000,
    healthMetrics: {
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
    medicalEquipment: {
      mri: 85,
      ct: 120,
      xray: 780,
      ultrasound: 650,
      mammography: 95,
      ventilators: 420,
      dialysisMachines: 380,
    },
  },
  {
    id: "northeast",
    name: "Nordeste",
    hospitals: 2187,
    urbanAccessIndex: 82,
    ruralAccessIndex: 48,
    doctors: 78000,
    beds: 198000,
    population: 57000000,
    healthMetrics: {
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
    medicalEquipment: {
      mri: 210,
      ct: 320,
      xray: 1850,
      ultrasound: 1650,
      mammography: 280,
      ventilators: 980,
      dialysisMachines: 850,
    },
  },
  {
    id: "central-west",
    name: "Centro-Oeste",
    hospitals: 912,
    urbanAccessIndex: 88,
    ruralAccessIndex: 56,
    doctors: 45000,
    beds: 82000,
    population: 16000000,
    healthMetrics: {
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
    medicalEquipment: {
      mri: 120,
      ct: 180,
      xray: 920,
      ultrasound: 780,
      mammography: 150,
      ventilators: 520,
      dialysisMachines: 420,
    },
  },
  {
    id: "southeast",
    name: "Sudeste",
    hospitals: 3292,
    urbanAccessIndex: 94,
    ruralAccessIndex: 62,
    doctors: 185000,
    beds: 310000,
    population: 89000000,
    healthMetrics: {
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
    medicalEquipment: {
      mri: 450,
      ct: 680,
      xray: 3200,
      ultrasound: 2800,
      mammography: 580,
      ventilators: 1850,
      dialysisMachines: 1650,
    },
  },
  {
    id: "south",
    name: "Sul",
    hospitals: 1221,
    urbanAccessIndex: 92,
    ruralAccessIndex: 58,
    doctors: 82000,
    beds: 154000,
    population: 30000000,
    healthMetrics: {
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
    medicalEquipment: {
      mri: 220,
      ct: 320,
      xray: 1450,
      ultrasound: 1250,
      mammography: 280,
      ventilators: 850,
      dialysisMachines: 720,
    },
  },
]

// Função para inicializar os dados do mapa regional no Firebase
export async function seedRegionalMapData(db) {
  try {
    // Criar uma coleção para os dados do mapa regional
    const regionalMapCollection = db.collection("regionalMap")

    // Adicionar dados de regiões
    for (const region of regionalData) {
      await regionalMapCollection.doc(region.id).set(region)
    }

    console.log("Dados do mapa regional inseridos com sucesso")
    return { success: true, message: "Dados do mapa regional inseridos com sucesso" }
  } catch (error) {
    console.error("Erro ao inserir dados do mapa regional:", error)
    throw error
  }
}
