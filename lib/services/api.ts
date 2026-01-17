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

// Variables para manejar la concurrencia en el refresh token
let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

// Response interceptor para manejar errores 401
const responseErrorInterceptor = async (error: any) => {
  const originalRequest = error.config

  // Ignorar errores de imagen (404/401) para evitar loops de logout
  if (originalRequest.url?.includes('/image/')) {
    return Promise.reject(error)
  }

  // Si es un error 401 y no es un retry
  if (error.response?.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      // Si ya se está refrescando, agregar a la cola
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        originalRequest.headers['Authorization'] = 'Bearer ' + token
        return axios(originalRequest)
      }).catch(err => {
        return Promise.reject(err)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      // Intentar refrescar el token
      if (typeof window !== 'undefined') {
        const state = localStorage.getItem('persist:root')
        if (state) {
          const parsedState = JSON.parse(state)
          const authState = JSON.parse(parsedState.auth)
          const refreshToken = authState.refreshToken
          const tokenExpiresAt = authState.tokenExpiresAt

          // Verificar si el access token ya expiró
          const now = Date.now()
          const isAccessTokenExpired = tokenExpiresAt && tokenExpiresAt < now

          if (isAccessTokenExpired) {
            console.log('Access token expired, attempting refresh...')
          }

          // Si no hay refresh token, limpiar y redirigir
          if (!refreshToken) {
            console.log('No refresh token available, clearing session...')
            localStorage.removeItem('persist:root')
            window.location.href = '/auth/admin-login'
            return Promise.reject(error)
          }

          // Intentar refrescar el token
          const response = await axios.post(`${AUTH_API_URL}/auth/refresh-token/`, {
            refresh: refreshToken,
          })

          const newAccessToken = response.data.access

          // Actualizar el token en localStorage
          authState.accessToken = newAccessToken
          authState.tokenExpiresAt = Date.now() + 60 * 60 * 1000
          parsedState.auth = JSON.stringify(authState)
          localStorage.setItem('persist:root', JSON.stringify(parsedState))

          console.log('Token refreshed successfully')

          // Procesar la cola de peticiones en espera
          processQueue(null, newAccessToken)
          isRefreshing = false

          // Reintentar la petición original con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return axios(originalRequest)
        } else {
          // No hay estado guardado, limpiar y redirigir
          console.log('No persisted state found, redirecting to login...')
          localStorage.removeItem('persist:root')
          window.location.href = '/auth/admin-login'
          isRefreshing = false
        }
      }
    } catch (refreshError: any) {
      // Si falla el refresh (refresh token expirado o inválido), limpiar el estado y redirigir
      console.log('Refresh token failed, clearing session...', refreshError)
      processQueue(refreshError, null)
      isRefreshing = false

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
