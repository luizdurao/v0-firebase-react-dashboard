"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { auth, db, isFirebaseInitialized } from "@/lib/firebase"
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"

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
    // Skip if Firebase is not initialized
    if (!isFirebaseInitialized()) {
      console.warn("Firebase não está inicializado. Autenticação não funcionará.")
      setLoading(false)
      return () => {}
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        console.log("Estado de autenticação alterado:", currentUser?.email || "Nenhum usuário")
        setUser(currentUser)

        if (currentUser) {
          try {
            // Verificar se o usuário é um administrador
            const userDoc = await getDoc(doc(db, "users", currentUser.uid))

            if (userDoc.exists()) {
              const userData = userDoc.data()
              const userRole = userData.role
              console.log(`Usuário ${currentUser.email} tem função: ${userRole}`)
              setIsAdmin(userRole === "admin")
            } else {
              console.log(`Documento do usuário ${currentUser.email} não existe. Criando...`)

              // Se for o email de admin padrão, criar como admin automaticamente
              if (currentUser.email === "admin@saude.gov.br") {
                await setDoc(doc(db, "users", currentUser.uid), {
                  role: "admin",
                  email: currentUser.email,
                  createdAt: new Date(),
                })
                console.log("Usuário admin padrão criado com sucesso")
                setIsAdmin(true)
              } else {
                setIsAdmin(false)
              }
            }
          } catch (err) {
            console.error("Erro ao verificar permissões:", err)
            setIsAdmin(false)
          }
        } else {
          setIsAdmin(false)
        }

        setLoading(false)
      })

      return () => unsubscribe()
    } catch (error) {
      console.error("Erro ao configurar listener de autenticação:", error)
      setLoading(false)
      return () => {}
    }
  }, [])

  const login = async (email: string, password: string) => {
    if (!isFirebaseInitialized()) {
      setError("Firebase não está inicializado. Não é possível fazer login.")
      return
    }

    try {
      setError(null)
      setLoading(true)
      console.log(`Tentando login com email: ${email}`)

      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log("Login bem-sucedido:", userCredential.user.email)

      // Verificar se é o primeiro login do admin padrão
      if (email === "admin@saude.gov.br") {
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid))
        if (!userDoc.exists()) {
          console.log("Configurando usuário admin padrão...")
          await setDoc(doc(db, "users", userCredential.user.uid), {
            role: "admin",
            email: email,
            createdAt: new Date(),
          })
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
    if (!isFirebaseInitialized()) {
      return
    }

    try {
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
