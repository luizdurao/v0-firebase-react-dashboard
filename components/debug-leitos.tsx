"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Bug, Bed, Calendar } from "lucide-react"

interface Hospital {
  id: string
  nome?: string
  UF?: string
  municipio?: string
  historico?: {
    [ano: string]: {
      leitos?: {
        total?: number
        [tipoLeito: string]: number | undefined
      }
      [key: string]: any
    }
  }
  [key: string]: any
}

export default function DebugLeitos() {
  const [hospitais, setHospitais] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedHospital, setExpandedHospital] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<any>(null)

  const loadAndTestHospitais = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/hospitais")
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setHospitais(data.slice(0, 5)) // Apenas 5 para debug

      // Executar testes
      const results = testLeitosStructure(data.slice(0, 10))
      setTestResults(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  const testLeitosStructure = (hospitais: Hospital[]) => {
    let hospitaisComHistorico = 0
    let hospitaisComLeitos = 0
    const anosEncontrados = new Set<string>()
    const totalLeitosPorAno: Record<string, number> = {}
    let exemploDetalhado: any = null

    hospitais.forEach((hospital) => {
      if (hospital.historico) {
        hospitaisComHistorico++

        Object.entries(hospital.historico).forEach(([ano, dadosAno]) => {
          anosEncontrados.add(ano)

          if (dadosAno.leitos?.total) {
            const totalLeitos = dadosAno.leitos.total

            if (!totalLeitosPorAno[ano]) {
              totalLeitosPorAno[ano] = 0
            }
            totalLeitosPorAno[ano] += totalLeitos

            hospitaisComLeitos++

            if (!exemploDetalhado) {
              exemploDetalhado = {
                hospital: hospital.nome || hospital.id,
                ano,
                leitos: dadosAno.leitos,
                total: totalLeitos,
              }
            }
          }
        })
      }
    })

    return {
      totalHospitais: hospitais.length,
      hospitaisComHistorico,
      hospitaisComLeitos,
      anosEncontrados: Array.from(anosEncontrados).sort(),
      totalLeitosPorAno,
      exemploDetalhado,
    }
  }

  const getLeitos = (hospital: Hospital, ano?: number): number => {
    try {
      if (!hospital.historico) return 0

      let anoStr: string
      if (ano) {
        anoStr = ano.toString()
      } else {
        const anos = Object.keys(hospital.historico)
          .map(Number)
          .filter((n) => !isNaN(n))
          .sort((a, b) => b - a)
        if (anos.length === 0) return 0
        anoStr = anos[0].toString()
      }

      const dadosAno = hospital.historico[anoStr]
      if (!dadosAno?.leitos) return 0

      return dadosAno.leitos.total || 0
    } catch {
      return 0
    }
  }

  useEffect(() => {
    loadAndTestHospitais()
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Debug: Teste de Leitos por Ano
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button onClick={loadAndTestHospitais} disabled={loading}>
              {loading ? "Testando..." : "Executar Teste"}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {testResults && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold">{testResults.totalHospitais}</div>
                    <p className="text-sm text-muted-foreground">Hospitais testados</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-blue-600">{testResults.hospitaisComHistorico}</div>
                    <p className="text-sm text-muted-foreground">Com histórico</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-green-600">{testResults.hospitaisComLeitos}</div>
                    <p className="text-sm text-muted-foreground">Com leitos</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-orange-600">{testResults.anosEncontrados.length}</div>
                    <p className="text-sm text-muted-foreground">Anos diferentes</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Anos Encontrados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {testResults.anosEncontrados.map((ano: string) => (
                      <Badge key={ano} variant="outline">
                        {ano}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total de Leitos por Ano</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(testResults.totalLeitosPorAno)
                      .sort(([a], [b]) => b.localeCompare(a))
                      .map(([ano, total]) => (
                        <div key={ano} className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {ano}
                          </span>
                          <span className="flex items-center gap-2 font-medium">
                            <Bed className="h-4 w-4" />
                            {total.toLocaleString()} leitos
                          </span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {testResults.exemploDetalhado && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Exemplo Detalhado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p>
                        <strong>Hospital:</strong> {testResults.exemploDetalhado.hospital}
                      </p>
                      <p>
                        <strong>Ano:</strong> {testResults.exemploDetalhado.ano}
                      </p>
                      <p>
                        <strong>Total de leitos:</strong> {testResults.exemploDetalhado.total}
                      </p>
                      <details>
                        <summary className="cursor-pointer font-medium">Ver estrutura completa</summary>
                        <pre className="mt-2 p-4 bg-muted rounded text-xs overflow-auto">
                          {JSON.stringify(testResults.exemploDetalhado.leitos, null, 2)}
                        </pre>
                      </details>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de hospitais para debug */}
      <Card>
        <CardHeader>
          <CardTitle>Hospitais de Teste (Primeiros 5)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {hospitais.map((hospital) => (
              <Collapsible
                key={hospital.id}
                open={expandedHospital === hospital.id}
                onOpenChange={() => setExpandedHospital(expandedHospital === hospital.id ? null : hospital.id)}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted rounded">
                  <span className="font-medium">
                    {hospital.nome || hospital.id} - {hospital.UF}
                  </span>
                  <div className="flex items-center gap-2">
                    {hospital.historico && (
                      <Badge variant="outline">{Object.keys(hospital.historico).length} anos</Badge>
                    )}
                    {expandedHospital === hospital.id ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 border-l-2 border-muted ml-2">
                  {hospital.historico ? (
                    <div className="space-y-3">
                      {Object.entries(hospital.historico).map(([ano, dadosAno]) => (
                        <div key={ano} className="border rounded p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Ano {ano}</h4>
                            {dadosAno.leitos?.total && <Badge variant="default">{dadosAno.leitos.total} leitos</Badge>}
                          </div>

                          <div className="text-sm space-y-1">
                            <p>
                              <strong>Função getLeitos():</strong> {getLeitos(hospital, Number(ano))}
                            </p>

                            {dadosAno.leitos ? (
                              <details>
                                <summary className="cursor-pointer">Ver estrutura de leitos</summary>
                                <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto">
                                  {JSON.stringify(dadosAno.leitos, null, 2)}
                                </pre>
                              </details>
                            ) : (
                              <p className="text-muted-foreground">Sem dados de leitos</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Sem histórico disponível</p>
                  )}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
