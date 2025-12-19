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

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const code = searchParams.get('code') || ''

  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password || !passwordConfirm) {
      toast.error('Por favor completa todos los campos')
      return
    }

    if (password !== passwordConfirm) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    if (password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setLoading(true)

    try {
      const authUrl = process.env.NEXT_PUBLIC_AUTH_URL
      const response = await fetch(`${authUrl}/auth/reset-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code,
          password,
          password_confirm: passwordConfirm,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al cambiar la contraseña')
      }

      toast.success('¡Contraseña cambiada exitosamente!')
      setTimeout(() => {
        router.push('/auth/admin-login')
      }, 1500)
    } catch (error: any) {
      console.error('Error resetting password:', error)
      toast.error(error.message || 'Error al cambiar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <Header />

      <main className="container mx-auto px-6 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Nueva contraseña
            </h1>
            <p className="text-gray-600">
              Ingresa tu nueva contraseña para{' '}
              <span className="font-semibold">{email}</span>
            </p>
          </div>

          <Card className="p-8 border-2 border-purple-200 bg-white/80 backdrop-blur">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-900 font-medium">
                  Nueva contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:ring-0"
                  disabled={loading}
                  required
                  autoFocus
                />
                <p className="text-sm text-gray-500">
                  Mínimo 8 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirm" className="text-gray-900 font-medium">
                  Confirmar contraseña
                </Label>
                <Input
                  id="password_confirm"
                  type="password"
                  placeholder="••••••••"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:ring-0"
                  disabled={loading}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium text-lg"
                disabled={loading}
              >
                {loading ? 'Cambiando contraseña...' : 'Cambiar contraseña'}
              </Button>

              <div className="text-center text-sm text-gray-600">
                <Link href="/auth/admin-login" className="text-purple-600 hover:text-purple-700 font-medium">
                  Volver al inicio de sesión
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
