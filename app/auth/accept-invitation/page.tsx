"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { managementService } from "@/lib/services/managementService"
import { toast } from "sonner"
import { Loader2, Mail, FolderKanban, UserCheck, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AcceptProjectInvitationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

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
        const data = await managementService.validateProjectInvitation(token)

        if (data.is_expired) {
          setError('Esta invitación ha expirado')
        } else if (data.is_accepted) {
          setError('Esta invitación ya fue aceptada')
        } else {
          setInvitation(data)
        }
      } catch (err: any) {
        console.error('Error validating invitation:', err)
        setError('Error al validar la invitación o la invitación no es válida')
      } finally {
        setLoading(false)
      }
    }

    validateInvitation()
  }, [searchParams])

  const handleAcceptInvitation = async () => {
    const token = searchParams?.get('token')
    if (!token) return

    setAccepting(true)

    try {
      await managementService.acceptProjectInvitation(token)

      toast.success('¡Invitación aceptada exitosamente!')

      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 1500)
    } catch (error: any) {
      console.error('Error accepting invitation:', error)
      toast.error(error?.response?.data?.error || 'Error al aceptar la invitación')
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
            onClick={() => router.push('/admin/dashboard')}
            variant="outline"
            className="w-full"
          >
            Ir al Dashboard
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
            <FolderKanban className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Invitación a Proyecto
          </h1>
          <p className="text-gray-600">
            Has sido invitado a unirte a un proyecto
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6 space-y-4">
          <div className="flex items-start gap-3">
            <FolderKanban className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Proyecto</p>
              <p className="font-semibold text-gray-900">{invitation?.project_name}</p>
            </div>
          </div>

          {invitation?.team_name && (
            <div className="flex items-start gap-3">
              <UserCheck className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Equipo</p>
                <p className="font-semibold text-gray-900">{invitation?.team_name}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Badge className="bg-purple-600">
              <span className="capitalize">{invitation?.role}</span>
            </Badge>
            <div>
              <p className="text-sm text-gray-600">Tu rol en el proyecto</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Invitado a</p>
              <p className="font-semibold text-gray-900">{invitation?.invitee_email}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleAcceptInvitation}
            disabled={accepting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg"
          >
            {accepting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Aceptando...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Aceptar Invitación
              </>
            )}
          </Button>

          <p className="text-sm text-gray-500 text-center">
            Al aceptar, tendrás acceso al proyecto y podrás colaborar con el equipo
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            ¿No quieres aceptar?{' '}
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Ir al Dashboard
            </button>
          </p>
        </div>
      </Card>
    </div>
  )
}
