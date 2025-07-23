import type React from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Sidebar } from "@/components/layout/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-[#1e2028]">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </AuthGuard>
  )
}
