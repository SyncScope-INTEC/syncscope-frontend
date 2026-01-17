"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Lock, Loader2, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { authService } from "@/lib/services/authService"
import { useAppDispatch } from "@/lib/store/hooks"
import { setCredentials } from "@/lib/store/slices/authSlice"

export default function ChangeInitialPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()

  const [formData, setFormData] = useState({
    temp_password: '',
    new_password: '',
    new_password_confirm: '',
  })

  const [loading, setLoading] = useState(false)
  const [showTempPassword, setShowTempPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Get email from URL params (passed from login)
  const email = searchParams.get('email') || ''

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.temp_password || !formData.new_password || !formData.new_password_confirm) {
      toast.error('Por favor completa todos los campos')
      return
    }

    if (formData.new_password !== formData.new_password_confirm) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    if (formData.new_password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres')
      return
    }

    if (formData.new_password === formData.temp_password) {
      toast.error('La nueva contraseña debe ser diferente a la temporal')
      return
    }

    setLoading(true)

    try {
      const response = await authService.changeInitialPassword({
        temp_password: formData.temp_password,
        new_password: formData.new_password,
        new_password_confirm: formData.new_password_confirm,
      })

      // Remove pending password change flag
      localStorage.removeItem('pending_password_change')

      toast.success('¡Contraseña cambiada exitosamente!')

      // Auto-login with new tokens
      if (response.tokens && response.tokens.access && response.tokens.refresh) {
        dispatch(setCredentials({
          user: response.user || { id: '', email, first_name: '', last_name: '', role: '' },
          accessToken: response.tokens.access,
          refreshToken: response.tokens.refresh,
          sessionToken: response.session_token || '',
        }))

        // Redirect to dashboard
        setTimeout(() => {
          router.push('/admin/dashboard')
        }, 500)
      } else {
        // If no tokens, redirect to login
        toast.info('Por favor inicia sesión con tu nueva contraseña')
        setTimeout(() => {
          router.push('/auth/admin-login')
        }, 1000)
      }
    } catch (error: any) {
      console.error('Error changing password:', error)
      toast.error(error.response?.data?.error || 'Error al cambiar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <Header />

      <main className="container mx-auto px-6 py-16">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Cambia tu contraseña
            </h1>
            <p className="text-gray-600">
              Por seguridad, debes cambiar tu contraseña temporal
            </p>
            {email && (
              <p className="text-sm text-gray-500 mt-2">
                Cuenta: <span className="font-semibold">{email}</span>
              </p>
            )}
          </div>

          {/* Logout Button */}
          <div className="absolute top-4 right-4 md:top-8 md:right-8">
            <Button
              variant="ghost"
              onClick={() => {
                localStorage.removeItem('persist:root')
                router.push('/auth/admin-login')
              }}
              className="text-gray-500 hover:text-red-600 gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
              </svg>
              Cerrar Sesión
            </Button>
          </div>

          {/* Form */}
          <Card className="p-8 border-2 border-purple-200 bg-white/80 backdrop-blur">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Temporary Password */}
              <div className="space-y-2">
                <Label htmlFor="temp_password" className="text-gray-900 font-medium">
                  Contraseña temporal
                </Label>
                <div className="relative">
                  <Input
                    id="temp_password"
                    type={showTempPassword ? "text" : "password"}
                    placeholder="Ingresa la contraseña del correo"
                    value={formData.temp_password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:ring-0"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowTempPassword(!showTempPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showTempPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Revisa tu correo electrónico
                </p>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="new_password" className="text-gray-900 font-medium">
                  Nueva contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="new_password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={formData.new_password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:ring-0"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                <Label htmlFor="new_password_confirm" className="text-gray-900 font-medium">
                  Confirmar nueva contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="new_password_confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repite tu nueva contraseña"
                    value={formData.new_password_confirm}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:ring-0"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium text-lg"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Cambiando contraseña...
                  </div>
                ) : (
                  'Cambiar contraseña'
                )}
              </Button>
            </form>
          </Card>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Tu contraseña temporal fue enviada a tu correo electrónico.
              Si no la encuentras, revisa tu carpeta de spam.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
