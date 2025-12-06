"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Search, Filter, Play, FileText, Download } from "lucide-react"
import { DemoModal } from "@/components/modals/demo-modal"
import { ConfirmationModal } from "@/components/modals/confirmation-modal"

export default function ServicesPage() {
  const [showDemoModal, setShowDemoModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleDemoSuccess = () => {
    setShowSuccessModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="px-6 py-16 max-w-7xl mx-auto text-center">
        <div className="relative">
          {/* Background circle */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 md:w-[600px] md:h-[600px] border-2 border-purple-200 rounded-full opacity-50"></div>
          </div>

          <div className="relative z-10 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-balance">
              Descubre cómo optimizar tu equipo de desarrollo con SyncScope
            </h1>

            <Button
              onClick={() => setShowDemoModal(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 text-lg rounded-full"
            >
              Solicitar demo
            </Button>
          </div>
        </div>
      </section>

      {/* Dashboard Showcase Section */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <Card className="p-8 bg-white/90 backdrop-blur border-gray-200 shadow-2xl">
          {/* Dashboard Header */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Filter Tabs */}
            <div className="flex gap-2">
              <Badge className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full">
                Equipo interno
              </Badge>
              <Badge className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full">Híbrido</Badge>
            </div>

            {/* Filter and Search */}
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" size="sm" className="bg-white">
                <Filter className="w-4 h-4" />
              </Button>
              <div className="relative">
                <Input
                  placeholder="Julio"
                  className="pl-8 bg-green-600 text-white placeholder:text-white/80 border-green-600"
                />
                <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-white" />
              </div>
              <Button variant="outline" size="sm" className="bg-white">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Data Table */}
            <div className="lg:col-span-2">
              <Card className="p-4 bg-purple-100 border-purple-200">
                {/* Table Header */}
                <div className="grid grid-cols-3 gap-4 mb-4 pb-2 border-b border-purple-200">
                  <div className="font-semibold text-gray-700">Alerta</div>
                  <div className="font-semibold text-gray-700">Empleado</div>
                  <div className="font-semibold text-gray-700 flex items-center gap-2">
                    Fecha
                    <Badge className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      ?
                    </Badge>
                  </div>
                </div>

                {/* Table Rows */}
                <div className="space-y-3">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div key={i} className="grid grid-cols-3 gap-4 py-2 bg-purple-200/50 rounded">
                      <div className="h-4 bg-purple-300 rounded"></div>
                      <div className="h-4 bg-purple-300 rounded"></div>
                      <div className="h-4 bg-purple-300 rounded"></div>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className="mt-4 flex justify-end">
                  <Button className="bg-purple-500 hover:bg-purple-600 text-white rounded-full px-6">
                    <Play className="w-4 h-4 mr-2" />
                    Ver video
                  </Button>
                </div>
              </Card>
            </div>

            {/* Right Column - Performance Chart and Actions */}
            <div className="space-y-4">
              {/* Performance Chart */}
              <Card className="p-4 bg-gray-100 border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-4">Rendimiento esta semana</h3>

                {/* Chart */}
                <div className="flex items-end justify-between h-32 mb-4">
                  {[
                    { day: "M", height: "h-16", color: "bg-purple-400" },
                    { day: "T", height: "h-12", color: "bg-purple-400" },
                    { day: "W", height: "h-8", color: "bg-green-400" },
                    { day: "T", height: "h-20", color: "bg-green-400" },
                    { day: "F", height: "h-14", color: "bg-green-400" },
                    { day: "M", height: "h-18", color: "bg-purple-400" },
                    { day: "T", height: "h-24", color: "bg-purple-400" },
                    { day: "W", height: "h-10", color: "bg-purple-400" },
                    { day: "T", height: "h-28", color: "bg-purple-400" },
                  ].map((bar, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className={`w-6 ${bar.height} ${bar.color} rounded-t mb-1`}></div>
                      <span className="text-xs text-gray-500">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Performance Alert */}
              <div className="bg-green-600 text-white p-3 rounded-lg text-sm">
                <strong>Julio</strong> disminuyó su rendimiento.
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button variant="outline" className="w-full bg-white border-gray-300">
                  <FileText className="w-4 h-4 mr-2" />
                  Revisar
                </Button>
                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar a pdf
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Bottom Description */}
      <section className="px-6 py-8 max-w-7xl mx-auto text-center">
        <p className="text-lg text-gray-600 text-balance">
          Auditoría automatizada, métricas claras y decisiones inteligentes en un solo lugar.
        </p>
      </section>

      {/* Demo Modal */}
      <DemoModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        onSuccess={handleDemoSuccess}
      />

      {/* Success Modal */}
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
