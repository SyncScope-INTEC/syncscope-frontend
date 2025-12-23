"use client"

import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/lib/store/hooks"
import { logout } from "@/lib/store/slices/authSlice"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShieldX } from "lucide-react"
import { toast } from "sonner"

export default function AccessDeniedPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleLogout = async () => {
    try {
      // Obtener tokens del localStorage
      const state = localStorage.getItem('persist:root')
      if (state) {
        const parsedState = JSON.parse(state)
        const authState = JSON.parse(parsedState.auth)
        const refreshToken = authState.refreshToken
        const sessionToken = authState.sessionToken

        if (refreshToken && sessionToken) {
          await dispatch(logout({ refreshToken, sessionToken })).unwrap()
        }
      }

      // Limpiar localStorage
      localStorage.removeItem('persist:root')
      
      toast.success('Sesión cerrada correctamente')
      router.push('/auth/admin-login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      // Aún si falla, limpiar y redirigir
      localStorage.removeItem('persist:root')
      router.push('/auth/admin-login')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-white">
      <Header />

      <main className="flex-1 container mx-auto px-6 py-16 flex items-center justify-center">
        <Card className="max-w-md w-full p-8 border-2 border-red-200 bg-white/80 backdrop-blur">
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <ShieldX className="w-10 h-10 text-red-600" />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Acceso Denegado
              </h1>
              <p className="text-lg text-gray-600">
                Los desarrolladores no pueden acceder al panel de administración
              </p>
            </div>

            {/* Description */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                Tu cuenta de tipo <span className="font-semibold">Desarrollador</span> no tiene permisos para acceder a esta sección. 
                Solo los usuarios con rol de <span className="font-semibold">Administrador</span> o <span className="font-semibold">Supervisor</span> pueden acceder al panel administrativo.
              </p>
            </div>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium text-lg"
            >
              Cerrar Sesión
            </Button>

            {/* Help Text */}
            <p className="text-sm text-gray-500">
              Si crees que esto es un error, contacta con tu administrador
            </p>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
