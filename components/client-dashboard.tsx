"use client"

import { useEffect, useState } from "react"
import { getFirebaseStatus } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"

export default function ClientDashboard() {
  const [firebaseStatus, setFirebaseStatus] = useState<any>(null)
  const { user, loading } = useAuth()

  useEffect(() => {
    // Verificar status do Firebase apenas no cliente
    setFirebaseStatus(getFirebaseStatus())
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Status do Firebase</h2>

      {firebaseStatus && (
        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
          <p>
            <strong>Inicializado:</strong>{" "}
            <span className={firebaseStatus.initialized ? "text-green-600" : "text-red-600"}>
              {firebaseStatus.initialized ? "Sim" : "Não"}
            </span>
          </p>
          <p>
            <strong>Ambiente:</strong> {firebaseStatus.browser ? "Cliente (Browser)" : "Servidor"}
          </p>
          <p>
            <strong>Projeto:</strong> {firebaseStatus.config.projectId}
          </p>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">Status de Autenticação</h2>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
          <p>
            <strong>Usuário:</strong> {user ? user.email : "Nenhum usuário logado"}
          </p>
        </div>
      )}
    </div>
  )
}
