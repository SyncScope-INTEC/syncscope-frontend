"use client"

import { useState, useEffect } from "react"
import { AppHeader } from "@/components/navigation/app-header"
import { Footer } from "@/components/footer"
import { AlertFilters } from "@/components/filters/alert-filters"
import { AlertsTable } from "@/components/tables/alerts-table"
import { PerformanceChartCard } from "@/components/cards/performance-chart-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText } from "lucide-react"
import { monitoringService } from "@/lib/services/monitoringService"
import { analyticsService } from "@/lib/services/analyticsService"
import { alertsService } from "@/lib/services/alertsService"
import { useAppSelector } from "@/lib/store/hooks"
import { toast } from "sonner"
import { isDevMode } from "@/lib/utils/devMode"

export default function AlertsHistoryPage() {
  const { user } = useAppSelector((state) => state.auth)
  const [alerts, setAlerts] = useState<any[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<any[]>([])
  const [reportType, setReportType] = useState('anomaly_detection')
  const [performanceData, setPerformanceData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAlerts() {
      try {
        setIsLoading(true)

        // Obtener alertas reales y dashboard
        const [alertsData, dashboard] = await Promise.all([
          alertsService.getAllAlerts().catch(() => ({ results: [] })),
          analyticsService.getDashboard().catch(() => null),
        ])

        // Mapear alertas al formato esperado por la tabla
        const mappedAlerts = alertsData?.results?.map((alert: any) => ({
          id: alert.id,
          title: alert.title,
          employee: alert.user_name || `${user?.first_name || 'Usuario'} ${user?.last_name || ''}`,
          date: new Date(alert.triggered_at || alert.acknowledged_at || new Date()).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }),
          severity: alert.severity === 'critical' ? 'alto' : alert.severity === 'high' ? 'alto' : alert.severity === 'medium' ? 'medio' : 'bajo',
          is_muted: alert.is_muted,
          is_acknowledged: alert.is_acknowledged,
          is_resolved: alert.is_resolved,
          raw_severity: alert.severity, // Guardar severidad original para filtrado
        })) || []

        setAlerts(mappedAlerts)
        setFilteredAlerts(mappedAlerts)
        setPerformanceData(dashboard)
      } catch (error: any) {
        console.error('Error fetching alerts:', error)
        toast.error('Error al cargar las alertas')

        // Fallback mock data (solo en dev mode)
        if (isDevMode()) {
          setAlerts([
            {
              id: "1",
              title: "Rendimiento bajo detectado",
              employee: `${user?.first_name || 'Usuario'} ${user?.last_name || ''}`,
              date: new Date().toLocaleDateString('es-ES'),
              severity: "alto" as const,
            },
          ])
        } else {
          setAlerts([])
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchAlerts()
    }
  }, [user])

  const handleFilterChange = (filters: { severity: string; status: string; search: string }) => {
    let filtered = [...alerts]

    // Filtrar por severidad
    if (filters.severity) {
      filtered = filtered.filter((alert) => alert.raw_severity === filters.severity)
    }

    // Filtrar por estado
    if (filters.status) {
      if (filters.status === 'unresolved') {
        filtered = filtered.filter((alert) => !alert.is_resolved)
      } else if (filters.status === 'acknowledged') {
        filtered = filtered.filter((alert) => alert.is_acknowledged && !alert.is_resolved)
      } else if (filters.status === 'resolved') {
        filtered = filtered.filter((alert) => alert.is_resolved)
      }
    }

    // Filtrar por búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (alert) =>
          alert.title.toLowerCase().includes(searchLower) ||
          alert.employee.toLowerCase().includes(searchLower)
      )
    }

    setFilteredAlerts(filtered)
  }

  const handleExportPDF = async () => {
    try {
      toast.info('Generando reporte...')

      // Crear reporte
      const report = await analyticsService.createReport({
        name: `Alertas - ${new Date().toLocaleDateString('es-ES')}`,
        type: reportType,
        config: { alerts: filteredAlerts.length },
      })

      console.log('Report created:', report)

      if (!report || !report.id) {
        toast.error('Error: No se pudo crear el reporte')
        return
      }

      // Exportar a PDF con datos de alertas
      const exported = await analyticsService.exportReport(
        report.id,
        'pdf',
        true,
        true,
        {
          alerts: filteredAlerts,
          reportName: `Alertas - ${new Date().toLocaleDateString('es-ES')}`,
          reportType: reportType,
          generatedAt: new Date().toISOString()
        }
      )

      if (exported?.url) {
        window.open(exported.url, '_blank')
        toast.success('Reporte generado exitosamente')
      } else {
        toast.success('Reporte creado (descarga no disponible)')
      }
    } catch (error: any) {
      console.error('Error exporting PDF:', error)
      toast.error(`Error al generar reporte: ${error.message || 'Error desconocido'}`)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white">
      <AppHeader />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Alertas por empleado</h1>
          <p className="text-gray-600">Monitorea y gestiona todas las alertas del equipo</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Alerts Table */}
          <div className="lg:col-span-2">
            <AlertFilters onFilterChange={handleFilterChange} />
            {/* Alerts Table */}
            <Card className="p-6 border-2 border-purple-200">
              <AlertsTable alerts={filteredAlerts} isLoading={isLoading} />
            </Card>
          </div>

          {/* Right Column - Performance Chart and other cards */}
          <div className="lg:col-span-1 space-y-6">
            <PerformanceChartCard data={performanceData} />

            {/* Report Type Selector */}
            <Card className="p-6 border-2 border-purple-200">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg">Tipo de Reporte</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona tipo de reporte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="productivity">Productivity Report</SelectItem>
                    <SelectItem value="code_quality">Code Quality Report</SelectItem>
                    <SelectItem value="time_tracking">Time Tracking Report</SelectItem>
                    <SelectItem value="team_performance">Team Performance Report</SelectItem>
                    <SelectItem value="individual_performance">Individual Performance Report</SelectItem>
                    <SelectItem value="project_summary">Project Summary Report</SelectItem>
                    <SelectItem value="git_activity">Git Activity Report</SelectItem>
                    <SelectItem value="deployment_metrics">Deployment Metrics Report</SelectItem>
                    <SelectItem value="custom">Custom Report</SelectItem>
                    <SelectItem value="comparative">Comparative Analysis</SelectItem>
                    <SelectItem value="trend_analysis">Trend Analysis</SelectItem>
                    <SelectItem value="anomaly_detection">Anomaly Detection Report</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Performance Status */}
            <Card className="p-6 bg-brand text-brand-foreground">
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