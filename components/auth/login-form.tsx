"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { login } from "@/lib/actions/auth"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await login({ email, password })

      if (result.success && result.data) {
        // Store token and user data
        localStorage.setItem("auth_token", result.data.token)
        localStorage.setItem("user_data", JSON.stringify(result.data.usuario))

        // Redirect to dashboard
        router.push("/")
      } else {
        setError(result.error || "Error al iniciar sesión")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
            </button>
          </div>
        </div>
      </div>

      <div>
        <Button type="submit" disabled={isLoading} className="w-full">
          <LogIn className="h-4 w-4 mr-2" />
          {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </Button>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </form>
  )
}
