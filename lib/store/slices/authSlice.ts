import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { authService } from '@/lib/services/authService'
import { PURGE } from 'redux-persist'

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  company_name?: string
  role: string
  plan?: string
  profileImageUrl?: string | null
  company?: {
    id: string
    name: string
    domain?: string
    industry?: string
    size?: string
  }
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  sessionToken: string | null
  tokenExpiresAt: number | null
  lastActivity: number | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  sessionToken: null,
  tokenExpiresAt: null,
  lastActivity: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al iniciar sesión')
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (
    {
      email,
      password,
      password_confirm,
      first_name,
      last_name,
      company_name,
      role,
      timezone
    }: {
      email: string
      password: string
      password_confirm: string
      first_name: string
      last_name: string
      company_name: string
      role: string,
      timezone?: string
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.register({
        email,
        password,
        password_confirm,
        first_name,
        last_name,
        company_name,
        role,
        ...(timezone && { timezone }),
      })
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al registrarse')
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async ({ refreshToken, sessionToken }: { refreshToken: string; sessionToken: string }) => {
    try {
      await authService.logout(refreshToken, sessionToken)
      return true
    } catch (_error: any) {
      // Aún si falla el API, limpiamos el estado local
      return true
    }
  }
)

export const verifyToken = createAsyncThunk('auth/verifyToken', async (token: string, { rejectWithValue }) => {
  try {
    const response = await authService.verifyToken(token)
    return response
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Token inválido')
  }
})

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (refreshToken: string, { rejectWithValue }) => {
    try {
      const response = await authService.refreshToken(refreshToken)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al refrescar token')
    }
  }
)

export const validateSession = createAsyncThunk(
  'auth/validateSession',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState }
      const { accessToken, refreshToken, tokenExpiresAt } = state.auth

      if (!accessToken || !refreshToken) {
        return rejectWithValue('No hay tokens disponibles')
      }

      const now = Date.now()

      // Si el token expira en menos de 5 minutos, refrescarlo
      if (tokenExpiresAt && tokenExpiresAt - now < 5 * 60 * 1000) {
        const result = await dispatch(refreshAccessToken(refreshToken)).unwrap()
        return result
      }

      // Verificar que el token sea válido
      const response = await authService.verifyToken(accessToken)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Sesión inválida')
    }
  }
)

// Fetch user profile image
export const fetchUserProfileImage = createAsyncThunk(
  'auth/fetchUserProfileImage',
  async (userId: string, { rejectWithValue }) => {
    console.log('🖼️ [Redux Thunk] Starting fetchUserProfileImage for userId:', userId)
    try {
      const imageUrl = await authService.getUserImage(userId)
      console.log('🖼️ [Redux Thunk] Received imageUrl:', imageUrl)
      return imageUrl // Returns blob URL or null
    } catch (error: any) {
      console.error('❌ [Redux Thunk] Error in fetchUserProfileImage:', error)
      return rejectWithValue(error.response?.data?.message || 'Error al cargar imagen')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User
        accessToken: string
        refreshToken: string
        sessionToken: string
      }>
    ) => {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.sessionToken = action.payload.sessionToken
      // Access token expira en 60 minutos
      state.tokenExpiresAt = Date.now() + 60 * 60 * 1000
      state.lastActivity = Date.now()
      state.isAuthenticated = true
    },
    setProfileImage: (state, action: PayloadAction<string | null>) => {
      if (state.user) {
        state.user.profileImageUrl = action.payload
      }
    },
    updateLastActivity: (state) => {
      state.lastActivity = Date.now()
    },
    logoutLocal: () => {
      return initialState
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.accessToken = action.payload.tokens.access
        state.refreshToken = action.payload.tokens.refresh
        state.sessionToken = action.payload.session_token
        state.tokenExpiresAt = Date.now() + 60 * 60 * 1000
        state.lastActivity = Date.now()
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.accessToken = action.payload.tokens.access
        state.refreshToken = action.payload.tokens.refresh
        state.sessionToken = action.payload.session_token
        state.tokenExpiresAt = Date.now() + 60 * 60 * 1000
        state.lastActivity = Date.now()
        state.isAuthenticated = true
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true
      })
      .addCase(logout.fulfilled, () => {
        return initialState
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false
        state.error = 'Error al cerrar sesión'
      })

    // Verify Token
    builder
      .addCase(verifyToken.pending, (state) => {
        state.loading = true
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Refresh Access Token
    builder
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.loading = false
        state.accessToken = action.payload.access
        state.tokenExpiresAt = Date.now() + 60 * 60 * 1000
        state.lastActivity = Date.now()
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Validate Session
    builder
      .addCase(validateSession.pending, (state) => {
        state.loading = true
      })
      .addCase(validateSession.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.access) {
          state.accessToken = action.payload.access
          state.tokenExpiresAt = Date.now() + 60 * 60 * 1000
        }
        state.lastActivity = Date.now()
      })
      .addCase(validateSession.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Fetch User Profile Image
    builder
      .addCase(fetchUserProfileImage.fulfilled, (state, action) => {
        if (state.user) {
          state.user.profileImageUrl = action.payload
        }
      })
      .addCase(fetchUserProfileImage.rejected, (state) => {
        if (state.user) {
          state.user.profileImageUrl = null
        }
      })

    // Limpiar todo cuando se purga el persist
    builder.addCase(PURGE, () => {
      return initialState
    })
  },
})

export const { clearError, setCredentials, updateLastActivity, logoutLocal, setProfileImage } = authSlice.actions
export default authSlice.reducer