"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Check } from "lucide-react"

type PlanType = 'starter' | 'enterprise' | 'growth'

interface PlanInfo {
  name: string
  price: string
}

const planDetails: Record<PlanType, PlanInfo> = {
  starter: { name: 'Starter', price: '$19/mes' },
  enterprise: { name: 'Enterprise', price: '$69/mes' },
  growth: { name: 'Growth', price: '$149/mes' }
}

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null)

  const handleSelectPlan = async (plan: PlanType) => {
    setIsLoading(true)
    setLoadingPlan(plan)

    try {
      // Crear sesión de Stripe Checkout
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })

      if (!response.ok) {
        throw new Error('Error al crear sesión de pago')
      }

      const { url } = await response.json()

      // Redirigir a Stripe
      window.location.href = url
    } catch (error: any) {
      console.error('Error:', error)
      alert('Error al procesar el pago. Por favor intenta nuevamente.')
      setIsLoading(false)
      setLoadingPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="px-6 py-16 max-w-7xl mx-auto text-center">
        <div className="relative">
          {/* Background decorative lines */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <svg className="w-full h-32" viewBox="0 0 800 200" fill="none">
              <path d="M0 100 Q200 50 400 100 T800 100" stroke="#22c55e" strokeWidth="2" fill="none" />
              <path d="M0 120 Q200 70 400 120 T800 120" stroke="#22c55e" strokeWidth="1" fill="none" />
            </svg>
          </div>

          <div className="relative z-10 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-balance">
              Elige el plan perfecto para tu equipo
            </h1>
          </div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Starter Plan */}
          <Card className="p-8 border-2 border-purple-200 bg-white/80 backdrop-blur hover:border-purple-300 transition-colors">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
                <p className="text-sm text-gray-600 mb-4">Ideal para equipos pequeños o en fase de validación</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">$19</span>
                  <span className="text-gray-500 ml-1">/mes</span>
                </div>
              </div>

              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Hasta 5 usuarios</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Monitoreo de tiempo automático</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Reportes semanales</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">1 integración</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Dashboard básico</span>
                </li>
              </ul>

              <Button
                onClick={() => handleSelectPlan('starter')}
                className="w-full bg-brand hover:bg-brand-hover text-brand-foreground rounded-full"
                disabled={isLoading}
              >
                {loadingPlan === 'starter' ? 'Procesando...' : 'Iniciar'}
              </Button>
            </div>
          </Card>

          {/* Enterprise Plan */}
          <Card className="p-8 border-2 border-purple-200 bg-white/80 backdrop-blur hover:border-purple-300 transition-colors">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Pensado para equipos en expansión y gestión más exigente
                </p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">$69</span>
                  <span className="text-gray-500 ml-1">/mes</span>
                </div>
              </div>

              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Hasta 25 usuarios</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Todas las funciones de Starter</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Integración con 3 plataformas</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Panel de control para administradores</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Alertas por rendimiento</span>
                </li>
              </ul>

              <Button
                onClick={() => handleSelectPlan('enterprise')}
                className="w-full bg-brand hover:bg-brand-hover text-brand-foreground rounded-full"
                disabled={isLoading}
              >
                {loadingPlan === 'enterprise' ? 'Procesando...' : 'Iniciar'}
              </Button>
            </div>
          </Card>

          {/* Growth Plan */}
          <Card className="p-8 border-2 border-purple-200 bg-white/80 backdrop-blur hover:border-purple-300 transition-colors">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Growth</h3>
                <p className="text-sm text-gray-600 mb-4">Para organizaciones que necesitan control total y escalabilidad</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">$149</span>
                  <span className="text-gray-500 ml-1">/mes</span>
                </div>
              </div>

              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Usuarios ilimitados</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Todas las funciones de Enterprise</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Integraciones completas</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Auditoría de código automatizada</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Soporte premium y onboarding asistido</span>
                </li>
              </ul>

              <Button
                onClick={() => handleSelectPlan('growth')}
                className="w-full bg-brand hover:bg-brand-hover text-brand-foreground rounded-full"
                disabled={isLoading}
              >
                {loadingPlan === 'growth' ? 'Procesando...' : 'Iniciar'}
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
