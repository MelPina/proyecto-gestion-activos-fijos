"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, Users, Building2, Package, FileText, TrendingUp, LogOut, User, Menu, X } from "lucide-react"
import type { UsuarioDto } from "@/lib/api-client"
import { logout } from "@/lib/actions/auth"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Empleados", href: "/empleados", icon: Users },
  { name: "Departamentos", href: "/departamentos", icon: Building2 },
  { name: "Tipos de Activos", href: "/tipos-activos", icon: Package },
  { name: "Activos Fijos", href: "/activos-fijos", icon: FileText },
  { name: "Depreciación", href: "/depreciacion", icon: TrendingUp },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<UsuarioDto | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user_data")
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  const handleLogout = async () => {
    await logout()
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gray-800 border-gray-700 text-white"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-700">
            <h1 className="text-xl font-bold text-white">Activos Fijos</h1>
          </div>

          {/* User info */}
          {user && (
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.nombre} {user.apellido}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{user.rol}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-700">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full bg-transparent border-gray-600 text-gray-300 hover:bg-red-600 hover:text-white hover:border-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
