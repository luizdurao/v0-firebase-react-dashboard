import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app"
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore" // Adicionado collection e getDocs
import { statsData, regionData, hospitalData } from "./seed-data" // Supondo que estes existam
// import { seedRegionalMapData } from "./regional-map-data"; // Comentado se não for usado ou causar problemas

// Verificar se estamos no lado do cliente
const isBrowser = typeof window !== "undefined"

// Configuração do Firebase fornecida pelo usuário
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyDHJL2Qxl3pIlUfIzWs7hMdz6KFIrPaBPE",
  authDomain: "projetocnsaude.firebaseapp.com",
  projectId: "projetocnsaude",
  storageBucket: "projetocnsaude.appspot.com", // Corrigido: .appspot.com é o padrão para storageBucket
  messagingSenderId: "814294290260",
  appId: "1:814294290260:web:08bf02614c6bdd2c1102c1",
  measurementId: "G-04EJ1RDZ1W",
}

// Inicializar Firebase com tratamento de erros
let app
let _auth
let _db
let _firebaseInitialized = false

// Criar objetos mock para fallback
const mockAuth = {
  onAuthStateChanged: (callback: (user: any) => void) => {
    callback(null)
    return () => {}
  },
  signInWithEmailAndPassword: () => Promise.reject(new Error("Firebase Auth não disponível")),
  signOut: () => Promise.resolve(),
  currentUser: null,
}

const mockDb = {
  collection: (path: string) => ({
    // Adicionado path para compatibilidade
    getDocs: () => Promise.resolve({ empty: true, docs: [] }),
    doc: (docPath: string) => ({
      // Adicionado docPath
      get: () => Promise.resolve({ exists: false, data: () => ({}) }),
      set: () => Promise.resolve(),
      update: () => Promise.resolve(),
    }),
  }),
  doc: (path: string) => ({
    // Adicionado path
    get: () => Promise.resolve({ exists: false, data: () => ({}) }),
    set: () => Promise.resolve(),
    update: () => Promise.resolve(),
  }),
}

// Função para inicializar o Firebase
async function initializeFirebase() {
  if (!isBrowser) {
    console.log("Executando no servidor, Firebase (client) não será inicializado.")
    return { auth: mockAuth, db: mockDb, initialized: false }
  }

  // Validar a configuração antes de tentar inicializar
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error("Configuração do Firebase incompleta. apiKey e projectId são obrigatórios.")
    return { auth: mockAuth, db: mockDb, initialized: false }
  }

  try {
    if (getApps().length === 0) {
      console.log("Inicializando Firebase (client) com configuração:", {
        apiKey: firebaseConfig.apiKey ? "***" + firebaseConfig.apiKey.slice(-6) : "não definido",
        authDomain: firebaseConfig.authDomain || "não definido",
        projectId: firebaseConfig.projectId || "não definido",
        appId: firebaseConfig.appId ? "***" + firebaseConfig.appId.slice(-6) : "não definido",
      })
      app = initializeApp(firebaseConfig)
    } else {
      app = getApp()
      console.log("Usando instância existente do Firebase (client)")
    }

    // Importar dinamicamente para evitar erros no servidor e apenas se no browser
    const { getAuth } = await import("firebase/auth")
    _auth = getAuth(app)
    _db = getFirestore(app)

    if (_auth && _db) {
      _firebaseInitialized = true
      console.log("Firebase (client) inicializado com sucesso")
    } else {
      console.error("Erro ao inicializar serviços do Firebase (client)")
    }

    return { auth: _auth || mockAuth, db: _db || mockDb, initialized: _firebaseInitialized }
  } catch (error) {
    console.error("Erro ao inicializar Firebase (client):", error)
    return { auth: mockAuth, db: mockDb, initialized: false }
  }
}

let auth: any = mockAuth // Use 'any' ou defina um tipo mais específico para Auth
let db: any = mockDb // Use 'any' ou defina um tipo mais específico para Firestore
let firebaseInitialized = false

if (isBrowser) {
  initializeFirebase().then((firebase) => {
    auth = firebase.auth
    db = firebase.db
    firebaseInitialized = firebase.initialized
    console.log("Firebase (client) inicializado assincronamente:", firebaseInitialized)

    // Após a inicialização, podemos tentar garantir o usuário admin se necessário
    // ou popular o banco de dados, mas isso deve ser feito com cuidado
    // para não sobrescrever dados existentes ou executar em cada carregamento.
    // Ex: if (firebaseInitialized) { ensureAdminUser(); }
  })
}

