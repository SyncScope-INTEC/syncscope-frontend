import axios from 'axios'

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL

const api = axios.create({
  baseURL: `${GATEWAY_URL}/analytics`,
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

export const analyticsService = {
  // Dashboard
  getDashboard: async () => {
    const response = await api.get('/analytics/dashboard/')
    return response.data
  },

  // Metrics
  getMetrics: async (page = 1) => {
    const response = await api.get('/metrics/', { params: { page } })
    return response.data
  },

  getMetric: async (id: string) => {
    const response = await api.get(`/metrics/${id}/`)
    return response.data
  },

  createMetric: async (data: {
    name: string
    description: string
    calculation_method: string
    parameters: any
    is_active: boolean
  }) => {
    const response = await api.post('/metrics/', data)
    return response.data
  },

  updateMetric: async (
    id: string,
    data: {
      name: string
      description: string
      calculation_method: string
      parameters: any
      is_active: boolean
    }
  ) => {
    const response = await api.put(`/metrics/${id}/`, data)
    return response.data
  },

  deleteMetric: async (id: string) => {
    const response = await api.delete(`/metrics/${id}/`)
    return response.data
  },

  // Reports
  getReports: async (page = 1) => {
    const response = await api.get('/reports/', { params: { page } })
    return response.data
  },

  getReport: async (id: string) => {
    const response = await api.get(`/reports/${id}/`)
    return response.data
  },

  createReport: async (data: { name: string; type: string; config: any }) => {
    const response = await api.post('/reports/', data)
    return response.data
  },

  updateReport: async (id: string, data: { name: string; type: string; config: any }) => {
    const response = await api.put(`/reports/${id}/`, data)
    return response.data
  },

  deleteReport: async (id: string) => {
    const response = await api.delete(`/reports/${id}/`)
    return response.data
  },

  regenerateReport: async (id: string, data: { name: string; type: string; config: any }) => {
    const response = await api.post(`/reports/${id}/regenerate/`, data)
    return response.data
  },

  exportReport: async (id: string, format: string, include_charts = true, detailed = false) => {
    const response = await api.post(`/reports/${id}/export/`, {
      format,
      include_charts,
      detailed,
    })
    return response.data
  },

  // Calculate
  calculate: async (data: any) => {
    const response = await api.post('/calculate/', data)
    return response.data
  },
}