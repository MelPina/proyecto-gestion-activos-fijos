"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { login } from "@/lib/actions/auth"

export function LoginForm() {
  const [email, setEmail] = useState("admin@sistema.com")
  const [password, setPassword] = useState("admin123")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Intento de login con la API
      const result = await login({ email, password })

      if (result.success && result.data) {
        // Guardar token y datos de usuario
        localStorage.setItem("auth_token", result.data.token)
        localStorage.setItem("user_data", JSON.stringify(result.data.usuario))

        // Redirigir al dashboard
        router.push("/dashboard")
      } else {
        // Modo de desarrollo: permitir login con credenciales hardcodeadas
        if (process.env.NODE_ENV === "development" && email === "admin@sistema.com" && password === "admin123") {
          console.log("⚠️ Usando modo de desarrollo para login")

          // Crear datos mock
          const mockToken = "dev-token-" + Date.now()
          const mockUser = {
            id: 1,
            nombre: "Administrador",
            email: "admin@sistema.com",
            idSistemaAuxiliar: 1,
            fechaCreacion: new Date().toISOString(),
          }

          // Guardar en localStorage
          localStorage.setItem("auth_token", mockToken)
          localStorage.setItem("user_data", JSON.stringify(mockUser))

          // Redirigir al dashboard
          router.push("/dashboard")
          return
        }

        setError(result.error || "Error al iniciar sesión")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Error de conexión con el servidor")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e2028] p-4">
      <Card className="w-full max-w-md bg-[#2a2d3a] border-0 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white text-center">Sistema de Activos</CardTitle>
          <CardDescription className="text-gray-400 text-center">Ingresa tus credenciales para acceder</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-900/50 border-red-800 text-white">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[#1e2028] border-gray-700 text-white focus:border-blue-500"
                  placeholder="admin@sistema.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-[#1e2028] border-gray-700 text-white pr-10 focus:border-blue-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Iniciando sesión...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <LogIn className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </span>
              )}
            </Button>
          </form>

          {/* <div className="mt-6 text-center text-sm text-gray-400">
            <p>Credenciales de prueba:</p>
            <p>Email: admin@sistema.com</p>
            <p>Contraseña: admin123</p>
          </div> */}
        </CardContent>
      </Card>
    </div>
  )
}
