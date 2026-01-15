import type { DashboardMetrics } from '@/lib/hooks/useDashboardMetrics'

/**
 * Calculate project progress based on metrics
 * Used consistently across Dashboard and Reports pages
 * 
 * Formula:
 * - Lines of code written (max 40 points)
 * - Coding time this week (max 30 points)  
 * - Active sessions (max 30 points)
 * Total: 0-100%
 */
export function calculateProjectProgress(metrics: DashboardMetrics | null): number {
  if (!metrics || metrics.loading) return 0 // Return 0 while loading
  
  const { codeMetrics, codingTime, activeSessions } = metrics
  
  // Factors:
  // - Lines of code written (max 40 points)
  // - Coding time this week (max 30 points)
  // - Active sessions (max 30 points)
  
  const linesScore = Math.min((codeMetrics.linesAdded / 1000) * 40, 40)
  const timeScore = Math.min((codingTime.thisWeek / 2400) * 30, 30) // 2400 min = 40 hours
  const sessionScore = Math.min((activeSessions / 5) * 30, 30)
  
  return Math.min(Math.round(linesScore + timeScore + sessionScore), 100)
}

/**
 * Determine current project phase based on progress percentage
 * 
 * Phases:
 * - 0-24%: Inicio
 * - 25-49%: Planificación
 * - 50-74%: Diseño
 * - 75-100%: Construcción
 */
export function getCurrentPhase(progress: number): number {
  if (progress < 25) return 0 // Inicio
  if (progress < 50) return 1 // Planificación
  if (progress < 75) return 2 // Diseño
  return 3 // Construcción
}

/**
 * Get phase name by index
 */
export function getPhaseName(phaseIndex: number): string {
  const phases = ['Inicio', 'Planificación', 'Diseño', 'Construcción']
  return phases[phaseIndex] || 'Desconocido'
}
