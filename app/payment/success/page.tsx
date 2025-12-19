"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TimezoneSelect } from "@/components/forms/timezone-select"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CheckCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useAppDispatch } from "@/lib/store/hooks"
import { login } from "@/lib/store/slices/authSlice"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()

  const [loading, setLoading] = useState(true)
  const [customerData, setCustomerData] = useState<any>(null)
  const [plan, setPlan] = useState<string>('')

  // Form data
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    company_name: '',
    role: 'developer',
    timezone: 'America/Bogota',
    password: '',
    password_confirm: '',
  })

  const [creating, setCreating] = useState(false)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      toast.error('Sesión de pago no encontrada')
      router.push('/pricing')
      return
    }

    // Verificar el pago con Stripe
    const verifyPayment = async () => {
      try {
        const response = await fetch('/api/stripe/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        })

        if (!response.ok) {
          throw new Error('Error al verificar el pago')
        }

        const data = await response.json()
        setCustomerData(data.customerData)
        setPlan(data.plan)
        setLoading(false)
      } catch (error: any) {
        console.error('Error verifying payment:', error)
        toast.error('Error al verificar el pago')
        router.push('/pricing')
      }
    }

    verifyPayment()
  }, [searchParams, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, role: value })
  }

  const handleTimezoneChange = (value: string) => {
    setFormData({ ...formData, timezone: value })
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.first_name || !formData.last_name || !formData.company_name || !formData.password || !formData.password_confirm) {
      toast.error('Por favor completa todos los campos')
      return
    }

    if (formData.password !== formData.password_confirm) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setCreating(true)

    try {
      // Crear usuario en el backend
      const authUrl = process.env.NEXT_PUBLIC_AUTH_URL
      const registerResponse = await fetch(`${authUrl}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: customerData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: customerData.phone || '',
          password: formData.password,
          password_confirm: formData.password_confirm,
          company_name: formData.company_name,
          role: formData.role,
          plan: plan,
        }),
      })

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json()
        throw new Error(errorData.message || 'Error al crear la cuenta')
      }

      toast.success('¡Cuenta creada exitosamente!')

      // Login automático
      try {
        await dispatch(login({
          email: customerData.email,
          password: formData.password,
        })).unwrap()

        // Redirigir al dashboard
        router.push('/admin/dashboard')
      } catch (loginError) {
        // Si falla el login automático, redirigir a login manual
        toast.info('Por favor inicia sesión con tus credenciales')
        router.push('/auth/admin-login')
      }
    } catch (error: any) {
      console.error('Error creating account:', error)
      toast.error(error.message || 'Error al crear la cuenta')
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Verificando tu pago...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <Header />

      <main className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              ¡Pago exitoso!
            </h1>
            <p className="text-lg text-gray-600">
              Tu suscripción al plan <span className="font-semibold capitalize">{plan}</span> ha sido confirmada
            </p>
          </div>

          {/* Account Creation Form */}
          <Card className="p-8 border-2 border-purple-200 bg-white/80 backdrop-blur">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Completa tu registro
              </h2>
              <p className="text-gray-600">
                Email: <span className="font-semibold">{customerData?.email}</span>
              </p>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-gray-900 font-medium">
                    Nombre
                  </Label>
                  <Input
                    id="first_name"
                    type="text"
                    placeholder="Juan"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:ring-0"
                    disabled={creating}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-gray-900 font-medium">
                    Apellido
                  </Label>
                  <Input
                    id="last_name"
                    type="text"
                    placeholder="Pérez"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:ring-0"
                    disabled={creating}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_name" className="text-gray-900 font-medium">
                  Nombre de la empresa
                </Label>
                <Input
                  id="company_name"
                  type="text"
                  placeholder="Mi Empresa S.A."
                  value={formData.company_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:ring-0"
                  disabled={creating}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-gray-900 font-medium">
                    Rol
                  </Label>
                  <Select value={formData.role} onValueChange={handleRoleChange} disabled={creating}>
                    <SelectTrigger className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:ring-0">
                      <SelectValue placeholder="Selecciona tu rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="developer">Desarrollador</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-gray-900 font-medium">
                    Zona horaria
                  </Label>
                  <TimezoneSelect
                    value={formData.timezone}
                    onChange={handleTimezoneChange}
                    disabled={creating}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-900 font-medium">
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:ring-0"
                    disabled={creating}
                    required
                  />
                  <p className="text-sm text-gray-500">Mínimo 8 caracteres</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirm" className="text-gray-900 font-medium">
                    Confirmar contraseña
                  </Label>
                  <Input
                    id="password_confirm"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password_confirm}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:ring-0"
                    disabled={creating}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium text-lg"
                disabled={creating}
              >
                {creating ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creando cuenta...
                  </div>
                ) : (
                  'Completar registro'
                )}
              </Button>
            </form>
          </Card>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Si cierras esta ventana, recibirás un email con una contraseña temporal para acceder a tu cuenta.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
