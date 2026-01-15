"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/lib/store/hooks"
import { setCredentials } from "@/lib/store/slices/authSlice"
import { toast } from "sonner"

export default function GitHubBackendCallbackPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    // This page handles the case where GitHub redirects to the backend
    // and the backend returns JSON with tokens
    // The user manually navigates here or we detect the backend response

    const handleBackendResponse = () => {
      try {
        // Try to get the response from the page content
        const bodyText = document.body.innerText
        
        if (bodyText.includes('"tokens"') && bodyText.includes('"user"')) {
          // Parse the JSON response
          const response = JSON.parse(bodyText)
          
          if (response.tokens && response.user) {
            // Save credentials
            dispatch(setCredentials({
              user: response.user,
              accessToken: response.tokens.access,
              refreshToken: response.tokens.refresh,
              sessionToken: response.session_token,
            }))

            toast.success("¡Autenticación exitosa!")
            router.push('/admin/dashboard')
          }
        } else {
          toast.error("No se encontró respuesta de autenticación")
          setTimeout(() => router.push('/auth/admin-login'), 2000)
        }
      } catch (error) {
        console.error('Error processing backend response:', error)
        toast.error("Error al procesar la autenticación")
        setTimeout(() => router.push('/auth/admin-login'), 2000)
      }
    }

    handleBackendResponse()
  }, [router, dispatch])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-xl text-gray-700">Procesando autenticación...</p>
      </div>
    </div>
  )
}
