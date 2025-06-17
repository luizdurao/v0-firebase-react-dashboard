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

// Verificar se estamos no lado do cliente
const isBrowser = typeof window !== "undefined"

// Variáveis globais para as instâncias do Firebase
let app = null
let db = null
let auth = null
let isInitialized = false
let firestoreEnabled = false
let authEnabled = false
let initializationPromise = null

// Mock auth para uso no servidor
const mockAuth = {
  currentUser: null,
  onAuthStateChanged: (callback) => {
    callback(null)
    return () => {}
  },
  signInWithEmailAndPassword: () => Promise.reject(new Error("Firebase Auth não disponível")),
  signOut: () => Promise.resolve(),
}

// Função para inicializar o Firebase
async function initializeFirebase() {
  if (!isBrowser) {
    console.log("🔧 Executando no servidor - Firebase não será inicializado")
    return false
  }

  if (isInitialized) {
    console.log("✅ Firebase já foi inicializado")
    return true
  }

  // Se já existe uma promessa de inicialização, aguardar ela
  if (initializationPromise) {
    return await initializationPromise
  }

  initializationPromise = (async () => {
    try {
      console.log("🚀 Conectando com sua base Firebase existente...")

      // Importar Firebase dinamicamente
      const { initializeApp, getApps, getApp } = await import("firebase/app")

      // Inicializar o app Firebase
      if (getApps().length === 0) {
        app = initializeApp(firebaseConfig)
        console.log("✅ Firebase App conectado com sucesso")
      } else {
        app = getApp()
        console.log("✅ Usando conexão existente do Firebase App")
      }

      // Inicializar Authentication
      try {
        const { getAuth } = await import("firebase/auth")
        auth = getAuth(app)
        authEnabled = true
        console.log("✅ Firebase Auth conectado - base de admin disponível")
      } catch (authError) {
        console.warn("⚠️ Firebase Auth não está disponível:", authError.message)
        auth = mockAuth
        authEnabled = false
      }

      // Conectar com Firestore existente
      try {
        const { getFirestore } = await import("firebase/firestore")
        db = getFirestore(app)

        // Testar conexão verificando se existe dados de admin
        const { doc, getDoc } = await import("firebase/firestore")
        const adminRef = doc(db, "users", "admin")
        const adminDoc = await getDoc(adminRef)

        if (adminDoc.exists()) {
          console.log("✅ Base de admin encontrada no Firestore!")
          console.log("👤 Admin data:", adminDoc.data())
        } else {
          console.log("📋 Base de admin não encontrada, mas Firestore está funcionando")
        }

        firestoreEnabled = true
        console.log("✅ Firestore conectado com sua base existente")
      } catch (firestoreError) {
        console.warn("⚠️ Erro ao conectar com Firestore:", firestoreError.message)
        db = null
        firestoreEnabled = false
      }

      isInitialized = true
      console.log("🎉 Conectado com sucesso à sua base Firebase!")
      console.log(`📊 Status: App ✅ | Auth ${authEnabled ? "✅" : "⚠️"} | Firestore ${firestoreEnabled ? "✅" : "⚠️"}`)

      return true
    } catch (error) {
      console.error("❌ Erro ao conectar com Firebase:", error)
      isInitialized = false
      app = null
      db = null
      auth = mockAuth
      firestoreEnabled = false
      authEnabled = false
      return false
    }
  })()

  return await initializationPromise
}

// Exportações principais
export { db, auth }

// Função para verificar se o Firebase está inicializado
export function isFirebaseInitialized() {
  return isInitialized && app !== null
}

// Função para verificar se o Firestore está disponível
export function isFirestoreAvailable() {
  return firestoreEnabled && db !== null
}

// Função para verificar se o Auth está disponível
export function isAuthAvailable() {
  return authEnabled && auth !== null && auth !== mockAuth
}

// Função para obter o status do Firebase
export function getFirebaseStatus() {
  return {
    initialized: isInitialized,
    hasApp: app !== null,
    hasFirestore: firestoreEnabled,
    hasAuth: authEnabled,
    browser: isBrowser,
    config: {
      apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : "não definido",
      authDomain: firebaseConfig.authDomain || "não definido",
      projectId: firebaseConfig.projectId || "não definido",
      appId: firebaseConfig.appId ? `${firebaseConfig.appId.substring(0, 15)}...` : "não definido",
    },
  }
}

