import axios from 'axios'

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token a las peticiones
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

export const authService = {
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
}