export { auth, db }

export function isFirebaseInitialized() {
  return firebaseInitialized
}

// Função para inicializar o banco de dados com os dados de exemplo
// ATENÇÃO: Esta função irá sobrescrever dados. Use com cautela.
export async function seedDatabase() {
  if (!isFirebaseInitialized()) {
    console.error("Firebase (client) não está inicializado. Não é possível popular o banco de dados.")
    return { success: false, message: "Firebase (client) não inicializado." }
  }
  if (process.env.NODE_ENV !== "development") {
    console.warn("SeedDatabase só deve ser executado em ambiente de desenvolvimento.")
    return { success: false, message: "SeedDatabase bloqueado em produção." }
  }

  try {
    console.log("Iniciando a população do banco de dados (client-side)...")
    // Inserir dados de estatísticas
    await setDoc(doc(db, "stats", "overall"), statsData)
    console.log("Dados de estatísticas (client) inseridos com sucesso")

    // Inserir dados de regiões
    for (const region of regionData) {
      await setDoc(doc(db, "regions", region.id), region)
    }
    console.log("Dados de regiões (client) inseridos com sucesso")

    // Inserir dados de hospitais
    for (const hospital of hospitalData) {
      await setDoc(doc(db, "hospitals", hospital.id), hospital)
    }
    console.log("Dados de hospitais (client) inseridos com sucesso")

    // Se seedRegionalMapData for uma função que usa o 'db' do cliente:
    // await seedRegionalMapData(db);
    // console.log("Dados do mapa regional (client) inseridos com sucesso");

    return { success: true, message: "Banco de dados (client) inicializado com sucesso" }
  } catch (error) {
    console.error("Erro ao inicializar banco de dados (client):", error)
    const message = error instanceof Error ? error.message : "Erro desconhecido."
    return { success: false, message }
  }
}

// Função para garantir que o usuário admin exista (usando o db do cliente)
// Esta função é mais para garantir uma entrada no Firestore,
// a lógica de permissões real deve ser no backend com Admin SDK.
export async function ensureAdminUser() {
  if (!isFirebaseInitialized()) {
    console.warn("Firebase (client) não inicializado. Não é possível verificar usuário admin.")
    return
  }

  try {
    const userRef = doc(db, "users", "admin@saude.gov.br") // Usando email como ID para exemplo
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        role: "admin", // Apenas um marcador no cliente
        email: "admin@saude.gov.br",
        createdAt: new Date().toISOString(), // Usar ISOString para consistência
      })
      console.log("Registro de usuário admin padrão (client) criado/verificado.")
      return { success: true, message: "Registro de usuário admin padrão (client) criado/verificado." }
    } else {
      console.log("Registro de usuário admin padrão (client) já existe.")
      return { success: true, message: "Registro de usuário admin padrão (client) já existe." }
    }
  } catch (error) {
    console.error("Erro ao garantir usuário admin (client):", error)
    const message = error instanceof Error ? error.message : "Erro desconhecido."
    return { success: false, message }
  }
}

/**
 * Atualiza os dados de uma região no Firestore
 * @param regionId  ID da região (document ID)
 * @param regionData Dados parciais ou completos a serem gravados
 */
export async function updateRegion(regionId: string, regionData: any) {
  if (!isFirebaseInitialized()) {
    throw new Error("Firebase (client) não inicializado")
  }

  try {
    await updateDoc(doc(db, "regions", regionId), regionData)
    console.log(`Região ${regionId} atualizada com sucesso (client)`)
    return { success: true, message: `Região ${regionId} atualizada com sucesso` }
  } catch (error) {
    console.error(`Erro ao atualizar região ${regionId} (client):`, error)
    throw error
  }
}

export function getFirebaseStatus() {
  return {
    initialized: firebaseInitialized,
    config: {
      apiKey: firebaseConfig.apiKey ? "***" + (firebaseConfig.apiKey.slice(-6) || "") : "não definido",
      authDomain: firebaseConfig.authDomain || "não definido",
      projectId: firebaseConfig.projectId || "não definido",
      appId: firebaseConfig.appId ? "***" + (firebaseConfig.appId.slice(-6) || "") : "não definido",
    },
    // Removido envVars pois a config é hardcoded agora
    browser: isBrowser,
  }
}
