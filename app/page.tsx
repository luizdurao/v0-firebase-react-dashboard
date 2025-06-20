import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  BarChart3,
  Building2,
  MapIcon as LucideMapIcon,
  Users,
  ShieldCheck,
  Activity,
  Filter,
  FileText,
  Settings,
} from "lucide-react" // Renomeado MapIcon para LucideMapIcon para evitar conflito

// Dados de exemplo para os cards de estatísticas (substituir por dados reais)
const statsData = [
  {
    title: "Hospitais Cadastrados",
    value: "12,847",
    icon: Building2,
    color: "text-blue-600",
    borderColor: "border-blue-500",
  },
  { title: "Leitos SUS", value: "287,543", icon: Users, color: "text-green-600", borderColor: "border-green-500" },
  {
    title: "Total de Leitos",
    value: "456,789",
    icon: BarChart3,
    color: "text-orange-600",
    borderColor: "border-orange-500",
  },
  {
    title: "Estados Cobertos",
    value: "27",
    icon: LucideMapIcon,
    color: "text-purple-600",
    borderColor: "border-purple-500",
  },
]

const navigationCards = [
  {
    title: "Análise de Hospitais",
    description: "Explore dados detalhados, leitos e evolução histórica por estado e ano.",
    href: "/hospitais",
    icon: Building2,
    buttonText: "Acessar Hospitais",
    variant: "default" as "default" | "outline",
  },
  {
    title: "Mapa Interativo",
    description: "Visualize a distribuição geográfica de hospitais e leitos em todo o Brasil.",
    href: "/map",
    icon: LucideMapIcon,
    buttonText: "Ver Mapa",
    variant: "outline" as "default" | "outline",
  },
  {
    title: "Painel Administrativo",
    description: "Gerencie dados, usuários e configurações do sistema (acesso restrito).",
    href: "/admin",
    icon: Settings,
    buttonText: "Acessar Admin",
    variant: "outline" as "default" | "outline",
  },
]

const featureCards = [
  {
    title: "Análise Histórica",
    description: "Acompanhe a evolução dos dados de saúde ao longo dos anos.",
    icon: Activity,
  },
  {
    title: "Filtros Avançados",
    description: "Refine suas buscas por estado, tipo de unidade, vínculo SUS e mais.",
    icon: Filter,
  },
  {
    title: "Relatórios Detalhados",
    description: "Gere e exporte relatórios com informações consolidadas.",
    icon: FileText,
  },
  {
    title: "Segurança de Dados",
    description: "Plataforma segura com controle de acesso e proteção de informações.",
    icon: ShieldCheck,
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-sky-100 dark:from-slate-900 dark:to-sky-950">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 text-center bg-white dark:bg-slate-800/30 shadow-sm">
          <div className="container mx-auto px-4">
            <img src="/placeholder.svg?height=80&width=80" alt="CN Saúde Logo" className="mx-auto mb-6 h-20 w-20" />
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Plataforma Nacional de Dados Hospitalares
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
              Análise, visualização e gestão integrada de informações de saúde para todo o Brasil.
            </p>
            <Link href="/hospitais">
              <Button
                size="lg"
                className="bg-sky-600 hover:bg-sky-700 text-white dark:bg-sky-500 dark:hover:bg-sky-600"
              >
                Explorar Dados de Hospitais <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 md:py-16 bg-slate-50 dark:bg-slate-800/60">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {statsData.map((stat) => (
                <Card
                  key={stat.title}
                  className={`shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 ${stat.borderColor} bg-white dark:bg-slate-800`}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Navigation Section */}
        <section className="py-12 md:py-16 bg-white dark:bg-slate-800/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold text-center text-slate-900 dark:text-white mb-10">
              Navegue pela Plataforma
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {navigationCards.map((nav) => (
                <Card
                  key={nav.title}
                  className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-700/90"
                >
                  <CardHeader className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <nav.icon className="h-8 w-8 text-sky-600 dark:text-sky-400" />
                      <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                        {nav.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 flex-grow">
                    <CardDescription className="text-slate-600 dark:text-slate-300 text-base">
                      {nav.description}
                    </CardDescription>
                  </CardContent>
                  <div className="p-6 pt-0 mt-auto">
                    <Link href={nav.href}>
                      <Button variant={nav.variant} className="w-full text-base py-3">
                        {nav.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-16 bg-slate-100 dark:bg-slate-800/60">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold text-center text-slate-900 dark:text-white mb-10">
              Funcionalidades Essenciais
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featureCards.map((feature) => (
                <div
                  key={feature.title}
                  className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
                >
                  <div className="mb-4 inline-flex items-center justify-center h-16 w-16 rounded-full bg-sky-100 dark:bg-sky-700/30 text-sky-600 dark:text-sky-400">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center bg-slate-200 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-t border-slate-300 dark:border-slate-700">
        <p>&copy; {new Date().getFullYear()} CN Saúde. Todos os direitos reservados.</p>
        <p className="text-sm">Desenvolvido com tecnologia de ponta para o setor de saúde.</p>
      </footer>
    </div>
  )
}
