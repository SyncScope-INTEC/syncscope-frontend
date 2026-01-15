/**
 * Metrics calculation utilities
 * Helper functions for aggregating and calculating dashboard metrics
 */

export interface Session {
  session_id: string
  user_id: string
  session_start: string
  session_end: string | null
  session_duration_minutes: number
  project_path?: string
  git_repository_url?: string
}

export interface CodeMetric {
  metrics_id: string
  session: string
  file_path: string
  lines_of_code: number
  lines_added: number
  lines_deleted: number
  lines_modified: number
  complexity_score: string
  function_count: number
  class_count: number
  comment_lines: number
  calculated_at: string
}

/**
 * Calculate total coding time from sessions
 */
export function calculateCodingTime(sessions: Session[]): {
  today: number
  thisWeek: number
  thisMonth: number
} {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const todaySessions = sessions.filter(s => new Date(s.session_start) >= todayStart)
  const weekSessions = sessions.filter(s => new Date(s.session_start) >= weekStart)
  const monthSessions = sessions.filter(s => new Date(s.session_start) >= monthStart)

  return {
    today: todaySessions.reduce((sum, s) => sum + (s.session_duration_minutes || 0), 0),
    thisWeek: weekSessions.reduce((sum, s) => sum + (s.session_duration_minutes || 0), 0),
    thisMonth: monthSessions.reduce((sum, s) => sum + (s.session_duration_minutes || 0), 0),
  }
}

/**
 * Count active sessions (sessions without end time)
 */
export function countActiveSessions(sessions: Session[]): number {
  return sessions.filter(s => !s.session_end).length
}

/**
 * Calculate average session duration
 */
export function calculateAverageSessionDuration(sessions: Session[]): number {
  const completedSessions = sessions.filter(s => s.session_end && s.session_duration_minutes > 0)
  
  if (completedSessions.length === 0) return 0
  
  const totalDuration = completedSessions.reduce((sum, s) => sum + s.session_duration_minutes, 0)
  return Math.round(totalDuration / completedSessions.length)
}

/**
 * Aggregate code metrics
 */
export function aggregateCodeMetrics(metrics: CodeMetric[]): {
  totalLines: number
  linesAdded: number
  linesDeleted: number
  linesModified: number
  avgComplexity: number
  totalFunctions: number
  totalClasses: number
  commentRatio: number
} {
  if (metrics.length === 0) {
    return {
      totalLines: 0,
      linesAdded: 0,
      linesDeleted: 0,
      linesModified: 0,
      avgComplexity: 0,
      totalFunctions: 0,
      totalClasses: 0,
      commentRatio: 0,
    }
  }

  const totalLines = metrics.reduce((sum, m) => sum + m.lines_of_code, 0)
  const linesAdded = metrics.reduce((sum, m) => sum + m.lines_added, 0)
  const linesDeleted = metrics.reduce((sum, m) => sum + m.lines_deleted, 0)
  const linesModified = metrics.reduce((sum, m) => sum + m.lines_modified, 0)
  const totalFunctions = metrics.reduce((sum, m) => sum + m.function_count, 0)
  const totalClasses = metrics.reduce((sum, m) => sum + m.class_count, 0)
  const totalComments = metrics.reduce((sum, m) => sum + m.comment_lines, 0)

  // Calculate average complexity (parse string to number)
  const complexityScores = metrics
    .map(m => parseFloat(m.complexity_score))
    .filter(score => !isNaN(score))
  const avgComplexity = complexityScores.length > 0
    ? complexityScores.reduce((sum, score) => sum + score, 0) / complexityScores.length
    : 0

  // Calculate comment ratio (comments / total lines)
  const commentRatio = totalLines > 0 ? (totalComments / totalLines) * 100 : 0

  return {
    totalLines,
    linesAdded,
    linesDeleted,
    linesModified,
    avgComplexity: Math.round(avgComplexity * 10) / 10,
    totalFunctions,
    totalClasses,
    commentRatio: Math.round(commentRatio * 10) / 10,
  }
}

/**
 * Format duration in minutes to human-readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`
  }
  
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (mins === 0) {
    return `${hours}h`
  }
  
  return `${hours}h ${mins}m`
}

/**
 * Get date range for filtering
 */
export function getDateRange(range: 'today' | 'week' | 'month'): {
  start_date: string
  end_date: string
} {
  const now = new Date()
  const end_date = now.toISOString()
  
  let start_date: Date
  
  switch (range) {
    case 'today':
      start_date = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      break
    case 'week':
      start_date = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case 'month':
      start_date = new Date(now.getFullYear(), now.getMonth(), 1)
      break
  }
  
  return {
    start_date: start_date.toISOString(),
    end_date,
  }
}

/**
 * Calculate productivity trend (compare current week vs previous week)
 */
export function calculateProductivityTrend(
  currentWeekMetrics: CodeMetric[],
  previousWeekMetrics: CodeMetric[]
): {
  percentageChange: number
  trend: 'up' | 'down' | 'stable'
} {
  const currentLines = currentWeekMetrics.reduce((sum, m) => sum + m.lines_added, 0)
  const previousLines = previousWeekMetrics.reduce((sum, m) => sum + m.lines_added, 0)
  
  if (previousLines === 0) {
    return { percentageChange: 0, trend: 'stable' }
  }
  
  const percentageChange = Math.round(((currentLines - previousLines) / previousLines) * 100)
  
  let trend: 'up' | 'down' | 'stable'
  if (percentageChange > 5) trend = 'up'
  else if (percentageChange < -5) trend = 'down'
  else trend = 'stable'
  
  return { percentageChange, trend }
}
