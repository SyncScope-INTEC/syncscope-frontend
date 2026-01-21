'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { validateSession, logoutLocal } from '@/lib/store/slices/authSlice'
import { persistor } from '@/lib/store'

const VALIDATION_INTERVAL = 5 * 60 * 1000 // 5 minutos

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { isAuthenticated, accessToken, refreshToken } = useAppSelector((state) => state.auth)
  const [isValidating, setIsValidating] = useState(true)
  const lastValidationRef = useRef<number>(0)

  useEffect(() => {
    const validateAuth = async () => {
      // Rutas públicas que no requieren autenticación
      const publicRoutes = ['/auth/admin-login', '/auth/register', '/auth/github/callback', '/']
      const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

      // Si estamos en una ruta pública, no validar
      if (isPublicRoute) {
        setIsValidating(false)
        return
      }

      // Si no hay tokens, limpiar estado y redirigir
      if (!accessToken || !refreshToken) {
        console.log('🔐 [AuthProvider] No tokens found, redirecting to login')
        dispatch(logoutLocal())
        await persistor.purge()
        router.push('/auth/admin-login')
        setIsValidating(false)
        return
      }

      // Debouncing: solo validar si han pasado más de VALIDATION_INTERVAL desde la última validación
      const now = Date.now()
      const timeSinceLastValidation = now - lastValidationRef.current

      if (timeSinceLastValidation < VALIDATION_INTERVAL && lastValidationRef.current > 0) {
        console.log('🔐 [AuthProvider] Skipping validation, last validated', Math.floor(timeSinceLastValidation / 1000), 'seconds ago')
        setIsValidating(false)
        return
      }

      // Validar la sesión
      try {
        console.log('🔐 [AuthProvider] Validating session...')
        await dispatch(validateSession()).unwrap()
        lastValidationRef.current = now
        setIsValidating(false)
        console.log('✅ [AuthProvider] Session validated successfully')
      } catch (error: any) {
        // Solo hacer logout si es un error de autenticación real
        const isAuthError = error?.message?.includes('inválida') || error?.message?.includes('invalid')

        console.error('❌ [AuthProvider] Session validation failed:', {
          error,
          isAuthError,
          message: error?.message
        })

        if (isAuthError) {
          console.log('🚪 [AuthProvider] Authentication error, logging out')
          dispatch(logoutLocal())
          await persistor.purge()
          router.push('/auth/admin-login')
        } else {
          console.warn('⚠️ [AuthProvider] Validation failed but keeping session (likely network error)')
        }

        setIsValidating(false)
      }
    }

    validateAuth()
  }, [pathname, accessToken, refreshToken, dispatch, router])

  // Mostrar loading mientras valida
  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return <>{children}</>
}
