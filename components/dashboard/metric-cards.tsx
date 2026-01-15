import { Card, CardContent } from "@/components/ui/card"
import { Clock, Code, Activity, TrendingUp, Users } from "lucide-react"
import { formatDuration } from "@/lib/utils/metrics"
import type { DashboardMetrics } from "@/lib/hooks/useDashboardMetrics"

interface MetricCardsProps {
  metrics: DashboardMetrics
}

export function MetricCards({ metrics }: MetricCardsProps) {
  const { codingTime, activeSessions, avgSessionDuration, codeMetrics, loading } = metrics

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Coding Time Today */}
      <Card className="border-2 border-purple-200 hover:border-purple-400 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-gray-500">Hoy</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatDuration(codingTime.today)}
          </div>
          <p className="text-xs text-gray-600 mt-1">Tiempo de código</p>
        </CardContent>
      </Card>

      {/* Coding Time This Week */}
      <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-gray-500">Semana</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatDuration(codingTime.thisWeek)}
          </div>
          <p className="text-xs text-gray-600 mt-1">Tiempo de código</p>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card className="border-2 border-green-200 hover:border-green-400 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-green-600" />
            <span className="text-xs text-gray-500">Ahora</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {activeSessions}
          </div>
          <p className="text-xs text-gray-600 mt-1">Sesiones activas</p>
        </CardContent>
      </Card>

      {/* Lines of Code */}
      <Card className="border-2 border-orange-200 hover:border-orange-400 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Code className="w-5 h-5 text-orange-600" />
            <span className="text-xs text-gray-500">Semana</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {codeMetrics.linesAdded.toLocaleString()}
          </div>
          <p className="text-xs text-gray-600 mt-1">Líneas escritas</p>
        </CardContent>
      </Card>

      {/* Average Session Duration */}
      <Card className="border-2 border-indigo-200 hover:border-indigo-400 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <span className="text-xs text-gray-500">Promedio</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatDuration(avgSessionDuration)}
          </div>
          <p className="text-xs text-gray-600 mt-1">Duración sesión</p>
        </CardContent>
      </Card>
    </div>
  )
}
