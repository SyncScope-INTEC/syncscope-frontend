'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { updateLastActivity } from '@/lib/store/slices/authSlice'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && !loading && !isAuthenticated) {
      router.push('/auth/admin-login')
    }
  }, [isAuthenticated, loading, router, isClient])

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

  return <>{children}</>
}