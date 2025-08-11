"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
<<<<<<< HEAD
import { LayoutDashboard, Settings, Building2, Users, Package, FileText, ChevronLeft, ChevronRight, BookDown, BookType, } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  // {
  //   title: "Gestión",
  //   href: "/gestion",
  //   icon: Settings,
  // },
  {
    title: "Departamentos",
    href: "/departamentos",
    icon: Building2,
  },
  {
    title: "Empleados",
    href: "/empleados",
    icon: Users,
  },
  {
    title: "Tipos de Activos",
    href: "/tipos-activos",
    icon: Package,
  },
  {
    title: "Activos Fijos",
    href: "/activos-fijos",
    icon: FileText,
  },
    {
    title: "Depreciacion",
    href: "/depreciacion",
    icon: BookDown,
  },
    {
    title: "Asiento",
    href: "/asiento",
    icon: BookType,
  },
]
=======
import { LayoutDashboard, Users, Building2, Package, FileText, TrendingDown, LogOut, Menu, X, BookOpen } from "lucide-react"
import { logout } from "@/lib/actions/auth"
import { useRouter } from "next/navigation"
>>>>>>> origin/dev-mel

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Empleados",
      path: "/empleados",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Departamentos",
      path: "/departamentos",
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      name: "Tipos de Activos",
      path: "/tipos-activos",
      icon: <Package className="h-5 w-5" />,
    },
    {
      name: "Activos Fijos",
      path: "/activos-fijos",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Depreciación",
      path: "/depreciacion",
      icon: <TrendingDown className="h-5 w-5" />,
    },
    {
      name: "Entradas Contables",
      path: "/entradas-contables",
      icon: <BookOpen className="h-5 w-5" />,
    },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 p-2 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-[#2a2d3a] w-64 min-h-screen flex flex-col transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } fixed md:static z-40`}
      >
        <div className="p-4 bg-blue-600">
          <h1 className="text-xl font-bold">Gestión Activo Fijo</h1>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    pathname === item.path ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-[#3a3d4a]"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-md text-gray-300 hover:bg-[#3a3d4a] transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  )
}
