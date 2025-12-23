'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { managementService } from '@/lib/services/managementService'
import { toast } from 'sonner'
import { Rocket, FolderPlus } from 'lucide-react'

export function AdminOnboarding() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Por favor ingresa un nombre para el proyecto')
      return
    }

    setLoading(true)
    try {
      // First, create a default team for the company
      const team = await managementService.createTeam({
        name: `Equipo ${formData.name}`,
        description: 'Equipo principal del proyecto',
      })

      // Then create the project with the team
      await managementService.createProject({
        name: formData.name,
        description: formData.description || 'Primer proyecto de la empresa',
        team: team.id,
      })

      toast.success('¡Proyecto creado exitosamente!')

      // Refresh and redirect to dashboard
      router.refresh()
      router.push('/admin/dashboard')
    } catch (error: any) {
      toast.error(error?.message || 'Error al crear el proyecto')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 via-blue-50 to-purple-50 p-4">
      <Card className="max-w-2xl w-full p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <Rocket className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido a SyncScope!
          </h1>
          <p className="text-gray-600">
            Para comenzar, crea tu primer proyecto y empieza a monitorear la productividad de tu equipo
          </p>
        </div>

        <form onSubmit={handleCreateProject} className="space-y-6">
          <div>
            <Label htmlFor="projectName" className="text-gray-900 font-medium">
              Nombre del Proyecto <span className="text-red-500">*</span>
            </Label>
            <Input
              id="projectName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Proyecto Principal, Sistema de Ventas, etc."
              disabled={loading}
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="projectDescription" className="text-gray-900 font-medium">
              Descripción (Opcional)
            </Label>
            <Textarea
              id="projectDescription"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe brevemente el proyecto..."
              disabled={loading}
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-900">
              <FolderPlus className="w-4 h-4 inline mr-2" />
              <strong>Próximos pasos:</strong> Después de crear tu proyecto, podrás agregar miembros del equipo, 
              configurar supervisores y comenzar a monitorear la productividad.
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading || !formData.name.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
          >
            {loading ? 'Creando proyecto...' : 'Crear Proyecto y Continuar'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
