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

  updateProfile: async (data: { first_name?: string; last_name?: string; timezone?: string; phone_number?: string }) => {
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
  getGitHubAuthUrl: async (redirectUri?: string) => {
    const params = redirectUri ? { redirect_uri: redirectUri } : {}
    const response = await api.get('/github/url/', { params })
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
    
    // Transform response to match Redux expectations
    // Backend returns tokens in a nested object: { tokens: { access: "...", refresh: "..." } }
    return {
      user: response.data.user,
      access: response.data.tokens.access,
      refresh: response.data.tokens.refresh,
      session_token: response.data.session_token,
      message: response.data.message,
      invitation_accepted: response.data.invitation_accepted,
    }
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

  // Password Recovery
  forgotPassword: async (email: string) => {
    const response = await api.post('/forgot-password/', { email })
    return response.data
  },

  verifyResetCode: async (email: string, code: string) => {
    const response = await api.post('/verify-reset-code/', { email, code })
    return response.data
  },

  resetPassword: async (email: string, code: string, newPassword: string, newPasswordConfirm: string) => {
    const response = await api.post('/reset-password/', {
      email,
      code,
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm,
    })
    return response.data
  },

  // Account Setup (after Stripe payment)
  setupAccount: async (data: {
    email: string
    first_name: string
    last_name: string
    plan: string
  }) => {
    const response = await api.post('/setup-account/', data)
    return response.data
  },

  changeInitialPassword: async (data: {
    temp_password: string
    new_password: string
    new_password_confirm: string
  }) => {
    const response = await api.post('/change-initial-password/', data)
    return response.data
  },
  // Invitations
  sendInvitation: async (data: { invitee_email: string; role: 'supervisor' | 'developer' }) => {
    const response = await api.post('/invitations/', data)
    return response.data
  },

  getInvitations: async () => {
    const response = await api.get('/invitations/')
    return response.data
  },

  validateInvitation: async (token: string) => {
    const response = await api.get('/invitations/accept/', { params: { token } })
    return response.data
  },

  acceptInvitation: async (token: string) => {
    const response = await api.post('/invitations/accept/', { token })
    return response.data
  },

  resendInvitation: async (invitationId: string) => {
    try {
      const response = await api.post('/invitations/resend/', { invitation_id: invitationId })
      return response.data
    } catch (error) {
      console.warn('Resend invitation endpoint not available')
      throw error
    }
  },

  cancelInvitation: async (invitationId: string) => {
    try {
      const response = await api.delete(`/invitations/${invitationId}/`)
      return response.data
    } catch (error) {
      console.warn('Cancel invitation endpoint not available')
      throw error
    }
  },
}
