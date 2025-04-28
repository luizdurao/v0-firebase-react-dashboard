import { db } from "./firebase"
import { doc, setDoc } from "firebase/firestore"

// Esta função deve ser chamada apenas uma vez para configurar o usuário administrador
export async function setupAdminUser(uid: string) {
  try {
    await setDoc(doc(db, "users", uid), {
      role: "admin",
      createdAt: new Date(),
    })
    return { success: true, message: "Usuário administrador configurado com sucesso" }
  } catch (error) {
    console.error("Erro ao configurar usuário administrador:", error)
    throw error
  }
}
