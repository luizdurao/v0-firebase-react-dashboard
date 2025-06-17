import Layout from "@/components/layout"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function TestPages() {
  const pages = [
    { name: "Dashboard", href: "/", description: "Página principal com estatísticas" },
    { name: "Mapa", href: "/map", description: "Visualização geográfica dos dados" },
    { name: "Hospitais", href: "/hospitals", description: "Gerenciamento de hospitais" },
    { name: "Regiões", href: "/regions", description: "Configuração de regiões" },
    { name: "Banco Externo", href: "/external-db", description: "Configuração de banco de dados" },
    { name: "Setup", href: "/setup", description: "Configuração inicial do sistema" },
    { name: "Admin", href: "/admin", description: "Painel administrativo" },
  ]

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Teste de Páginas</h1>
          <p className="text-gray-600">Verifique se todas as páginas estão funcionando corretamente</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => (
            <Card key={page.href} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {page.name}
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </CardTitle>
                <CardDescription>{page.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={page.href}>
                  <Button className="w-full">Acessar {page.name}</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Como navegar:</h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Use o menu lateral (sidebar) para navegar entre as páginas</li>
            <li>No mobile, clique no ícone de menu (☰) para abrir o sidebar</li>
            <li>Cada página tem sua própria funcionalidade específica</li>
            <li>O tema pode ser alternado entre claro e escuro</li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}
