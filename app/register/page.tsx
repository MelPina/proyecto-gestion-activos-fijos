import { RegisterForm } from "@/components/auth/register-form";


export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Registrar Usuario</h2>
          <p className="mt-2 text-center text-sm text-gray-400">Sistema de Gestión de Activos Fijos</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
