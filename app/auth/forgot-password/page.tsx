"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function ForgotPassword() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <Header />

      <main className="container mx-auto px-6 py-16">
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
                    className="text-green-500 hover:text-green-600"
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
              <div className="max-w-md mx-auto space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-left block text-gray-900 font-medium">
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:ring-0"
                  />
                </div>

                <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-medium text-lg">
                  Enviar solicitud
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
