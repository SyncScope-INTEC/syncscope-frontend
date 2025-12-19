import { alertsApi as api } from './api'

export const alertsService = {
  // Alerts CRUD
  getAllAlerts: async (params?: { page?: number }) => {
    const response = await api.get('/alerts/', { params })
    return response.data
  },

  getAlert: async (id: string) => {
    const response = await api.get(`/alerts/${id}/`)
    return response.data
  },

  createAlert: async (data: {
    alert_type: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    title: string
    message: string
    user_id?: string
    session_id?: string
    metric_id?: string
    threshold_value?: number
    current_value?: number
    metadata?: any
  }) => {
    const response = await api.post('/alerts/', data)
    return response.data
  },

  updateAlert: async (id: string, data: any) => {
    const response = await api.put(`/alerts/${id}/`, data)
    return response.data
  },

  partialUpdateAlert: async (id: string, data: any) => {
    const response = await api.patch(`/alerts/${id}/`, data)
    return response.data
  },

  deleteAlert: async (id: string) => {
    const response = await api.delete(`/alerts/${id}/`)
    return response.data
  },

  // Alert Actions
  muteAlert: async (id: string, duration_minutes?: number) => {
    const response = await api.post(`/alerts/${id}/mute/`, { duration_minutes })
    return response.data
  },

  unmuteAlert: async (id: string) => {
    const response = await api.post(`/alerts/${id}/unmute/`)
    return response.data
  },

  acknowledgeAlert: async (id: string, acknowledged_by?: string, notes?: string) => {
    const response = await api.post(`/alerts/${id}/acknowledge/`, {
      acknowledged_by,
      notes,
    })
    return response.data
  },

  resolveAlert: async (id: string, resolved_by?: string, resolution_notes?: string) => {
    const response = await api.post(`/alerts/${id}/resolve/`, {
      resolved_by,
      resolution_notes,
    })
    return response.data
  },
}
