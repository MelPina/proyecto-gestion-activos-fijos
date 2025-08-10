"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div
      className={cn("bg-gray-800 border-r border-gray-700 transition-all duration-300", collapsed ? "w-16" : "w-64")}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            {/* <Package className="h-6 w-6 text-blue-400" /> */}
            <span className="font-semibold text-white">Gestión Activo Fijo</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="mt-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    collapsed && "justify-center",
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
