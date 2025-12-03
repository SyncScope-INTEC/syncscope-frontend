"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { authService } from "@/lib/services/authService"
import { useAppDispatch } from "@/lib/store/hooks"
import { setCredentials } from "@/lib/store/slices/authSlice"
import { toast } from "sonner"

export default function GitHubCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    async function handleCallback() {
      const code = searchParams?.get('code')
      const state = searchParams?.get('state')

      if (!code || !state) {
        setStatus('error')
        toast.error("Faltan parámetros de autenticación")
        setTimeout(() => router.push('/auth/admin-login'), 2000)
        return
      }

      try {
        const response = await authService.handleGitHubCallback(code, state)
        
        // Guardar credenciales en Redux
        dispatch(setCredentials({
          user: response.user,
          accessToken: response.access,
          refreshToken: response.refresh,
          sessionToken: response.session_token,
        }))

        setStatus('success')
        toast.success("¡Autenticación exitosa!")
        router.push('/admin/dashboard')
      } catch (error: any) {
        console.error('GitHub callback error:', error)
        setStatus('error')
        toast.error("Error al autenticar con GitHub")
        setTimeout(() => router.push('/auth/admin-login'), 2000)
      }
    }

    handleCallback()
  }, [searchParams, router, dispatch])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
      <div className="text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-700">Autenticando con GitHub...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="text-6xl mb-4">✅</div>
            <p className="text-xl text-gray-700">¡Autenticación exitosa!</p>
            <p className="text-gray-500 mt-2">Redirigiendo al dashboard...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-6xl mb-4">❌</div>
            <p className="text-xl text-gray-700">Error al autenticar</p>
            <p className="text-gray-500 mt-2">Redirigiendo al login...</p>
          </>
        )}
      </div>
    </div>
  )
}