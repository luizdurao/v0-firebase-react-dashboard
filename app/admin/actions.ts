"use server"

import { setupAdminUser, isUserAdmin } from "@/lib/firebase-server"

// Server Action para chamar a função setupAdminUser de forma segura
export async function setupAdminUserAction(uid: string, email: string) {
  // Aqui você poderia adicionar verificações de permissão se necessário
  // Por exemplo, verificar se o usuário que está chamando esta ação já é um admin.
  return await setupAdminUser(uid, email)
}

// Server Action para chamar a função isUserAdmin
export async function isUserAdminAction(uid: string) {
  return await isUserAdmin(uid)
}
