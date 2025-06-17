"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { getAuth, getFirestore, isFirebaseInitialized } from "@/lib/firebase"

// Verificar se estamos no lado do cliente
const isBrowser = typeof window !== "undefined"

type User = {
  uid: string
  email: string | null
  displayName: string | null
}

type AuthContextType = {
  user: User | null
  isAdmin: boolean
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Skip if not in browser
    if (!isBrowser) {
      console.log("Executando no servidor, pulando autenticação")
      setLoading(false)
      return () => {}
    }

    // Check if Firebase is properly initialized
    if (!isFirebaseInitialized()) {
      console.warn("Firebase não está inicializado. Autenticação não funcionará.")
      setError("Firebase não está configurado corretamente.")
      setLoading(false)
      return () => {}
    }

    const setupAuth = async () => {
      try {
        // Obter a instância de Auth
        const auth = await getAuth()

        // Check if auth is properly initialized
        if (!auth || typeof auth.onAuthStateChanged !== "function") {
          console.warn("Firebase Auth não está funcionando corretamente")
          setError("Serviço de autenticação não está disponível.")
          setLoading(false)
          return () => {}
        }

        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
          console.log("Estado de autenticação alterado:", currentUser?.email || "Nenhum usuário")

          if (currentUser) {
            // Converter para o tipo User simplificado
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
            })

            try {
              // Verificar se o usuário é um administrador
              const db = await getFirestore()
              if (db) {
                const { doc, getDoc, setDoc } = await import("firebase/firestore")
                const userRef = doc(db, "users", currentUser.uid)

                try {
                  const userDoc = await getDoc(userRef)

                  if (userDoc.exists()) {
                    const userData = userDoc.data()
                    const userRole = userData.role
                    console.log(`Usuário ${currentUser.email} tem função: ${userRole}`)
                    setIsAdmin(userRole === "admin")
                  } else {
                    console.log(`Documento do usuário ${currentUser.email} não existe. Criando...`)

                    // Se for o email de admin padrão, criar como admin automaticamente
                    if (currentUser.email === "admin@saude.gov.br") {
                      try {
                        await setDoc(userRef, {
                          role: "admin",
                          email: currentUser.email,
                          createdAt: new Date(),
                        })
                        console.log("Usuário admin padrão criado com sucesso")
                        setIsAdmin(true)
                      } catch (writeError) {
                        console.error("Erro ao criar usuário admin:", writeError)
                        // Mesmo com erro, vamos considerar admin se for o email padrão
                        if (currentUser.email === "admin@saude.gov.br") {
                          setIsAdmin(true)
                        }
                      }
                    } else {
                      setIsAdmin(false)
                    }
                  }
                } catch (readError: any) {
                  console.error("Erro ao ler documento do usuário:", readError)

                  // Se for erro de permissão, mas for o email de admin padrão, considerar como admin
                  if (readError.code === "permission-denied" && currentUser.email === "admin@saude.gov.br") {
                    console.log("Erro de permissão, mas email é admin padrão. Considerando como admin.")
                    setIsAdmin(true)
                  } else {
                    setIsAdmin(false)
                  }
                }
              }
            } catch (err) {
              console.error("Erro ao verificar permissões:", err)

              // Se for o email de admin padrão, considerar como admin mesmo com erro
              if (currentUser.email === "admin@saude.gov.br") {
                setIsAdmin(true)
              } else {
                setIsAdmin(false)
              }
            }
          } else {
            setUser(null)
            setIsAdmin(false)
          }

          setLoading(false)
        })

        return () => unsubscribe()
      } catch (error) {
        console.error("Erro ao configurar listener de autenticação:", error)
        setError("Erro ao inicializar autenticação.")
        setLoading(false)
        return () => {}
      }
    }

    setupAuth()
  }, [])

  const login = async (email: string, password: string) => {
    if (!isBrowser || !isFirebaseInitialized()) {
      setError("Firebase não está inicializado. Não é possível fazer login.")
      return
    }

    try {
      setError(null)
      setLoading(true)
      console.log(`Tentando login com email: ${email}`)

      // Obter a instância de Auth
      const auth = await getAuth()
      const { signInWithEmailAndPassword } = await import("firebase/auth")

      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log("Login bem-sucedido:", userCredential.user.email)

      // Verificar se é o primeiro login do admin padrão
      if (email === "admin@saude.gov.br") {
        try {
          const db = await getFirestore()
          if (db) {
            const { doc, getDoc, setDoc } = await import("firebase/firestore")
            const userRef = doc(db, "users", userCredential.user.uid)
            const userDoc = await getDoc(userRef)

            if (!userDoc.exists()) {
              console.log("Configurando usuário admin padrão...")
              try {
                await setDoc(userRef, {
                  role: "admin",
                  email: email,
                  createdAt: new Date(),
                })
                console.log("Usuário admin padrão criado com sucesso")
              } catch (writeError) {
                console.error("Erro ao criar documento de usuário admin:", writeError)
                // Continuar mesmo com erro
              }
            }
          }
        } catch (readError) {
          console.error("Erro ao verificar documento de usuário:", readError)
          // Continuar mesmo com erro
        }
      }
    } catch (err: any) {
      console.error("Erro de login:", err)

      // Traduzir mensagens de erro do Firebase para português
      let errorMessage = "Falha na autenticação"

      if (err.code === "auth/user-not-found") {
        errorMessage = "Usuário não encontrado. Verifique o email."
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Senha incorreta. Tente novamente."
      } else if (err.code === "auth/invalid-credential") {
        errorMessage = "Credenciais inválidas. Verifique email e senha."
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Muitas tentativas de login. Tente novamente mais tarde."
      } else if (err.code === "auth/api-key-not-valid") {
        errorMessage = "Erro: API Key do Firebase inválida. Verifique a configuração do Firebase."
      } else {
        // Mostrar o código de erro original para facilitar a depuração
        errorMessage = `${errorMessage} (${err.code})`
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    if (!isBrowser || !isFirebaseInitialized()) {
      return
    }

    try {
      // Obter a instância de Auth
      const auth = await getAuth()
      const { signOut } = await import("firebase/auth")

      await signOut(auth)
      console.log("Logout realizado com sucesso")
    } catch (err: any) {
      console.error("Erro ao sair:", err)
      setError(err.message || "Falha ao sair")
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, error, login, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
