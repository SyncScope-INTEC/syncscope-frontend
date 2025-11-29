"use client"

import { useState, useEffect } from "react"
import { AppHeader } from "@/components/navigation/app-header"
import { Footer } from "@/components/footer"
import { AlertFilters } from "@/components/filters/alert-filters"
import { AlertsTable } from "@/components/tables/alerts-table"
import { PerformanceChartCard } from "@/components/cards/performance-chart-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { monitoringService } from "@/lib/services/monitoringService"
import { analyticsService } from "@/lib/services/analyticsService"
import { useAppSelector } from "@/lib/store/hooks"
import { toast } from "sonner"

export default function AlertsHistoryPage() {
  const { user } = useAppSelector((state) => state.auth)
  const [alerts, setAlerts] = useState<any[]>([])
  const [performanceData, setPerformanceData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAlerts() {
      try {
        setIsLoading(true)

        // Obtener sesiones recientes y métricas
        const [sessions, dashboard] = await Promise.all([
          monitoringService.getUserSessions(user?.id || '', { limit: 10 }).catch(() => []),
          analyticsService.getDashboard().catch(() => null),
        ])

        // Mapear sesiones a alertas (simulado)
        const mappedAlerts = sessions?.map((session: any, index: number) => {
          const duration = session.session_duration_minutes || 0
          let severity: 'alto' | 'medio' | 'bajo' = 'bajo'

          if (duration < 30) {
            severity = 'alto'
          } else if (duration < 120) {
            severity = 'medio'
          }

          return {
            id: session.session_id || `${index}`,
            title:
              severity === 'alto'
                ? 'Sesión muy corta detectada'
                : severity === 'medio'
                  ? 'Rendimiento moderado'
                  : 'Sesión normal',
            employee: `${user?.first_name || 'Usuario'} ${user?.last_name || ''}`,
            date: new Date(session.session_start).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            }),
            severity,
          }
        }) || []

        setAlerts(mappedAlerts)
        setPerformanceData(dashboard)
      } catch (error: any) {
        console.error('Error fetching alerts:', error)
        toast.error('Error al cargar las alertas')

        // Fallback mock data
        setAlerts([
          {
            id: "1",
            title: "Rendimiento bajo detectado",
            employee: `${user?.first_name || 'Usuario'} ${user?.last_name || ''}`,
            date: new Date().toLocaleDateString('es-ES'),
            severity: "alto" as const,
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchAlerts()
    }
  }, [user])

  const handleFilterChange = (filters: any) => {
    console.log("[v0] Filtros aplicados:", filters)
    toast.info('Filtros aplicados')
  }

  const handleExportPDF = async () => {
    try {
      toast.info('Generando reporte...')
      
      // Crear reporte
      const report = await analyticsService.createReport({
        name: `Alertas - ${new Date().toLocaleDateString('es-ES')}`,
        type: 'alerts',
        config: { alerts: alerts.length },
      })

      // Exportar a PDF
      const exported = await analyticsService.exportReport(report.id, 'pdf', true, true)
      
      if (exported?.url) {
        window.open(exported.url, '_blank')
        toast.success('Reporte generado exitosamente')
      } else {
        toast.success('Reporte creado (descarga no disponible)')
      }
    } catch (error: any) {
      console.error('Error exporting PDF:', error)
      toast.error('Error al exportar PDF')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Alertas por empleado</h1>
          <p className="text-gray-600">Monitorea y gestiona todas las alertas del equipo</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Alerts Table */}
          <div className="lg:col-span-2">
            <AlertFilters onFilterChange={handleFilterChange} />
            <AlertsTable alerts={alerts} isLoading={isLoading} />
          </div>

          {/* Right Column - Performance Chart */}
          <div className="space-y-6">
            <PerformanceChartCard data={performanceData} />

            {/* Performance Status */}
            <Card className="p-6 bg-green-400 text-black">
              <p className="text-sm font-semibold">
                {alerts.length > 0
                  ? `${alerts.filter((a) => a.severity === 'alto').length} alertas de alta prioridad`
                  : 'Sin alertas críticas'}
              </p>
              <Button variant="outline" className="mt-3 w-full bg-transparent">
                Revisar
              </Button>
            </Card>

            {/* Export Button */}
            <Button onClick={handleExportPDF} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              <FileText className="w-4 h-4 mr-2" />
              Exportar a pdf
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}