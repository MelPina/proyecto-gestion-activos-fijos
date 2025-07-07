import { ApiDebug } from "@/components/debug/api-debug"

export default function DebugPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Debug API</h1>
        <p className="text-gray-400 mt-1">Herramientas de diagnóstico para la API</p>
      </div>

      <ApiDebug />
    </div>
  )
}
