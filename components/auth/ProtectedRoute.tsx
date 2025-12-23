'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { canAccessAdminRoutes } from '@/lib/utils/roleUtils'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdminAccess?: boolean
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  requireAdminAccess = false,
  redirectTo,
}: ProtectedRouteProps) {
  const router = useRouter()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    // Not authenticated - redirect to login
    if (!isAuthenticated) {
      router.push('/auth/admin-login')
      return
    }

    // Requires admin access but user doesn't have it
    if (requireAdminAccess && !canAccessAdminRoutes(user?.role)) {
      // Redirect developers to their dashboard or specified route
      const destination = redirectTo || '/dashboard'
      router.push(destination)
      return
    }
  }, [isAuthenticated, user, requireAdminAccess, redirectTo, router])

  // Don't render anything while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  // Don't render if user doesn't have required access
  if (requireAdminAccess && !canAccessAdminRoutes(user?.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
