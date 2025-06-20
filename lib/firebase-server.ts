import "server-only" // Garante que este código NUNCA seja executado no cliente

import { initializeApp, getApps, type ServiceAccount } from "firebase-admin/app"
import { getFirestore, FieldValue } from "firebase-admin/firestore"

// Use as credenciais de administrador do Firebase (configuradas nas variáveis de ambiente do Vercel)
const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID!,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
  privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
}

const adminApp =
  getApps().find((app) => app.name === "firebase-admin-app") ||
  initializeApp(
    {
      credential: {
        projectId: serviceAccount.projectId,
        clientEmail: serviceAccount.clientEmail,
        privateKey: serviceAccount.privateKey,
      },
    },
    "firebase-admin-app",
  )

const adminDb = getFirestore(adminApp)

export { adminDb, FieldValue }

// Função para configurar um usuário como administrador (executada no servidor)
export async function setupAdminUser(uid: string, email: string) {
  try {
    const userRef = adminDb.collection("users").doc(uid)
    const userDoc = await userRef.get()

    if (userDoc.exists && userDoc.data()?.role === "admin") {
      return { success: true, message: "Usuário já é um administrador." }
    }

    await userRef.set(
      {
        role: "admin",
        email: email,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    )

    return { success: true, message: "Usuário administrador configurado com sucesso." }
  } catch (error) {
    console.error("Erro ao configurar usuário administrador:", error)
    const message = error instanceof Error ? error.message : "Erro desconhecido."
    return { success: false, message }
  }
}

// Função para verificar se um usuário é administrador (executada no servidor)
export async function isUserAdmin(uid: string): Promise<boolean> {
  try {
    if (!uid) return false
    const userRef = adminDb.collection("users").doc(uid)
    const userDoc = await userRef.get()

    return userDoc.exists && userDoc.data()?.role === "admin"
  } catch (error) {
    console.error("Erro ao verificar permissões de administrador:", error)
    return false
  }
}
