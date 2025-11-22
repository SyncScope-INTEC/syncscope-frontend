"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Github } from "lucide-react"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { login, clearError } from "@/lib/store/slices/authSlice"
import { toast } from "sonner"

export default function AdminLogin() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin/dashboard")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      toast.error("Por favor completa todos los campos")
      return
    }

    try {
      await dispatch(login({ email: formData.email, password: formData.password })).unwrap()
      toast.success("¡Bienvenido!")
      router.push("/admin/dashboard")
    } catch (_err) {
      // El error ya se maneja en el useEffect
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <Header />

      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Decorative Elements */}
          <div className="relative">
            {/* Background curves */}
            <div className="absolute inset-0 overflow-hidden">
              <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 800 600" fill="none">
                <path
                  d="M-100 300 Q200 100 400 300 T800 300"
                  stroke="#a3e635"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.3"
                />
                <path d="M800 200 Q600 400 400 200 T0 200" stroke="#8b5cf6" strokeWidth="2" fill="none" opacity="0.3" />
              </svg>
            </div>

            <div className="relative z-10 text-center py-20">
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-balance">
                Inicia sesión en SyncScope
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto text-balance">
                Accede a tu panel de métricas, auditorías y productividad en segundos.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-left block text-gray-900 font-medium">
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:ring-0"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-left block text-gray-900 font-medium">
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:ring-0"
                    disabled={loading}
                  />
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link href="/auth/forgot-password" className="text-green-500 hover:text-green-600 text-sm">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                {/* Login Buttons */}
                <div className="flex gap-4">
                  <Button
                    type="button"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    <Github className="w-5 h-5" />
                    Iniciar con Github
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium"
                    disabled={loading}
                  >
                    {loading ? "Iniciando..." : "Iniciar sesión"}
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-600">
                  ¿No tienes cuenta?{" "}
                  <Link href="/auth/register" className="text-purple-600 hover:text-purple-700 font-medium">
                    Regístrate aquí
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}