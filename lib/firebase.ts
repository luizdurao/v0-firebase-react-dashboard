import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore, doc, setDoc, updateDoc, getDoc } from "firebase/firestore"
import { statsData, regionData, hospitalData } from "./seed-data"
import { seedRegionalMapData } from "./regional-map-data"

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Inicializar Firebase com tratamento de erros
let app,
  auth,
  db,
  firebaseInitialized = false

// Criar objetos mock para fallback
const mockAuth = {
  onAuthStateChanged: (callback) => {
    callback(null)
    return () => {}
  },
  signInWithEmailAndPassword: () => Promise.reject(new Error("Firebase Auth não disponível")),
  signOut: () => Promise.resolve(),
  currentUser: null,
}

const mockDb = {
  collection: () => ({
    getDocs: () => Promise.resolve({ empty: true, docs: [] }),
  }),
  doc: () => ({
    get: () => Promise.resolve({ exists: false, data: () => ({}) }),
    set: () => Promise.resolve(),
    update: () => Promise.resolve(),
  }),
}

try {
  // Verificar se já existe uma instância do Firebase
  if (getApps().length === 0) {
    console.log("Inicializando Firebase com configuração:", {
      apiKey: firebaseConfig.apiKey ? "***" + firebaseConfig.apiKey.slice(-6) : "não definido",
      authDomain: firebaseConfig.authDomain || "não definido",
      projectId: firebaseConfig.projectId || "não definido",
      appId: firebaseConfig.appId ? "***" + firebaseConfig.appId.slice(-6) : "não definido",
    })

    app = initializeApp(firebaseConfig)
  } else {
    app = getApp()
    console.log("Usando instância existente do Firebase")
  }

  // Inicializar serviços
  auth = getAuth(app)
  db = getFirestore(app)

  // Verificar se os serviços foram inicializados corretamente
  if (auth && db) {
    firebaseInitialized = true
    console.log("Firebase inicializado com sucesso")
  } else {
    console.error("Erro ao inicializar serviços do Firebase")
  }
} catch (error) {
  console.error("Erro ao inicializar Firebase:", error)
  // Usar objetos mock para fallback
  app = null
  auth = mockAuth
  db = mockDb
}

// Exportar os serviços do Firebase
export { auth, db }

// Função para verificar se o Firebase está inicializado
export function isFirebaseInitialized() {
  return firebaseInitialized
}

// Função para inicializar o banco de dados com os dados de exemplo
export async function seedDatabase() {
  try {
    // Inserir dados de estatísticas
    await setDoc(doc(db, "stats", "overall"), statsData)
    console.log("Dados de estatísticas inseridos com sucesso")

    // Inserir dados de regiões
    for (const region of regionData) {
      await setDoc(doc(db, "regions", region.id), region)
    }
    console.log("Dados de regiões inseridos com sucesso")

    // Inserir dados de hospitais
    for (const hospital of hospitalData) {
      await setDoc(doc(db, "hospitals", hospital.id), hospital)
    }
    console.log("Dados de hospitais inseridos com sucesso")

    // Inserir dados do mapa regional
    await seedRegionalMapData(db)
    console.log("Dados do mapa regional inseridos com sucesso")

    return { success: true, message: "Banco de dados inicializado com sucesso" }
  } catch (error) {
    console.error("Erro ao inicializar banco de dados:", error)
    throw error
  }
}

// Função para atualizar as estatísticas
export async function updateStats(stats: any) {
  try {
    await updateDoc(doc(db, "stats", "overall"), stats)
    console.log("Estatísticas atualizadas com sucesso")
    return { success: true, message: "Estatísticas atualizadas com sucesso" }
  } catch (error) {
    console.error("Erro ao atualizar estatísticas:", error)
    throw error
  }
}

// Função para atualizar uma região
export async function updateRegion(regionId: string, regionData: any) {
  try {
    await updateDoc(doc(db, "regions", regionId), regionData)
    console.log(`Região ${regionId} atualizada com sucesso`)
    return { success: true, message: `Região ${regionId} atualizada com sucesso` }
  } catch (error) {
    console.error(`Erro ao atualizar região ${regionId}:`, error)
    throw error
  }
}

// Função para garantir que o usuário admin exista
export async function ensureAdminUser() {
  try {
    // Verificar se o usuário admin padrão já existe
    const userRef = doc(db, "users", "admin")
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      // Criar o usuário admin padrão
      await setDoc(userRef, {
        role: "admin",
        email: "admin@saude.gov.br",
        createdAt: new Date(),
      })
      console.log("Usuário admin padrão criado com sucesso")
      return { success: true, message: "Usuário admin padrão criado com sucesso" }
    } else {
      console.log("Usuário admin padrão já existe")
      return { success: true, message: "Usuário admin padrão já existe" }
    }
  } catch (error) {
    console.error("Erro ao garantir usuário admin:", error)
    throw error
  }
}

// Função para obter o status do Firebase
export function getFirebaseStatus() {
  return {
    initialized: firebaseInitialized,
    config: firebaseConfig,
    envVars: {
      apiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      appId: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    },
  }
}
