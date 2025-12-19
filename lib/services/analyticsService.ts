import { analyticsApi as api } from './api'

export const analyticsService = {
  // Dashboard
  getDashboard: async () => {
    const response = await api.get('/analytics/dashboard/')
    return response.data
  },

  // Metrics
  getMetrics: async (page = 1) => {
    const response = await api.get('/analytics/metrics/', { params: { page } })
    return response.data
  },

  getMetric: async (id: string) => {
    const response = await api.get(`/analytics/metrics/${id}/`)
    return response.data
  },

  createMetric: async (data: {
    name: string
    description: string
    calculation_method: string
    parameters: any
    is_active: boolean
  }) => {
    const response = await api.post('/analytics/metrics/', data)
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
    const response = await api.put(`/analytics/metrics/${id}/`, data)
    return response.data
  },

  deleteMetric: async (id: string) => {
    const response = await api.delete(`/analytics/metrics/${id}/`)
    return response.data
  },

  // Reports
  getReports: async (page = 1) => {
    const response = await api.get('/analytics/reports/', { params: { page } })
    return response.data
  },

  getReport: async (id: string) => {
    const response = await api.get(`/analytics/reports/${id}/`)
    return response.data
  },

  createReport: async (data: { name: string; type: string; config: any }) => {
    const response = await api.post('/analytics/reports/', data)
    return response.data
  },

  updateReport: async (id: string, data: { name: string; type: string; config: any }) => {
    const response = await api.put(`/analytics/reports/${id}/`, data)
    return response.data
  },

  deleteReport: async (id: string) => {
    const response = await api.delete(`/analytics/reports/${id}/`)
    return response.data
  },

  regenerateReport: async (id: string, data: { name: string; type: string; config: any }) => {
    const response = await api.post(`/analytics/reports/${id}/regenerate/`, data)
    return response.data
  },

  exportReport: async (id: string, format: string, include_charts = true, detailed = false) => {
    const response = await api.post(`/analytics/reports/${id}/export/`, {
      format,
      include_charts,
      detailed,
    })
    return response.data
  },

  // Calculate
  calculate: async (data: any) => {
    const response = await api.post('/analytics/calculate/', data)
    return response.data
  },
}