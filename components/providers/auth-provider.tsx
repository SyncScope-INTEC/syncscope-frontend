'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { validateSession, logoutLocal } from '@/lib/store/slices/authSlice'
import { persistor } from '@/lib/store'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { isAuthenticated, accessToken, refreshToken } = useAppSelector((state) => state.auth)
  const [isValidating, setIsValidating] = useState(true)

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
        dispatch(logoutLocal())
        await persistor.purge()
        router.push('/auth/admin-login')
        setIsValidating(false)
        return
      }

      // Validar la sesión
      try {
        await dispatch(validateSession()).unwrap()
        setIsValidating(false)
      } catch (error) {
        // Si falla la validación, limpiar estado y redirigir
        console.error('Session validation failed:', error)
        dispatch(logoutLocal())
        await persistor.purge()
        router.push('/auth/admin-login')
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
