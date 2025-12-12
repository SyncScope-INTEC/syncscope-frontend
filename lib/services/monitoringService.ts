import axios from 'axios'

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL

const api = axios.create({
  baseURL: `${GATEWAY_URL}/monitoring`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const state = localStorage.getItem('persist:root')
      if (state) {
        try {
          const parsedState = JSON.parse(state)
          const authState = JSON.parse(parsedState.auth)
          const token = authState.accessToken
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        } catch (error) {
          console.error('Error parsing token:', error)
        }
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const monitoringService = {
  // Sessions
  getAllSessions: async (params?: { start_date?: string; end_date?: string; user_id?: string }) => {
    const response = await api.get('/sessions/', { params })
    return response.data
  },

  getUserSessions: async (
    userId: string,
    params?: { active_only?: boolean; limit?: number; offset?: number }
  ) => {
    const response = await api.get(`/sessions/${userId}/`, { params })
    return response.data
  },

  getUserSessionStats: async (userId: string) => {
    const response = await api.get(`/sessions/${userId}/stats/`)
    return response.data
  },

  // Code Metrics
  getAllCodeMetrics: async (params?: {
    start_date?: string
    end_date?: string
    project_id?: string
    user_id?: string
  }) => {
    const response = await api.get('/code-metrics/', { params })
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
    const response = await api.post('/metrics/code/', data)
    return response.data
  },

  // Activities
  getAllActivities: async (params?: {
    start_date?: string
    end_date?: string
    user_id?: string
    activity_type?: string
  }) => {
    const response = await api.get('/activities/', { params })
    return response.data
  },

  createActivity: async (data: {
    session: string
    activity_type: string
    description?: string
    duration_seconds?: number
    metadata?: any
  }) => {
    const response = await api.post('/activities/', data)
    return response.data
  },

  // Events
  getAllEvents: async (params?: {
    start_date?: string
    end_date?: string
    user_id?: string
    event_type?: string
  }) => {
    const response = await api.get('/events/', { params })
    return response.data
  },

  createEvent: async (data: {
    session: string
    event_type: string
    description?: string
    metadata?: any
  }) => {
    const response = await api.post('/events/', data)
    return response.data
  },

  // Metrics
  getAllMetrics: async (params?: {
    start_date?: string
    end_date?: string
    user_id?: string
    metric_type?: string
  }) => {
    const response = await api.get('/metrics/', { params })
    return response.data
  },
}