"use client"

import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import FirestoreRulesHelper from "./firestore-rules-helper"

export default function PermissionErrorHandler({ onRetry }: { onRetry: () => void }) {
  const [showRulesHelper, setShowRulesHelper] = useState(false)

  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro de Permissão</AlertTitle>
        <AlertDescription>
          Não foi possível acessar os dados devido a permissões insuficientes. Isso geralmente ocorre quando as regras
          de segurança do Firestore estão muito restritivas.
        </AlertDescription>
      </Alert>

      <div className="flex space-x-2">
        <Button onClick={onRetry}>Tentar Novamente</Button>
        <Button variant="outline" onClick={() => setShowRulesHelper(!showRulesHelper)}>
          {showRulesHelper ? "Ocultar Ajuda" : "Mostrar Ajuda"}
        </Button>
      </div>

      {showRulesHelper && <FirestoreRulesHelper />}
    </div>
  )
}