// Função para obter o Firestore de forma segura
export async function getFirestore() {
  if (!isBrowser) return null

  if (!isInitialized) {
    await initializeFirebase()
  }

  return firestoreEnabled ? db : null
}

// Função para obter o Auth de forma segura
export async function getAuth() {
  if (!isBrowser) return mockAuth

  if (!isInitialized) {
    await initializeFirebase()
  }

  return authEnabled ? auth : mockAuth
}

// Função para verificar dados existentes na base
export async function checkExistingData() {
  try {
    console.log("🔍 Verificando dados existentes na base...")

    const firestore = await getFirestore()
    if (!firestore) {
      return { success: false, error: "Firestore não está disponível" }
    }

    const { collection, getDocs, doc, getDoc } = await import("firebase/firestore")

    // Verificar usuários admin
    const adminRef = doc(firestore, "users", "admin")
    const adminDoc = await getDoc(adminRef)
    const hasAdmin = adminDoc.exists()

    // Verificar coleções existentes
    const collections = ["users", "stats", "regions", "hospitals"]
    const existingCollections = []

    for (const collectionName of collections) {
      try {
        const collectionRef = collection(firestore, collectionName)
        const snapshot = await getDocs(collectionRef)
        if (!snapshot.empty) {
          existingCollections.push({
            name: collectionName,
            count: snapshot.size,
          })
        }
      } catch (error) {
        console.warn(`Erro ao verificar coleção ${collectionName}:`, error)
      }
    }

    console.log("✅ Verificação concluída")
    return {
      success: true,
      hasAdmin,
      adminData: hasAdmin ? adminDoc.data() : null,
      collections: existingCollections,
    }
  } catch (error) {
    console.error("❌ Erro ao verificar dados existentes:", error)
    return { success: false, error: error.message }
  }
}

// Função para garantir que existe um usuário admin
export async function ensureAdminUser() {
  console.log("👤 Verificando usuário admin...")

  const firestore = await getFirestore()
  if (!firestore) {
    throw new Error("Firestore não está disponível")
  }

  try {
    const { doc, setDoc, getDoc } = await import("firebase/firestore")

    const adminRef = doc(firestore, "users", "admin")
    const adminDoc = await getDoc(adminRef)

    if (!adminDoc.exists()) {
      // Criar usuário admin padrão
      const adminData = {
        role: "admin",
        email: "admin@saude.gov.br",
        name: "Administrador",
        createdAt: new Date(),
        permissions: ["read", "write", "admin"],
        active: true,
      }

      await setDoc(adminRef, adminData)
      console.log("✅ Usuário admin criado com sucesso")
      return { success: true, message: "Usuário admin criado", data: adminData }
    } else {
      console.log("👤 Usuário admin já existe")
      return { success: true, message: "Usuário admin já existe", data: adminDoc.data() }
    }
  } catch (error) {
    console.error("❌ Erro ao criar usuário admin:", error)
    throw error
  }
}

// Função para sincronizar com dados existentes (não sobrescrever)
export async function syncWithExistingData() {
  console.log("🔄 Sincronizando com dados existentes...")

  const firestore = await getFirestore()
  if (!firestore) {
    throw new Error("Firestore não está disponível")
  }

  try {
    const { doc, setDoc } = await import("firebase/firestore")

    // Verificar se já existem dados antes de adicionar novos
    const existingData = await checkExistingData()

    if (!existingData.success) {
      throw new Error("Não foi possível verificar dados existentes")
    }

    // Garantir que existe usuário admin
    await ensureAdminUser()

    // Se não há dados de stats, adicionar dados de exemplo
    const hasStats = existingData.collections.some((col) => col.name === "stats")
    if (!hasStats) {
      const { statsData } = await import("./seed-data")
      await setDoc(doc(firestore, "stats", "overall"), statsData)
      console.log("✅ Dados de estatísticas adicionados")
    } else {
      console.log("📊 Dados de estatísticas já existem")
    }

    // Se não há dados de regiões, adicionar dados de exemplo
    const hasRegions = existingData.collections.some((col) => col.name === "regions")
    if (!hasRegions) {
      const { regionData } = await import("./seed-data")
      for (const region of regionData) {
        await setDoc(doc(firestore, "regions", region.id), region)
      }
      console.log("✅ Dados de regiões adicionados")
    } else {
      console.log("🗺️ Dados de regiões já existem")
    }

    // Se não há dados de hospitais, adicionar dados de exemplo
    const hasHospitals = existingData.collections.some((col) => col.name === "hospitals")
    if (!hasHospitals) {
      const { hospitalData } = await import("./seed-data")
      for (const hospital of hospitalData) {
        await setDoc(doc(firestore, "hospitals", hospital.id), hospital)
      }
      console.log("✅ Dados de hospitais adicionados")
    } else {
      console.log("🏥 Dados de hospitais já existem")
    }

    console.log("🎉 Sincronização concluída!")
    return {
      success: true,
      message: "Dados sincronizados com sucesso",
      existingData: existingData,
    }
  } catch (error) {
    console.error("❌ Erro na sincronização:", error)
    throw error
  }
}

