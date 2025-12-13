"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TimezoneSelect } from "@/components/forms/timezone-select"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { register, clearError } from "@/lib/store/slices/authSlice"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    company_name: "",
    password: "",
    password_confirm: "",
    role: "developer",
    timezone: "UTC-4",
    industry: "",
    size: "5",
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

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value,
    })
  }

  const handleTimezoneChange = (value: string) => {
    setFormData({
      ...formData,
      timezone: value,
    })
  }

  const handleIndustryChange = (value: string) => {
    setFormData({
      ...formData,
      industry: value,
    })
  }

  const handleSizeChange = (value: string) => {
    setFormData({
      ...formData,
      size: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.email ||
      !formData.first_name ||
      !formData.last_name ||
      !formData.company_name ||
      !formData.password ||
      !formData.password_confirm
    ) {
      toast.error("Por favor completa todos los campos")
      return
    }

    if (formData.password !== formData.password_confirm) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    if (formData.password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres")
      return
    }

    try {
      await dispatch(register(formData)).unwrap()
      toast.success("¡Cuenta creada exitosamente!")
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
          <div className="relative">
            <div className="relative z-10 text-center py-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-balance">
                Únete a SyncScope
              </h1>

              <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto text-balance">
                Crea tu cuenta y comienza a optimizar la productividad de tu equipo
              </p>

              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first_name" className="text-left block text-gray-900 font-medium">
                      Nombre
                    </Label>
                    <Input
                      id="first_name"
                      type="text"
                      placeholder="Juan"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:ring-0"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_name" className="text-left block text-gray-900 font-medium">
                      Apellido
                    </Label>
                    <Input
                      id="last_name"
                      type="text"
                      placeholder="Pérez"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:ring-0"
                      disabled={loading}
                    />
                  </div>
                </div>

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
                  <Label htmlFor="company_name" className="text-left block text-gray-900 font-medium">
                    Nombre de la empresa
                  </Label>
                  <Input
                    id="company_name"
                    type="text"
                    placeholder="Mi Empresa S.A."
                    value={formData.company_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:ring-0"
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-left block text-gray-900 font-medium">
                      Rol
                    </Label>
                    <Select value={formData.role} onValueChange={handleRoleChange} disabled={loading}>
                      <SelectTrigger className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:ring-0">
                        <SelectValue placeholder="Selecciona tu rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="developer">Desarrollador</SelectItem>
                        <SelectItem value="project_manager">Project Manager</SelectItem>
                        <SelectItem value="team_lead">Team Lead</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-left block text-gray-900 font-medium">
                      Zona horaria
                    </Label>
                    <TimezoneSelect
                      value={formData.timezone}
                      onChange={handleTimezoneChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-left block text-gray-900 font-medium">
                      Industria
                    </Label>
                    <Select value={formData.industry} onValueChange={handleIndustryChange} disabled={loading}>
                      <SelectTrigger className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:ring-0">
                        <SelectValue placeholder="Selecciona la industria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Tecnología</SelectItem>
                        <SelectItem value="finance">Finanzas</SelectItem>
                        <SelectItem value="healthcare">Salud</SelectItem>
                        <SelectItem value="education">Educación</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufactura</SelectItem>
                        <SelectItem value="consulting">Consultoría</SelectItem>
                        <SelectItem value="other">Otra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size" className="text-left block text-gray-900 font-medium">
                      Tamaño de la empresa
                    </Label>
                    <Select value={formData.size} onValueChange={handleSizeChange} disabled={loading}>
                      <SelectTrigger className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:ring-0">
                        <SelectValue placeholder="Selecciona el tamaño" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">Hasta 5 usuarios</SelectItem>
                        <SelectItem value="15">Hasta 15 usuarios</SelectItem>
                        <SelectItem value="25">Hasta 25 usuarios</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  <div className="space-y-2">
                    <Label htmlFor="password_confirm" className="text-left block text-gray-900 font-medium">
                      Confirmar contraseña
                    </Label>
                    <Input
                      id="password_confirm"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password_confirm}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:ring-0"
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium text-lg"
                  disabled={loading}
                >
                  {loading ? "Creando cuenta..." : "Crear cuenta"}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  ¿Ya tienes cuenta?{" "}
                  <Link href="/auth/admin-login" className="text-purple-600 hover:text-purple-700 font-medium">
                    Inicia sesión aquí
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