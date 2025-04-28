"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Database, Save, RefreshCw, Check } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ExternalDbConfig() {
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testSuccess, setTestSuccess] = useState<boolean | null>(null)
  const [testMessage, setTestMessage] = useState<string | null>(null)

  // Estados para diferentes tipos de conexão
  const [mysqlConfig, setMysqlConfig] = useState({
    host: "",
    port: "3306",
    database: "",
    username: "",
    password: "",
  })

  const [postgresConfig, setPostgresConfig] = useState({
    host: "",
    port: "5432",
    database: "",
    username: "",
    password: "",
  })

  const [apiConfig, setApiConfig] = useState({
    url: "",
    apiKey: "",
    authType: "bearer",
  })

  const handleTestConnection = async (type: string) => {
    setTesting(true)
    setTestSuccess(null)
    setTestMessage(null)

    // Simular teste de conexão
    setTimeout(() => {
      setTesting(false)
      setTestSuccess(true)
      setTestMessage(`Conexão com ${type} testada com sucesso!`)
    }, 2000)
  }

  const handleSaveConnection = async (type: string) => {
    setSaving(true)

    // Simular salvamento de configuração
    setTimeout(() => {
      setSaving(false)
      setTestSuccess(true)
      setTestMessage(`Configuração de ${type} salva com sucesso!`)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Conexão com Banco de Dados Externo</h1>
        <p className="text-muted-foreground">Configure conexões com fontes de dados externas</p>
      </div>

      {testSuccess !== null && (
        <Alert variant={testSuccess ? "default" : "destructive"}>
          {testSuccess ? <Check className="h-4 w-4" /> : <Database className="h-4 w-4" />}
          <AlertTitle>{testSuccess ? "Sucesso" : "Erro"}</AlertTitle>
          <AlertDescription>{testMessage}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="mysql">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="mysql">MySQL</TabsTrigger>
          <TabsTrigger value="postgres">PostgreSQL</TabsTrigger>
          <TabsTrigger value="api">API REST</TabsTrigger>
        </TabsList>

        <TabsContent value="mysql" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração MySQL</CardTitle>
              <CardDescription>Configure a conexão com um banco de dados MySQL</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mysql-host">Host</Label>
                  <Input
                    id="mysql-host"
                    value={mysqlConfig.host}
                    onChange={(e) => setMysqlConfig({ ...mysqlConfig, host: e.target.value })}
                    placeholder="localhost"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mysql-port">Porta</Label>
                  <Input
                    id="mysql-port"
                    value={mysqlConfig.port}
                    onChange={(e) => setMysqlConfig({ ...mysqlConfig, port: e.target.value })}
                    placeholder="3306"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mysql-database">Banco de Dados</Label>
                <Input
                  id="mysql-database"
                  value={mysqlConfig.database}
                  onChange={(e) => setMysqlConfig({ ...mysqlConfig, database: e.target.value })}
                  placeholder="healthcare_db"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mysql-username">Usuário</Label>
                <Input
                  id="mysql-username"
                  value={mysqlConfig.username}
                  onChange={(e) => setMysqlConfig({ ...mysqlConfig, username: e.target.value })}
                  placeholder="root"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mysql-password">Senha</Label>
                <Input
                  id="mysql-password"
                  type="password"
                  value={mysqlConfig.password}
                  onChange={(e) => setMysqlConfig({ ...mysqlConfig, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => handleTestConnection("MySQL")} disabled={testing || saving}>
                {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                {testing ? "Testando..." : "Testar Conexão"}
              </Button>
              <Button onClick={() => handleSaveConnection("MySQL")} disabled={testing || saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {saving ? "Salvando..." : "Salvar Configuração"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="postgres" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração PostgreSQL</CardTitle>
              <CardDescription>Configure a conexão com um banco de dados PostgreSQL</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postgres-host">Host</Label>
                  <Input
                    id="postgres-host"
                    value={postgresConfig.host}
                    onChange={(e) => setPostgresConfig({ ...postgresConfig, host: e.target.value })}
                    placeholder="localhost"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postgres-port">Porta</Label>
                  <Input
                    id="postgres-port"
                    value={postgresConfig.port}
                    onChange={(e) => setPostgresConfig({ ...postgresConfig, port: e.target.value })}
                    placeholder="5432"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="postgres-database">Banco de Dados</Label>
                <Input
                  id="postgres-database"
                  value={postgresConfig.database}
                  onChange={(e) => setPostgresConfig({ ...postgresConfig, database: e.target.value })}
                  placeholder="healthcare_db"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postgres-username">Usuário</Label>
                <Input
                  id="postgres-username"
                  value={postgresConfig.username}
                  onChange={(e) => setPostgresConfig({ ...postgresConfig, username: e.target.value })}
                  placeholder="postgres"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postgres-password">Senha</Label>
                <Input
                  id="postgres-password"
                  type="password"
                  value={postgresConfig.password}
                  onChange={(e) => setPostgresConfig({ ...postgresConfig, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => handleTestConnection("PostgreSQL")} disabled={testing || saving}>
                {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                {testing ? "Testando..." : "Testar Conexão"}
              </Button>
              <Button onClick={() => handleSaveConnection("PostgreSQL")} disabled={testing || saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {saving ? "Salvando..." : "Salvar Configuração"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração API REST</CardTitle>
              <CardDescription>Configure a conexão com uma API REST externa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-url">URL da API</Label>
                <Input
                  id="api-url"
                  value={apiConfig.url}
                  onChange={(e) => setApiConfig({ ...apiConfig, url: e.target.value })}
                  placeholder="https://api.exemplo.com/v1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-key">Chave da API</Label>
                <Input
                  id="api-key"
                  value={apiConfig.apiKey}
                  onChange={(e) => setApiConfig({ ...apiConfig, apiKey: e.target.value })}
                  placeholder="sua_chave_api"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auth-type">Tipo de Autenticação</Label>
                <Select
                  value={apiConfig.authType}
                  onValueChange={(value) => setApiConfig({ ...apiConfig, authType: value })}
                >
                  <SelectTrigger id="auth-type">
                    <SelectValue placeholder="Selecione o tipo de autenticação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bearer">Bearer Token</SelectItem>
                    <SelectItem value="basic">Basic Auth</SelectItem>
                    <SelectItem value="apikey">API Key</SelectItem>
                    <SelectItem value="none">Sem Autenticação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => handleTestConnection("API REST")} disabled={testing || saving}>
                {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                {testing ? "Testando..." : "Testar Conexão"}
              </Button>
              <Button onClick={() => handleSaveConnection("API REST")} disabled={testing || saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {saving ? "Salvando..." : "Salvar Configuração"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
