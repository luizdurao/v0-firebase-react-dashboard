"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { setupAdminUserAction } from "./actions" // Importa a Server Action

export default function AdminPageClient() {
  const [uid, setUid] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSetupAdmin = async () => {
    if (!uid || !email) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, preencha o UID e o Email.",
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)
    try {
      // Chama a Server Action em vez da função direta
      const result = await setupAdminUserAction(uid, email)

      if (result.success) {
        toast({
          title: "Sucesso!",
          description: result.message,
        })
      } else {
        toast({
          title: "Erro",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro Inesperado",
        description: "Ocorreu um erro ao processar a solicitação.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Configurar Administrador</CardTitle>
        <CardDescription>Insira o UID e o Email do usuário do Firebase para torná-lo um administrador.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="uid" className="text-sm font-medium">
            User ID (UID)
          </label>
          <Input id="uid" value={uid} onChange={(e) => setUid(e.target.value)} placeholder="UID do Firebase Auth" />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemplo.com"
          />
        </div>
        <Button onClick={handleSetupAdmin} disabled={isLoading} className="w-full">
          {isLoading ? "Configurando..." : "Tornar Admin"}
        </Button>
      </CardContent>
    </Card>
  )
}
