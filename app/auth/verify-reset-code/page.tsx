"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import Link from "next/link"

export default function VerifyResetCodePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!code) {
      toast.error('Por favor ingresa el código')
      return
    }

    if (code.length !== 6) {
      toast.error('El código debe tener 6 dígitos')
      return
    }

    setLoading(true)

    try {
      const authUrl = process.env.NEXT_PUBLIC_AUTH_URL
      const response = await fetch(`${authUrl}/auth/verify-reset-code/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Código inválido')
      }

      toast.success('Código verificado correctamente')
      // Redirigir a la página de reset con el código
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}&code=${code}`)
    } catch (error: any) {
      console.error('Error verifying code:', error)
      toast.error(error.message || 'Error al verificar el código')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    try {
      const authUrl = process.env.NEXT_PUBLIC_AUTH_URL
      const response = await fetch(`${authUrl}/auth/forgot-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('Error al reenviar el código')
      }

      toast.success('Código reenviado a tu correo')
    } catch (error) {
      toast.error('Error al reenviar el código')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <Header />

      <main className="container mx-auto px-6 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Verifica tu código
            </h1>
            <p className="text-gray-600">
              Ingresa el código de 6 dígitos que enviamos a{' '}
              <span className="font-semibold">{email}</span>
            </p>
          </div>

          <Card className="p-8 border-2 border-purple-200 bg-white/80 backdrop-blur">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-gray-900 font-medium">
                  Código de verificación
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:ring-0 text-center text-2xl tracking-widest"
                  disabled={loading}
                  maxLength={6}
                  required
                  autoFocus
                />
                <p className="text-sm text-gray-500">
                  Ingresa los 6 dígitos que recibiste por correo
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium text-lg"
                disabled={loading || code.length !== 6}
              >
                {loading ? 'Verificando...' : 'Verificar código'}
              </Button>

              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  ¿No recibiste el código? Reenviar
                </button>

                <div className="text-sm text-gray-600">
                  <Link href="/auth/admin-login" className="text-purple-600 hover:text-purple-700 font-medium">
                    Volver al inicio de sesión
                  </Link>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
