import { authApi as api } from './api'

export const authService = {
  // Auth básico
  login: async (email: string, password: string) => {
    const response = await api.post('/login/', { email, password })
    return response.data
  },

  register: async (data: {
    email: string
    password: string
    password_confirm: string
    first_name: string
    last_name: string
    company_name: string
    role: string
  }) => {
    const response = await api.post('/register/', data)
    return response.data
  },

  logout: async (refreshToken: string, sessionToken: string) => {
    const response = await api.post('/logout/', {
      refresh_token: refreshToken,
      session_token: sessionToken,
    })
    return response.data
  },

  verifyToken: async (token: string) => {
    const response = await api.post('/verify-token/', { token })
    return response.data
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/refresh-token/', { refresh: refreshToken })
    return response.data
  },

  // Profile
  getProfile: async () => {
    const response = await api.get('/profile/')
    return response.data
  },

  updateProfile: async (data: { first_name?: string; last_name?: string; timezone?: string }) => {
    const response = await api.put('/profile/', data)
    return response.data
  },

  changePassword: async (oldPassword: string, newPassword: string, newPasswordConfirm: string) => {
    const response = await api.post('/change-password/', {
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm,
    })
    return response.data
  },

  // Profile Image
  getUserImage: async (userId: string) => {
    const response = await api.get(`/users/${userId}/image/`)
    return response.data
  },

  uploadUserImage: async (userId: string, imageFile: File) => {
    const formData = new FormData()
    formData.append('image', imageFile)

    const response = await api.post(`/users/${userId}/image/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // GitHub OAuth
  getGitHubAuthUrl: async () => {
    const response = await api.get('/github/url/')
    return response.data
  },

  initiateGitHubOAuth: async () => {
    const response = await api.post('/github/initiate/')
    return response.data
  },

  checkGitHubStatus: async (stateId: string) => {
    const response = await api.get(`/github/status/${stateId}/`)
    return response.data
  },

  handleGitHubCallback: async (code: string, state: string) => {
    const response = await api.get(`/github/callback/?code=${code}&state=${state}`)
    return response.data
  },

  // Session Management
  getSessions: async () => {
    const response = await api.get('/sessions/')
    return response.data
  },

  deleteSessions: async () => {
    const response = await api.delete('/sessions/')
    return response.data
  },

  // Supervision
  getSupervisedUsers: async () => {
    const response = await api.get('/supervised-users/')
    return response.data
  },

  createSupervision: async (data: { supervisor_id: string; supervisee_id: string }) => {
    const response = await api.post('/supervised-users/', data)
    return response.data
  },

  getSupervision: async (id: string) => {
    const response = await api.get(`/supervised-users/${id}/`)
    return response.data
  },

  updateSupervision: async (id: string, data: any) => {
    const response = await api.put(`/supervised-users/${id}/`, data)
    return response.data
  },

  deleteSupervision: async (id: string) => {
    const response = await api.delete(`/supervised-users/${id}/`)
    return response.data
  },
}