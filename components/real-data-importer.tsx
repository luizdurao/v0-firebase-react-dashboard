"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, AlertTriangle, Database, Download, RefreshCw } from "lucide-react"
import { importRealDataToFirebase, checkRealDataImported, loadRealHospitalData } from "@/lib/real-data-processor"

export default function RealDataImporter() {
  const [importing, setImporting] = useState(false)
  const [checking, setChecking] = useState(false)
  const [importStatus, setImportStatus] = useState(null)
  const [dataStatus, setDataStatus] = useState(null)
  const [progress, setProgress] = useState(0)

  const checkImportStatus = async () => {
    setChecking(true)
    try {
      const status = await checkRealDataImported()
      setDataStatus(status)
    } catch (error) {
      setDataStatus({ imported: false, error: error.message })
    } finally {
      setChecking(false)
    }
  }

  const handleImportData = async () => {
    setImporting(true)
    setProgress(0)
    setImportStatus(null)

    try {
      // Simular progresso
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 500)

      const result = await importRealDataToFirebase()

      clearInterval(progressInterval)
      setProgress(100)

      setImportStatus({
        success: true,
        message: result.message,
        stats: result.stats,
      })

      // Atualizar status após importação
      setTimeout(() => {
        checkImportStatus()
      }, 1000)
    } catch (error) {
      setImportStatus({
        success: false,
        message: `Erro na importação: ${error.message}`,
      })
      setProgress(0)
    } finally {
      setImporting(false)
    }
  }

  const handleTestDataLoad = async () => {
    try {
      const data = await loadRealHospitalData()
      const stateCount = Object.keys(data).length
      alert(`✅ Dados carregados com sucesso!\n${stateCount} estados encontrados`)
    } catch (error) {
      alert(`❌ Erro ao carregar dados: ${error.message}`)
    }
  }

  useEffect(() => {
    checkImportStatus()
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Importador de Dados Reais
          </CardTitle>
          <CardDescription>Importe dados hospitalares reais do Brasil para o Firebase</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status da Importação */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Status dos Dados</h4>
              <Button variant="outline" size="sm" onClick={checkImportStatus} disabled={checking}>
                {checking ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              </Button>
            </div>

            {dataStatus && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {dataStatus.imported ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-medium">
                    {dataStatus.imported ? "Dados já importados" : "Dados não importados"}
                  </span>
                </div>

                {dataStatus.imported && dataStatus.recordsImported && (
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="p-2 bg-muted rounded text-center">
                      <div className="font-medium">{dataStatus.recordsImported.states}</div>
                      <div className="text-muted-foreground">Estados</div>
                    </div>
                    <div className="p-2 bg-muted rounded text-center">
                      <div className="font-medium">{dataStatus.recordsImported.regions}</div>
                      <div className="text-muted-foreground">Regiões</div>
                    </div>
                    <div className="p-2 bg-muted rounded text-center">
                      <div className="font-medium">{dataStatus.recordsImported.nationalStats}</div>
                      <div className="text-muted-foreground">Nacional</div>
                    </div>
                  </div>
                )}

                {dataStatus.lastImport && (
                  <div className="text-sm text-muted-foreground">
                    Última importação: {new Date(dataStatus.lastImport.seconds * 1000).toLocaleString("pt-BR")}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Progresso da Importação */}
          {importing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Importando dados...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Resultado da Importação */}
          {importStatus && (
            <Alert variant={importStatus.success ? "default" : "destructive"}>
              {importStatus.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>{importStatus.success ? "Importação Concluída" : "Erro na Importação"}</AlertTitle>
              <AlertDescription>
                {importStatus.message}
                {importStatus.success && importStatus.stats && (
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>Estados: {importStatus.stats.states}</div>
                    <div>Regiões: {importStatus.stats.regions}</div>
                    <div>Hospitais: {importStatus.stats.totalHospitals?.toLocaleString("pt-BR")}</div>
                    <div>Leitos: {importStatus.stats.totalBeds?.toLocaleString("pt-BR")}</div>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Ações */}
          <div className="flex gap-2">
            <Button onClick={handleImportData} disabled={importing} className="flex-1">
              {importing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Importando...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Importar Dados Reais
                </>
              )}
            </Button>

            <Button variant="outline" onClick={handleTestDataLoad} disabled={importing}>
              Testar Carregamento
            </Button>
          </div>

          {/* Informações sobre os Dados */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Sobre os Dados</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Dados de hospitais privados de todos os 27 estados brasileiros</li>
                <li>Informações de 2024 sobre leitos, distribuição geográfica e tipos de atendimento</li>
                <li>Coordenadas geográficas para visualização no mapa</li>
                <li>Distribuições por porte populacional e hospitalar</li>
                <li>Classificação por tipo de hospital e atendimento (SUS/Não-SUS)</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
