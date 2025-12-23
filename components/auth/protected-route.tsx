'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { updateLastActivity } from '@/lib/store/slices/authSlice'
import { canAccessAdminRoutes } from '@/lib/utils/roleUtils'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdminAccess?: boolean
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  requireAdminAccess = false,
  redirectTo 
}: ProtectedRouteProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, loading, user } = useAppSelector((state) => state.auth)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && !loading && !isAuthenticated) {
      router.push('/auth/admin-login')
    }
  }, [isAuthenticated, loading, router, isClient])

  // Check role-based access
  useEffect(() => {
    if (isClient && !loading && isAuthenticated && requireAdminAccess) {
      if (!canAccessAdminRoutes(user?.role)) {
        // Redirect developers to access denied page
        router.push('/auth/access-denied')
      }
    }
  }, [isClient, loading, isAuthenticated, user, requireAdminAccess, router])

  // Actualizar última actividad en cada interacción
  useEffect(() => {
    const handleActivity = () => {
      if (isAuthenticated) {
        dispatch(updateLastActivity())
      }
    }

    // Escuchar eventos de actividad del usuario
    window.addEventListener('mousedown', handleActivity)
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('scroll', handleActivity)
    window.addEventListener('touchstart', handleActivity)

    return () => {
      window.removeEventListener('mousedown', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('scroll', handleActivity)
      window.removeEventListener('touchstart', handleActivity)
    }
  }, [isAuthenticated, dispatch])

  // Esperar a que esté en el cliente y cargue el estado
  if (!isClient || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  // Check role access - will redirect if needed
  if (requireAdminAccess && !canAccessAdminRoutes(user?.role)) {
    return null
  }

  return <>{children}</>
}