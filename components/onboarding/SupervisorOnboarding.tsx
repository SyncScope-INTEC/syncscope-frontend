'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { UserCheck, Clock, CheckCircle2 } from 'lucide-react'

export function SupervisorOnboarding() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 via-blue-50 to-purple-50 p-4">
      <Card className="max-w-2xl w-full p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <UserCheck className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido a SyncScope!
          </h1>
          <p className="text-gray-600 mb-4">
            Tu cuenta de supervisor ha sido creada exitosamente
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Configuración Pendiente</h3>
              <p className="text-sm text-blue-800">
                Tu administrador necesita asignarte a un proyecto antes de que puedas comenzar a supervisar tu equipo.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-gray-900">Mientras tanto, puedes:</h3>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-gray-700">
                  <strong>Explorar la plataforma</strong> - Familiarízate con las herramientas de monitoreo
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-gray-700">
                  <strong>Configurar tu perfil</strong> - Actualiza tu información personal
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-gray-700">
                  <strong>Contactar a tu administrador</strong> - Solicita que te asigne a un proyecto
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-purple-900">
            💡 <strong>Próximos pasos:</strong> Una vez que tengas un proyecto asignado,
            podrás supervisar a tu equipo, ver métricas de productividad y generar reportes.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => router.push('/admin/profile')}
            variant="outline"
            className="flex-1"
          >
            Ver mi Perfil
          </Button>
          <Button
            onClick={() => router.push('/admin/dashboard')}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            Ir al Dashboard
          </Button>
        </div>
      </Card>
    </div>
  )
}
