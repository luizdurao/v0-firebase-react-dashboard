"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Copy, ExternalLink } from "lucide-react"

export default function FirestoreRulesHelper() {
  const [copied, setCopied] = useState(false)

  const basicRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acesso público a dados não sensíveis
    match /stats/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && exists(/databases/$(database)/documents/users/$(request.auth.uid)) && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /regions/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && exists(/databases/$(database)/documents/users/$(request.auth.uid)) && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /hospitals/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && exists(/databases/$(database)/documents/users/$(request.auth.uid)) && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Permitir que usuários acessem apenas seus próprios dados
    match /users/{userId} {
      allow read: if request.auth != null && (request.auth.uid == userId || exists(/databases/$(database)/documents/users/$(request.auth.uid)) && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && (request.auth.uid == userId || exists(/databases/$(database)/documents/users/$(request.auth.uid)) && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Regra para permitir acesso inicial para configuração de admin
    match /users/admin {
      allow read, write: if request.auth != null && request.auth.token.email == 'admin@saude.gov.br';
    }
    
    // Regra para permitir que o primeiro usuário admin crie sua conta
    match /users/{userId} {
      allow create: if request.auth != null && 
                     request.auth.token.email == 'admin@saude.gov.br' && 
                     request.resource.data.role == 'admin';
    }
  }
}
`

  const developmentRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ATENÇÃO: Estas regras são apenas para desenvolvimento e testes
    // NÃO USE EM PRODUÇÃO!
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
`

  const copyRules = (rules) => {
    navigator.clipboard.writeText(rules.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configuração de Regras de Segurança do Firestore</CardTitle>
        <CardDescription>
          O erro "Missing or insufficient permissions" indica que as regras de segurança do Firestore estão impedindo o
          acesso aos dados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Atenção</AlertTitle>
          <AlertDescription>
            Você precisa configurar as regras de segurança do Firestore para permitir o acesso aos dados. Siga as
            instruções abaixo.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="basic">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Regras Recomendadas</TabsTrigger>
            <TabsTrigger value="development">Regras para Desenvolvimento</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
              <pre className="text-xs">{basicRules}</pre>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Estas regras permitem acesso público para leitura de dados não sensíveis e restringem a escrita apenas
              para administradores.
            </p>
          </TabsContent>

          <TabsContent value="development">
            <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
              <pre className="text-xs">{developmentRules}</pre>
            </div>
            <p className="mt-2 text-sm text-gray-600 font-bold">
              ATENÇÃO: Estas regras permitem acesso total a todos os documentos. Use apenas para desenvolvimento e
              testes. NÃO USE EM PRODUÇÃO!
            </p>
          </TabsContent>
        </Tabs>

        {copied && (
          <Alert className="mt-4 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-700">Copiado!</AlertTitle>
            <AlertDescription className="text-green-600">
              As regras foram copiadas para a área de transferência.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => copyRules(basicRules)}>
          <Copy className="h-4 w-4 mr-2" />
          Copiar Regras Recomendadas
        </Button>
        <Button
          variant="outline"
          onClick={() => window.open("https://console.firebase.google.com", "_blank")}
          className="ml-2"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Abrir Console do Firebase
        </Button>
      </CardFooter>
    </Card>
  )
}
