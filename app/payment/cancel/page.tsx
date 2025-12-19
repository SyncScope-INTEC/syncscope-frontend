"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { XCircle } from "lucide-react"

export default function PaymentCancelPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <Header />

      <main className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Cancel Icon */}
          <div className="text-center mb-8">
            <XCircle className="w-20 h-20 text-orange-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Pago cancelado
            </h1>
            <p className="text-lg text-gray-600">
              No se realizó ningún cargo a tu tarjeta
            </p>
          </div>

          {/* Info Card */}
          <Card className="p-8 border-2 border-orange-200 bg-white/80 backdrop-blur">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  ¿Qué sucedió?
                </h2>
                <p className="text-gray-600">
                  Cancelaste el proceso de pago. No te preocupes, puedes intentarlo nuevamente cuando estés listo.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">
                  ¿Necesitas ayuda?
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>Si tuviste problemas con el pago, intenta con otro método de pago</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>Si tienes preguntas sobre los planes, revisa nuestra página de precios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>Contacta a soporte si necesitas asistencia adicional</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  onClick={() => router.push('/pricing')}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium"
                >
                  Ver planes nuevamente
                </Button>
                <Button
                  onClick={() => router.push('/')}
                  variant="outline"
                  className="flex-1 border-2 border-purple-200 hover:border-purple-300 py-3 px-6 rounded-lg font-medium"
                >
                  Volver al inicio
                </Button>
              </div>
            </div>
          </Card>

          {/* Support Box */}
          <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-sm text-purple-800 text-center">
              ¿Necesitas ayuda? Contáctanos en{" "}
              <a href="mailto:support@syncscope.com" className="font-semibold underline">
                support@syncscope.com
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
