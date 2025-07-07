"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"

export function ApiDebug() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const runTests = async () => {
    setLoading(true)
    setTestResults([])

    const tests = [
      {
        name: "Test API Base URL",
        test: async () => {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"
          return { url: apiUrl, status: "configured" }
        },
      },
      {
        name: "Test HTTP Health Endpoint",
        test: async () => {
          const response = await fetch("http://localhost:5001/api/health", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          })
          return {
            status: response.status,
            ok: response.ok,
            data: await response.json(),
          }
        },
      },
      {
        name: "Test HTTPS Health Endpoint (puede fallar)",
        test: async () => {
          const response = await fetch("https://localhost:7001/api/health", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          })
          return {
            status: response.status,
            ok: response.ok,
            data: await response.json(),
          }
        },
      },
      {
        name: "Test Departamentos API (HTTP)",
        test: async () => {
          return await apiClient.get("/departamentos")
        },
      },
      {
        name: "Test Empleados API (HTTP)",
        test: async () => {
          return await apiClient.get("/empleados")
        },
      },
      {
        name: "Test Direct HTTP Call",
        test: async () => {
          const response = await fetch("http://localhost:5001/api/departamentos", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Origin: "http://localhost:3000",
            },
          })
          return {
            status: response.status,
            ok: response.ok,
            headers: Object.fromEntries(response.headers.entries()),
            data: response.ok ? await response.json() : await response.text(),
          }
        },
      },
    ]

    for (const test of tests) {
      try {
        console.log(`🧪 Running test: ${test.name}`)
        const result = await test.test()
        setTestResults((prev) => [
          ...prev,
          {
            name: test.name,
            success: true,
            result,
          },
        ])
      } catch (error) {
        console.error(`❌ Test failed: ${test.name}`, error)
        setTestResults((prev) => [
          ...prev,
          {
            name: test.name,
            success: false,
            error: error instanceof Error ? error.message : String(error),
          },
        ])
      }
    }

    setLoading(false)
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">🔧 API Debug Tool</CardTitle>
        <p className="text-gray-400 text-sm">
          Ahora usando HTTP (puerto 5001) para evitar problemas de certificados SSL
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runTests} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
          {loading ? "Ejecutando pruebas..." : "Ejecutar Pruebas de API"}
        </Button>

        <div className="space-y-2">
          {testResults.map((test, index) => (
            <div
              key={index}
              className={`p-3 rounded-md ${test.success ? "bg-green-900/20 border border-green-700" : "bg-red-900/20 border border-red-700"}`}
            >
              <div className="flex items-center space-x-2">
                <span className={test.success ? "text-green-400" : "text-red-400"}>{test.success ? "✅" : "❌"}</span>
                <span className="text-white font-medium">{test.name}</span>
              </div>
              <pre className="mt-2 text-xs text-gray-300 overflow-auto max-h-40">
                {JSON.stringify(test.success ? test.result : test.error, null, 2)}
              </pre>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded-md">
          <h4 className="text-blue-400 font-medium">URLs de Prueba:</h4>
          <ul className="text-sm text-gray-300 mt-2 space-y-1">
            <li>
              • HTTP API: <code>http://localhost:5001/api/health</code>
            </li>
            <li>
              • HTTP Swagger: <code>http://localhost:5001/swagger</code>
            </li>
            <li>
              • HTTPS API: <code>https://localhost:7001/api/health</code>
            </li>
            <li>
              • HTTPS Swagger: <code>https://localhost:7001/swagger</code>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
