import { monitoringApi as api } from './api'

export const monitoringService = {
  // Sessions
  getAllSessions: async (params?: { start_date?: string; end_date?: string; user_id?: string }) => {
    const response = await api.get('/monitoring/sessions/', { params })
    return response.data
  },

  getUserSessions: async (
    userId: string,
    params?: { active_only?: boolean; limit?: number; offset?: number }
  ) => {
    const response = await api.get(`/monitoring/sessions/${userId}/`, { params })
    return response.data
  },

  getUserSessionStats: async (userId: string) => {
    const response = await api.get(`/monitoring/sessions/${userId}/stats/`)
    return response.data
  },

  // Code Metrics
  getAllCodeMetrics: async (params?: {
    end_date?: string
    project_id?: string
    user_id?: string
  }) => {
    const response = await api.get('/monitoring/code-metrics/', { params })
    return response.data
  },

  submitCodeMetrics: async (data: {
    session: string
    file_path: string
    lines_of_code: number
    lines_added: number
    lines_deleted: number
    lines_modified: number
    complexity_score: number
    function_count: number
    class_count: number
    comment_lines: number
    blank_lines: number
    metrics_metadata?: any
    calculated_at: string
  }) => {
    const response = await api.post('/monitoring/metrics/code/', data)
    return response.data
  },

  // Activities
  getAllActivities: async (params?: {
    start_date?: string
    end_date?: string
    user_id?: string
    activity_type?: string
  }) => {
    const response = await api.get('/monitoring/activities/', { params })
    return response.data
  },

  createActivity: async (data: {
    session: string
    activity_type: string
    description?: string
    duration_seconds?: number
    metadata?: any
  }) => {
    const response = await api.post('/monitoring/activities/', data)
    return response.data
  },

  // Events
  getAllEvents: async (params?: {
    start_date?: string
    end_date?: string
    user_id?: string
    event_type?: string
  }) => {
    const response = await api.get('/monitoring/events/', { params })
    return response.data
  },

  createEvent: async (data: {
    session: string
    event_type: string
    description?: string
    metadata?: any
  }) => {
    const response = await api.post('/monitoring/events/', data)
    return response.data
  },

  // Metrics
  getAllMetrics: async (params?: {
    start_date?: string
    end_date?: string
    user_id?: string
    metric_type?: string
  }) => {
    const response = await api.get('/monitoring/metrics/', { params })
    return response.data
  },
}