"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, XCircle, RefreshCw } from "lucide-react"

export default function SimpleDataTest() {
  const [testResults, setTestResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runBasicTest = async () => {
    setLoading(true)
    const results: any = {
      timestamp: new Date().toLocaleString(),
      tests: [],
    }

    try {
      // Teste 1: API básica
      results.tests.push({ name: "Testando API...", status: "running" })
      setTestResults({ ...results })

      const response = await fetch("/api/hospitais")

      if (!response.ok) {
        results.tests[0] = {
          name: "API Response",
          status: "error",
          message: `Status ${response.status}: ${response.statusText}`,
        }
        setTestResults({ ...results })
        return
      }

      results.tests[0] = { name: "API Response", status: "success", message: "API respondeu com sucesso" }

      // Teste 2: Parsing JSON
      results.tests.push({ name: "Parsing JSON...", status: "running" })
      setTestResults({ ...results })

      const data = await response.json()

      if (!Array.isArray(data)) {
        results.tests[1] = {
          name: "JSON Parsing",
          status: "error",
          message: `Dados não são array: ${typeof data}`,
        }
        setTestResults({ ...results })
        return
      }

      results.tests[1] = {
        name: "JSON Parsing",
        status: "success",
        message: `Array com ${data.length} itens`,
      }

      // Teste 3: Estrutura dos dados
      results.tests.push({ name: "Analisando estrutura...", status: "running" })
      setTestResults({ ...results })

      if (data.length === 0) {
        results.tests[2] = {
          name: "Estrutura dos Dados",
          status: "warning",
          message: "Array vazio - sem hospitais",
        }
      } else {
        const firstHospital = data[0]
        const fields = Object.keys(firstHospital)

        results.tests[2] = {
          name: "Estrutura dos Dados",
          status: "success",
          message: `Campos: ${fields.slice(0, 5).join(", ")}${fields.length > 5 ? "..." : ""}`,
        }

        // Teste 4: Dados históricos
        results.tests.push({ name: "Verificando histórico...", status: "running" })
        setTestResults({ ...results })

        const hospitaisComHistorico = data.filter((h: any) => h.historico).length
        const totalAnos = new Set()

        data.forEach((hospital: any) => {
          if (hospital.historico) {
            Object.keys(hospital.historico).forEach((ano) => totalAnos.add(ano))
          }
        })

        results.tests[3] = {
          name: "Dados Históricos",
          status: hospitaisComHistorico > 0 ? "success" : "warning",
          message: `${hospitaisComHistorico}/${data.length} hospitais com histórico. Anos: ${Array.from(totalAnos).slice(0, 3).join(", ")}`,
        }

        // Teste 5: Dados de leitos
        results.tests.push({ name: "Verificando leitos...", status: "running" })
        setTestResults({ ...results })

        let hospitaisComLeitos = 0
        let totalLeitos = 0

        data.forEach((hospital: any) => {
          if (hospital.historico) {
            Object.values(hospital.historico).forEach((dadosAno: any) => {
              if (dadosAno.leitos?.total) {
                hospitaisComLeitos++
                totalLeitos += dadosAno.leitos.total
              }
            })
          }
        })

        results.tests[4] = {
          name: "Dados de Leitos",
          status: hospitaisComLeitos > 0 ? "success" : "error",
          message: `${hospitaisComLeitos} registros com leitos. Total: ${totalLeitos.toLocaleString()}`,
        }
      }

      // Dados de exemplo
      results.sampleData = data.slice(0, 2).map((hospital: any) => ({
        id: hospital.id,
        nome: hospital.nome || "N/A",
        UF: hospital.UF || "N/A",
        historico: hospital.historico ? Object.keys(hospital.historico).length + " anos" : "Sem histórico",
      }))
    } catch (error) {
      results.tests.push({
        name: "Erro Geral",
        status: "error",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      })
    }

    setTestResults(results)
    setLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "running":
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "border-green-200 bg-green-50"
      case "error":
        return "border-red-200 bg-red-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
      case "running":
        return "border-blue-200 bg-blue-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🔍 Diagnóstico Simples - Por que os dados não aparecem?</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={runBasicTest} disabled={loading} className="mb-4">
            {loading ? "Executando testes..." : "Executar Diagnóstico"}
          </Button>

          {testResults && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">Executado em: {testResults.timestamp}</div>

              <div className="space-y-2">
                {testResults.tests.map((test: any, index: number) => (
                  <div key={index} className={`p-3 rounded border ${getStatusColor(test.status)}`}>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(test.status)}
                      <span className="font-medium">{test.name}</span>
                    </div>
                    {test.message && <div className="mt-1 text-sm text-muted-foreground ml-6">{test.message}</div>}
                  </div>
                ))}
              </div>

              {testResults.sampleData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Amostra dos Dados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {testResults.sampleData.map((hospital: any, index: number) => (
                        <div key={index} className="p-2 border rounded">
                          <div className="font-medium">{hospital.nome}</div>
                          <div className="text-sm text-muted-foreground">
                            ID: {hospital.id} | UF: {hospital.UF} | Histórico: {hospital.historico}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
