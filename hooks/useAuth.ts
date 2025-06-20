"use client"

import { useEffect, useState, useCallback } from "react"
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect, // ← NOVO
  signOut,
  type User,
} from "firebase/auth"
import { auth } from "@/lib/firebase"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const login = useCallback(async () => {
    const provider = new GoogleAuthProvider()

    try {
      // 1ª tentativa: popup
      await signInWithPopup(auth, provider)
    } catch (err: any) {
      // ⚠️ Domínio não autorizado
      if (err?.code === "auth/unauthorized-domain") {
        alert(
          [
            "⚠️ Domínio não autorizado no Firebase Authentication.",
            "1. Abra o Firebase Console → Authentication → Settings",
            "2. Clique em 'Authorized domains' → 'Add domain'",
            `3. Adicione: ${window.location.hostname}`,
            "",
            "Após salvar, voltaremos a tentar o login via redirecionamento…",
          ].join("\n"),
        )

        // Fallback: redirecionamento (útil após autorizar o domínio)
        await signInWithRedirect(auth, provider)
      } else {
        console.error("Erro de login:", err)
        alert("Erro ao fazer login: " + (err?.message ?? err))
      }
    }
  }, [])

  const logout = useCallback(async () => {
    await signOut(auth)
  }, [])

  return { user, loading, login, logout }
}
