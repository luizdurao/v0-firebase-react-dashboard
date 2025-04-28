import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore, doc, setDoc, updateDoc, getDoc } from "firebase/firestore"
import { statsData, regionData, hospitalData } from "./seed-data"
import { seedRegionalMapData } from "./regional-map-data"

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDHJL2Qxl3pIlUfIzWs7hMdz6KFIrPaBPE",
  authDomain: "projetocnsaude.firebaseapp.com",
  projectId: "projetocnsaude",
  storageBucket: "projetocnsaude.firebasestorage.app",
  messagingSenderId: "814294290260",
  appId: "1:814294290260:web:a79eeac3d2829bed1102c1",
  measurementId: "G-Q0KV8TFJNQ",
}

// Inicializar Firebase com tratamento de erros
let app,
  auth,
  db,
  firebaseInitialized = false

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  firebaseInitialized = true
  console.log("Firebase inicializado com sucesso")
} catch (error) {
  console.error("Erro ao inicializar Firebase:", error)
  // Criar objetos mock para fallback
  app = {} as any
  auth = {
    onAuthStateChanged: (callback: any) => {
      callback(null)
      return () => {}
    },
    signInAnonymously: () => Promise.reject(new Error("Firebase Auth não disponível")),
    signOut: () => Promise.resolve(),
  } as any
  db = {
    collection: () => ({
      getDocs: () => Promise.resolve({ empty: true, docs: [] }),
    }),
  } as any
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
