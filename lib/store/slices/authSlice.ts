import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { authService } from '@/lib/services/authService'

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  company_name: string
  role: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  sessionToken: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  sessionToken: null,
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
    }: {
      email: string
      password: string
      password_confirm: string
      first_name: string
      last_name: string
      company_name: string
      role: string
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
      })
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al registrarse')
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async ({ refreshToken, sessionToken }: { refreshToken: string; sessionToken: string }, { rejectWithValue }) => {
    try {
      await authService.logout(refreshToken, sessionToken)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cerrar sesión')
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
      state.isAuthenticated = true
    },
    logoutLocal: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.sessionToken = null
      state.isAuthenticated = false
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
        state.accessToken = action.payload.access
        state.refreshToken = action.payload.refresh
        state.sessionToken = action.payload.session_token
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
        state.accessToken = action.payload.access
        state.refreshToken = action.payload.refresh
        state.sessionToken = action.payload.session_token
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
      .addCase(logout.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.sessionToken = null
        state.isAuthenticated = false
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false
        // Aun si falla, limpiar el estado local
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.sessionToken = null
        state.isAuthenticated = false
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
      .addCase(verifyToken.rejected, (state) => {
        state.loading = false
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.sessionToken = null
        state.isAuthenticated = false
      })
  },
})

export const { clearError, setCredentials, logoutLocal } = authSlice.actions
export default authSlice.reducer