import { useState, useEffect } from 'react'
import { monitoringService } from '@/lib/services/monitoringService'
import { managementService } from '@/lib/services/managementService'
import {
  calculateCodingTime,
  countActiveSessions,
  calculateAverageSessionDuration,
  aggregateCodeMetrics,
  getDateRange,
  type Session,
  type CodeMetric,
} from '@/lib/utils/metrics'

export interface DashboardMetrics {
  codingTime: {
    today: number
    thisWeek: number
    thisMonth: number
  }
  activeSessions: number
  avgSessionDuration: number
  codeMetrics: {
    totalLines: number
    linesAdded: number
    linesDeleted: number
    linesModified: number
    avgComplexity: number
    totalFunctions: number
    totalClasses: number
    commentRatio: number
  }
  activeProjects: number
  loading: boolean
  error: string | null
}

/**
 * Hook to fetch and calculate dashboard metrics for a project's team
 * @param projectId - Selected project ID
 * @returns Dashboard metrics aggregated for all team members
 */
export function useDashboardMetrics(projectId: string | null) {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    codingTime: { today: 0, thisWeek: 0, thisMonth: 0 },
    activeSessions: 0,
    avgSessionDuration: 0,
    codeMetrics: {
      totalLines: 0,
      linesAdded: 0,
      linesDeleted: 0,
      linesModified: 0,
      avgComplexity: 0,
      totalFunctions: 0,
      totalClasses: 0,
      commentRatio: 0,
    },
    activeProjects: 0,
    loading: true,
    error: null,
  })

  useEffect(() => {
    async function fetchMetrics() {
      if (!projectId) {
        setMetrics(prev => ({ ...prev, loading: false }))
        return
      }

      try {
        setMetrics(prev => ({ ...prev, loading: true, error: null }))

        // 1. Get team members for the selected project
        const teamMembersResponse = await managementService.getAllTeamMembers({
          project: projectId,
        })
        const teamMembers = teamMembersResponse?.results || []

        if (teamMembers.length === 0) {
          setMetrics(prev => ({ ...prev, loading: false }))
          return
        }

        // 2. Get date ranges for filtering
        const weekRange = getDateRange('week')

        // 3. Fetch sessions for all team members in parallel
        const teamSessionsPromises = teamMembers.map((member: any) =>
          monitoringService
            .getUserSessions(member.user_id, { limit: 100 })
            .catch(() => [])
        )
        const teamSessionsArrays = await Promise.all(teamSessionsPromises)
        const allSessions: Session[] = teamSessionsArrays.flat()

        // 4. Fetch code metrics for the project (all team members)
        const codeMetricsResponse = await monitoringService
          .getAllCodeMetrics({
            project_id: projectId,
            start_date: weekRange.start_date,
            end_date: weekRange.end_date,
          })
          .catch(() => [])

        const codeMetricsList: CodeMetric[] = Array.isArray(codeMetricsResponse)
          ? codeMetricsResponse
          : []

        // 5. Calculate aggregated metrics
        const codingTime = calculateCodingTime(allSessions)
        const activeSessions = countActiveSessions(allSessions)
        const avgSessionDuration = calculateAverageSessionDuration(allSessions)
        const codeMetrics = aggregateCodeMetrics(codeMetricsList)

        // 6. Update state with calculated metrics
        setMetrics({
          codingTime,
          activeSessions,
          avgSessionDuration,
          codeMetrics,
          activeProjects: 1, // Currently selected project
          loading: false,
          error: null,
        })
      } catch (error: any) {
        console.error('Error fetching dashboard metrics:', error)
        setMetrics(prev => ({
          ...prev,
          loading: false,
          error: error.message || 'Error al cargar métricas',
        }))
      }
    }

    fetchMetrics()
  }, [projectId])

  return metrics
}
