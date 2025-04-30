import { db } from "./firebase"
import { doc, setDoc, getDoc } from "firebase/firestore"

// Esta função deve ser chamada apenas uma vez para configurar o usuário administrador
export async function setupAdminUser(uid: string, email: string) {
  try {
    // Verificar se o usuário já existe
    const userRef = doc(db, "users", uid)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      const userData = userDoc.data()
      if (userData.role === "admin") {
        return { success: true, message: "Usuário já é um administrador" }
      }
    }

    // Configurar como administrador
    await setDoc(
      userRef,
      {
        role: "admin",
        email: email,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { merge: true },
    )

    return { success: true, message: "Usuário administrador configurado com sucesso" }
  } catch (error) {
    console.error("Erro ao configurar usuário administrador:", error)
    throw error
  }
}

// Função para verificar se um usuário é administrador
export async function isUserAdmin(uid: string) {
  try {
    const userRef = doc(db, "users", uid)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      const userData = userDoc.data()
      return userData.role === "admin"
    }

    return false
  } catch (error) {
    console.error("Erro ao verificar permissões de administrador:", error)
    return false
  }
}
