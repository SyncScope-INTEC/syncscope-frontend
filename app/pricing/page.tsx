"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Check } from "lucide-react"
import { ConfirmationModal } from "@/components/modals/confirmation-modal"

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
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSelectPlan = (plan: PlanType) => {
    setSelectedPlan(plan)
    // Scroll suave al formulario
    setTimeout(() => {
      document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleCancelClick = () => {
    setShowCancelModal(true)
  }

  const handleConfirmCancel = () => {
    setShowCancelModal(false)
    setSelectedPlan(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular envío con animación de carga (1 segundo)
    await new Promise(resolve => setTimeout(resolve, 1000))

    setIsLoading(false)
    setSelectedPlan(null)
    setShowSuccessModal(true)
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
              >
                Iniciar
              </Button>
            </div>
          </Card>

          {/* Enterprise Plan */}
          <Card className="p-8 border-2 border-purple-200 bg-white/80 backdrop-blur hover:border-purple-300 transition-colors">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Para organizaciones que necesitan control total y escalabilidad
                </p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">$69</span>
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
                  <span className="text-sm text-gray-700">Todas las funciones de Growth</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Integraciones completas</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Panel de control para administradores</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Soporte premium y onboarding asistido</span>
                </li>
              </ul>

              <Button
                onClick={() => handleSelectPlan('enterprise')}
                className="w-full bg-brand hover:bg-brand-hover text-brand-foreground rounded-full"
              >
                Iniciar
              </Button>
            </div>
          </Card>

          {/* Growth Plan */}
          <Card className="p-8 border-2 border-purple-200 bg-white/80 backdrop-blur hover:border-purple-300 transition-colors">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Growth</h3>
                <p className="text-sm text-gray-600 mb-4">Pensado para equipos en expansión y gestión más exigente</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">$149</span>
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
                  <span className="text-sm text-gray-700">Auditoría de código automatizada</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Alertas por rendimiento</span>
                </li>
              </ul>

              <Button
                onClick={() => handleSelectPlan('growth')}
                className="w-full bg-brand hover:bg-brand-hover text-brand-foreground rounded-full"
              >
                Iniciar
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Signup Form Section - Solo visible cuando se selecciona un plan */}
      {selectedPlan && (
        <section id="signup-form" className="px-6 py-16 max-w-4xl mx-auto">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Formulario de inicio — Plan {planDetails[selectedPlan].name}
              </h2>
              <p className="text-gray-600 mt-2">{planDetails[selectedPlan].price}</p>
            </div>

            <Card className="p-8 border-2 border-brand bg-white/80 backdrop-blur">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="identifier" className="text-sm font-medium text-gray-700">
                      Identificador
                    </Label>
                    <Input
                      id="identifier"
                      type="text"
                      required
                      className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                      Nombre de la empresa
                    </Label>
                    <Input
                      id="company"
                      type="text"
                      required
                      className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Número telefónico
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Correo electrónico
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ejemplo@correo.com"
                      required
                      className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    type="button"
                    onClick={handleCancelClick}
                    variant="outline"
                    disabled={isLoading}
                    className="px-8 bg-brand hover:bg-brand-hover text-brand-foreground border-brand hover:border-brand-hover"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Enviando...
                      </div>
                    ) : (
                      "Enviar"
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </section>
      )}

      {/* Modals */}
      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        type="cancel"
        onConfirm={handleConfirmCancel}
      />

      <ConfirmationModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type="success"
        message="La solicitud fue enviada con éxito."
      />

      {/* Footer */}
      <Footer />
    </div>
  )
}
