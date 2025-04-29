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
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "projetocnsaude.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-Q0KV8TFJNQ",
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
    app = initializeApp(firebaseConfig)
  } else {
    app = getApp()
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

// Funções para manipular dados no Firestore
export async function updateStats(statsData) {
  if (!isFirebaseInitialized()) {
    throw new Error("Firebase não está inicializado")
  }

  try {
    const statsRef = doc(db, "stats", "overall")
    const statsDoc = await getDoc(statsRef)

    if (statsDoc.exists()) {
      await updateDoc(statsRef, statsData)
    } else {
      await setDoc(statsRef, statsData)
    }

    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar estatísticas:", error)
    throw error
  }
}

export async function updateRegion(regionId, regionData) {
  if (!isFirebaseInitialized()) {
    throw new Error("Firebase não está inicializado")
  }

  try {
    const regionRef = doc(db, "regions", regionId)
    const regionDoc = await getDoc(regionRef)

    if (regionDoc.exists()) {
      await updateDoc(regionRef, regionData)
    } else {
      await setDoc(regionRef, { id: regionId, ...regionData })
    }

    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar região:", error)
    throw error
  }
}

export async function updateHospital(hospitalId, hospitalData) {
  if (!isFirebaseInitialized()) {
    throw new Error("Firebase não está inicializado")
  }

  try {
    const hospitalRef = doc(db, "hospitals", hospitalId)
    const hospitalDoc = await getDoc(hospitalRef)

    if (hospitalDoc.exists()) {
      await updateDoc(hospitalRef, hospitalData)
    } else {
      await setDoc(hospitalRef, { id: hospitalId, ...hospitalData })
    }

    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar hospital:", error)
    throw error
  }
}

// Função para inicializar o banco de dados com dados de exemplo
export async function seedDatabase() {
  if (!isFirebaseInitialized()) {
    throw new Error("Firebase não está inicializado")
  }

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

    return { success: true, message: "Banco de dados inicializado com sucesso" }
  } catch (error) {
    console.error("Erro ao inicializar banco de dados:", error)
    throw error
  }
}
