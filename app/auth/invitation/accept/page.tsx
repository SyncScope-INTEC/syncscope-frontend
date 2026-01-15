"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { authService } from "@/lib/services/authService"
import { useAppDispatch } from "@/lib/store/hooks"
import { setCredentials } from "@/lib/store/slices/authSlice"
import { toast } from "sonner"
import { Loader2, Mail, Building2, UserCheck, Github } from "lucide-react"

export default function InvitationAcceptPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()

  const [loading, setLoading] = useState(true)
  const [invitation, setInvitation] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [accepting, setAccepting] = useState(false)

  useEffect(() => {
    const token = searchParams?.get('token')

    if (!token) {
      setError('Token de invitación no encontrado')
      setLoading(false)
      return
    }

    // Validate invitation
    const validateInvitation = async () => {
      try {
        const data = await authService.validateInvitation(token)
        
        if (!data.is_valid) {
          setError('Esta invitación no es válida o ha expirado')
        } else if (data.is_expired) {
          setError('Esta invitación ha expirado')
        } else if (data.is_accepted) {
          setError('Esta invitación ya fue aceptada')
        } else {
          setInvitation(data)
        }
      } catch (err: any) {
        console.error('Error validating invitation:', err)
        setError('Error al validar la invitación')
      } finally {
        setLoading(false)
      }
    }

    validateInvitation()
  }, [searchParams])

  const handleAcceptWithGitHub = async () => {
    const token = searchParams?.get('token')
    if (!token) return

    setAccepting(true)

    try {
      // Store token in localStorage for after OAuth
      localStorage.setItem('invitation_token', token)

      // Get GitHub OAuth URL
      const response = await authService.getGitHubAuthUrl(
        `${window.location.origin}/auth/github/callback`
      )

      if (response?.oauth_url) {
        // Redirect to GitHub OAuth
        window.location.href = response.oauth_url
      } else {
        toast.error('Error al obtener URL de GitHub')
        setAccepting(false)
      }
    } catch (error: any) {
      console.error('Error initiating GitHub OAuth:', error)
      toast.error('Error al iniciar autenticación con GitHub')
      setAccepting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Validando invitación...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invitación no válida
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => router.push('/auth/admin-login')}
            variant="outline"
            className="w-full"
          >
            Ir al inicio de sesión
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white p-4">
      <Card className="max-w-2xl w-full p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Has sido invitado a SyncScope
          </h1>
          <p className="text-gray-600">
            Acepta la invitación para unirte al equipo
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6 space-y-4">
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Empresa</p>
              <p className="font-semibold text-gray-900">{invitation?.company_name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <UserCheck className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Rol asignado</p>
              <p className="font-semibold text-gray-900 capitalize">{invitation?.role}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Invitado por</p>
              <p className="font-semibold text-gray-900">
                {invitation?.inviter_name} ({invitation?.inviter_email})
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleAcceptWithGitHub}
            disabled={accepting}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 text-lg"
          >
            {accepting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Redirigiendo a GitHub...
              </>
            ) : (
              <>
                <Github className="w-5 h-5 mr-2" />
                Aceptar con GitHub
              </>
            )}
          </Button>

          <p className="text-sm text-gray-500 text-center">
            Al aceptar, se creará tu cuenta automáticamente y tendrás acceso al dashboard
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <button
              onClick={() => router.push('/auth/admin-login')}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </Card>
    </div>
  )
}
