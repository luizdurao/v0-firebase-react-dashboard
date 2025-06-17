import { FirebaseSetupGuide } from "@/components/firebase-setup-guide"

export default function SetupPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Configuração do Firebase</h1>
          <p className="text-gray-600 mt-2">Configure o Firebase para usar todas as funcionalidades do dashboard</p>
        </div>
        <FirebaseSetupGuide />
      </div>
    </div>
  )
}
