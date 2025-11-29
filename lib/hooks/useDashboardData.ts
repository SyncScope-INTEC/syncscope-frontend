import { useState, useEffect } from 'react'
import { analyticsService } from '@/lib/services/analyticsService'
import { monitoringService } from '@/lib/services/monitoringService'
import { useAppSelector } from '@/lib/store/hooks'

export function useDashboardData() {
  const { user } = useAppSelector((state) => state.auth)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [sessionStats, setSessionStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Fetch dashboard data y session stats en paralelo
        const [dashboard, stats] = await Promise.all([
          analyticsService.getDashboard().catch(() => null),
          monitoringService.getUserSessionStats(user.id).catch(() => null),
        ])

        setDashboardData(dashboard)
        setSessionStats(stats)
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err)
        setError(err.message || 'Error al cargar datos')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user?.id])

  return {
    dashboardData,
    sessionStats,
    isLoading,
    error,
    user,
  }
}