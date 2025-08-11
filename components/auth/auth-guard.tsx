"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { validateToken } from "@/lib/actions/auth"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar si hay token en localStorage
        const token = localStorage.getItem("auth_token")

        if (!token) {
          console.log("No token found, redirecting to login")
          setIsAuthenticated(false)
          router.push("/login")
          return
        }

        // En desarrollo, aceptar cualquier token
        if (process.env.NODE_ENV === "development") {
          console.log("Development mode: accepting any token")
          setIsAuthenticated(true)
          return
        }

        // En producción, validar el token con la API
        const isValid = await validateToken(token)

        if (isValid) {
          console.log("Token is valid")
          setIsAuthenticated(true)
        } else {
          console.log("Token is invalid, redirecting to login")
          localStorage.removeItem("auth_token")
          localStorage.removeItem("user_data")
          setIsAuthenticated(false)
          router.push("/login")
        }
      } catch (error) {
        console.error("Error validating token:", error)
        setIsAuthenticated(false)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  // Mostrar spinner mientras se verifica la autenticación
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1e2028]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-white">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Si está autenticado, mostrar el contenido
  if (isAuthenticated) {
    return <>{children}</>
  }

  // Si no está autenticado, no mostrar nada (ya se redirigió)
  return null
}
