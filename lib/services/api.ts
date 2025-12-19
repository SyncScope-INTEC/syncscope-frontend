import axios from 'axios'

const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_URL
const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL

// Función para obtener el token del localStorage
const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null

  try {
    const state = localStorage.getItem('persist:root')
    if (!state) return null

    const parsedState = JSON.parse(state)
    const authState = JSON.parse(parsedState.auth)
    return authState.accessToken || null
  } catch (error) {
    console.error('Error parsing token:', error)
    return null
  }
}

// Crear instancia de axios para el servicio de autenticación
export const authApi = axios.create({
  baseURL: `${AUTH_API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Crear instancias de axios para cada servicio del gateway
export const alertsApi = axios.create({
  baseURL: `${GATEWAY_URL}/alerts`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const analyticsApi = axios.create({
  baseURL: `${GATEWAY_URL}/analytics`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const managementApi = axios.create({
  baseURL: `${GATEWAY_URL}/management`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const monitoringApi = axios.create({
  baseURL: `${GATEWAY_URL}/monitoring`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor para agregar token
const requestInterceptor = (config: any) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

// Response interceptor para manejar errores 401
const responseErrorInterceptor = async (error: any) => {
  const originalRequest = error.config

  // Si es un error 401 y no es un retry
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true

    try {
      // Intentar refrescar el token
      if (typeof window !== 'undefined') {
        const state = localStorage.getItem('persist:root')
        if (state) {
          const parsedState = JSON.parse(state)
          const authState = JSON.parse(parsedState.auth)
          const refreshToken = authState.refreshToken

          if (refreshToken) {
            // Llamar al endpoint de refresh
            const response = await axios.post(`${AUTH_API_URL}/auth/refresh-token/`, {
              refresh: refreshToken,
            })

            const newAccessToken = response.data.access

            // Actualizar el token en localStorage
            authState.accessToken = newAccessToken
            authState.tokenExpiresAt = Date.now() + 60 * 60 * 1000
            parsedState.auth = JSON.stringify(authState)
            localStorage.setItem('persist:root', JSON.stringify(parsedState))

            // Reintentar la petición original con el nuevo token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
            return axios(originalRequest)
          }
        }
      }
    } catch (refreshError) {
      // Si falla el refresh, limpiar el estado y redirigir al login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('persist:root')
        window.location.href = '/auth/admin-login'
      }
      return Promise.reject(refreshError)
    }
  }

  return Promise.reject(error)
}

// Aplicar interceptores a todas las instancias
const applyInterceptors = (instance: any) => {
  instance.interceptors.request.use(requestInterceptor, (error: any) => Promise.reject(error))
  instance.interceptors.response.use((response: any) => response, responseErrorInterceptor)
}

applyInterceptors(authApi)
applyInterceptors(alertsApi)
applyInterceptors(analyticsApi)
applyInterceptors(managementApi)
applyInterceptors(monitoringApi)