// Função para inicializar o banco de dados com dados de exemplo (seedDatabase)
export async function seedDatabase() {
  console.log("🌱 Inicializando banco de dados com dados de exemplo...")

  const firestore = await getFirestore()
  if (!firestore) {
    throw new Error("Firestore não está disponível. Verifique se o Firestore está habilitado no Firebase Console.")
  }

  try {
    const { doc, setDoc } = await import("firebase/firestore")
    const { statsData, regionData, hospitalData } = await import("./seed-data")

    // Garantir que existe usuário admin
    await ensureAdminUser()

    // Inserir dados de estatísticas
    await setDoc(doc(firestore, "stats", "overall"), statsData)
    console.log("✅ Dados de estatísticas inseridos")

    // Inserir dados de regiões
    for (const region of regionData) {
      await setDoc(doc(firestore, "regions", region.id), region)
    }
    console.log("✅ Dados de regiões inseridos")

    // Inserir dados de hospitais
    for (const hospital of hospitalData) {
      await setDoc(doc(firestore, "hospitals", hospital.id), hospital)
    }
    console.log("✅ Dados de hospitais inseridos")

    console.log("🎉 Banco de dados inicializado com sucesso!")
    return { success: true, message: "Banco de dados inicializado com sucesso" }
  } catch (error) {
    console.error("❌ Erro ao inicializar banco de dados:", error)
    throw error
  }
}

// Função para testar a conexão com o Firestore
export async function testFirestoreConnection() {
  try {
    console.log("🔍 Testando conexão com sua base Firebase...")

    if (!isInitialized) {
      await initializeFirebase()
    }

    if (!firestoreEnabled || !db) {
      return {
        success: false,
        error: "Firestore não está disponível",
        needsSetup: true,
      }
    }

    // Testar com dados existentes
    const existingData = await checkExistingData()

    console.log("✅ Conexão testada com sucesso")
    return {
      success: true,
      message: "Conectado com sua base Firebase",
      existingData: existingData,
    }
  } catch (error) {
    console.error("❌ Erro ao testar conexão:", error)
    return {
      success: false,
      error: error.message,
      needsSetup: false,
    }
  }
}

// Funções para manipular dados no Firestore
export async function updateStats(statsData) {
  const firestore = await getFirestore()
  if (!firestore) {
    throw new Error("Firestore não está disponível")
  }

  try {
    const { doc, setDoc, updateDoc, getDoc } = await import("firebase/firestore")
    const statsRef = doc(firestore, "stats", "overall")
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
  const firestore = await getFirestore()
  if (!firestore) {
    throw new Error("Firestore não está disponível")
  }

  try {
    const { doc, setDoc, updateDoc, getDoc } = await import("firebase/firestore")
    const regionRef = doc(firestore, "regions", regionId)
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
  const firestore = await getFirestore()
  if (!firestore) {
    throw new Error("Firestore não está disponível")
  }

  try {
    const { doc, setDoc, updateDoc, getDoc } = await import("firebase/firestore")
    const hospitalRef = doc(firestore, "hospitals", hospitalId)
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

// Inicializar Firebase automaticamente quando o módulo for carregado
if (isBrowser) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(initializeFirebase, 100)
    })
  } else {
    setTimeout(initializeFirebase, 100)
  }
}
