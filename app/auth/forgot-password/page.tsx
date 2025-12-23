"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ConfirmationModal } from "@/components/modals/confirmation-modal"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authService } from "@/lib/services/authService"

export default function ForgotPassword() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await authService.forgotPassword(email)

      setShowSuccessModal(true)
      toast.success('Código enviado a tu correo')

      // Redirigir a la página de verificación después de 2 segundos
      setTimeout(() => {
        router.push(`/auth/verify-reset-code?email=${encodeURIComponent(email)}`)
      }, 2000)
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.response?.data?.error || error.message || 'Error al enviar el código')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-white">
      <Header />

      <main className="flex-1 container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Circular Design Element */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[600px] h-[600px] border-2 border-purple-200 rounded-full opacity-30"></div>
            </div>

            <div className="relative z-10 text-center py-20">
              {/* Back Link */}
              <div className="mb-8">
                <Button
                  variant="link"
                  className="text-brand-dark hover:text-brand-hover"
                  onClick={() => router.back()}
                >
                  Regresar
                </Button>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-balance">
                ¿Olvidaste tu contraseña?
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto text-balance">
                Restablece el acceso a tu cuenta en pocos pasos. Solo necesitas el correo que usaste al registrarte.
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    required
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:ring-0"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand hover:bg-brand-hover text-brand-foreground py-3 px-6 rounded-lg font-medium text-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </div>
                  ) : (
                    "Enviar código"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      <ConfirmationModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type="success"
        message="Se ha enviado un código de verificación a tu correo electrónico."
      />

      <Footer />
    </div>
  )
}
