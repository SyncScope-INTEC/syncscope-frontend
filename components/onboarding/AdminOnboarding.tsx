'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { managementService } from '@/lib/services/managementService'
import { authService } from '@/lib/services/authService'
import { toast } from 'sonner'
import { Rocket, FolderPlus, Users, CheckCircle, Loader2, Mail, X } from 'lucide-react'

type OnboardingStep = 1 | 2 | 3

interface ProjectFormData {
  name: string
  team_name: string
  description: string
  project_url: string
  git_repository_url: string
}

interface Invitation {
  email: string
  role: 'supervisor' | 'developer'
  status: 'pending' | 'sent' | 'error'
}

export function AdminOnboarding() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1)
  const [loading, setLoading] = useState(false)
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null)

  // Project form data
  const [projectData, setProjectData] = useState<ProjectFormData>({
    name: '',
    team_name: '',
    description: '',
    project_url: '',
    git_repository_url: '',
  })

  // Invitations data
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [newInviteEmail, setNewInviteEmail] = useState('')
  const [newInviteRole, setNewInviteRole] = useState<'supervisor' | 'developer'>('developer')

  const handleCreateProject = async () => {
    if (!projectData.name.trim() || !projectData.team_name.trim()) {
      toast.error('Por favor completa los campos requeridos')
      return
    }

    setLoading(true)
    try {
      // Create team first
      const team = await managementService.createTeam({
        name: projectData.team_name,
        description: `Equipo del proyecto ${projectData.name}`,
      })

      // Then create project with team
      const project = await managementService.createProject({
        name: projectData.name,
        description: projectData.description || 'Proyecto creado durante onboarding',
        team: team.id,
        project_url: projectData.project_url || undefined,
        git_repository_url: projectData.git_repository_url || undefined,
      })

      setCreatedProjectId(project.id)
      toast.success('¡Proyecto creado exitosamente!')
      setCurrentStep(3)
    } catch (error: any) {
      toast.error(error?.message || 'Error al crear el proyecto')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddInvitation = () => {
    if (!newInviteEmail.trim()) {
      toast.error('Ingresa un email válido')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newInviteEmail)) {
      toast.error('Email inválido')
      return
    }

    // Check if already added
    if (invitations.some(inv => inv.email === newInviteEmail)) {
      toast.error('Este email ya fue agregado')
      return
    }

    setInvitations([
      ...invitations,
      { email: newInviteEmail, role: newInviteRole, status: 'pending' }
    ])
    setNewInviteEmail('')
  }

  const handleRemoveInvitation = (email: string) => {
    setInvitations(invitations.filter(inv => inv.email !== email))
  }

  const handleSendInvitations = async () => {
    if (invitations.length === 0) {
      // Skip invitations, go to dashboard
      router.refresh()
      router.push('/admin/dashboard')
      return
    }

    setLoading(true)
    const updatedInvitations = [...invitations]

    for (let i = 0; i < updatedInvitations.length; i++) {
      try {
        await authService.sendInvitation({
          invitee_email: updatedInvitations[i].email,
          role: updatedInvitations[i].role,
        })
        updatedInvitations[i].status = 'sent'
        setInvitations([...updatedInvitations])
      } catch (error) {
        updatedInvitations[i].status = 'error'
        setInvitations([...updatedInvitations])
      }
    }

    setLoading(false)
    const successCount = updatedInvitations.filter(inv => inv.status === 'sent').length
    
    if (successCount > 0) {
      toast.success(`${successCount} invitación(es) enviada(s) exitosamente`)
    }

    // Redirect to dashboard
    setTimeout(() => {
      router.refresh()
      router.push('/admin/dashboard')
    }, 1500)
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              step === currentStep
                ? 'bg-purple-600 text-white'
                : step < currentStep
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
          </div>
          {step < 3 && (
            <div
              className={`w-16 h-1 mx-2 ${
                step < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <div className="text-center space-y-6">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-4">
        <Rocket className="w-10 h-10 text-purple-600" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900">
        ¡Bienvenido a SyncScope!
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Aún no tienes ningún proyecto monitoreado. Crea un proyecto para empezar a 
        analizar el rendimiento de los desarrolladores, monitorear la calidad del código y 
        optimizar tu flujo de trabajo.
      </p>
      
      <div className="flex gap-4 justify-center mt-8">
        <Button
          onClick={() => setCurrentStep(2)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
        >
          <FolderPlus className="w-5 h-5 mr-2" />
          Crear tu primer proyecto
        </Button>
        <Button
          onClick={() => setCurrentStep(3)}
          variant="outline"
          className="px-8 py-3 text-lg"
        >
          <Users className="w-5 h-5 mr-2" />
          Invitar miembros
        </Button>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Crear nuevo proyecto</h2>
        <p className="text-gray-600 mt-2">Configura tu primer proyecto y equipo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="projectName" className="text-gray-900 font-medium">
            Nombre del proyecto <span className="text-red-500">*</span>
          </Label>
          <Input
            id="projectName"
            value={projectData.name}
            onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
            placeholder="Ej: Sistema de Ventas"
            disabled={loading}
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="teamName" className="text-gray-900 font-medium">
            Nombre del equipo <span className="text-red-500">*</span>
          </Label>
          <Input
            id="teamName"
            value={projectData.team_name}
            onChange={(e) => setProjectData({ ...projectData, team_name: e.target.value })}
            placeholder="Ej: Equipo Backend"
            disabled={loading}
            className="mt-1"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description" className="text-gray-900 font-medium">
          Descripción
        </Label>
        <Textarea
          id="description"
          value={projectData.description}
          onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
          placeholder="Describe brevemente el proyecto..."
          disabled={loading}
          className="mt-1"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="projectUrl" className="text-gray-900 font-medium">
          URL Proyecto
        </Label>
        <Input
          id="projectUrl"
          value={projectData.project_url}
          onChange={(e) => setProjectData({ ...projectData, project_url: e.target.value })}
          placeholder="https://miproyecto.com"
          disabled={loading}
          className="mt-1"
          type="url"
        />
      </div>

      <div>
        <Label htmlFor="gitRepo" className="text-gray-900 font-medium">
          Enlace repositorio
        </Label>
        <Input
          id="gitRepo"
          value={projectData.git_repository_url}
          onChange={(e) => setProjectData({ ...projectData, git_repository_url: e.target.value })}
          placeholder="https://github.com/usuario/repo"
          disabled={loading}
          className="mt-1"
          type="url"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          onClick={() => setCurrentStep(1)}
          variant="outline"
          disabled={loading}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleCreateProject}
          disabled={loading || !projectData.name.trim() || !projectData.team_name.trim()}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creando...
            </>
          ) : (
            'Continuar'
          )}
        </Button>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Asignar usuarios</h2>
        <p className="text-gray-600 mt-2">
          Invita miembros de tu equipo (opcional)
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <Label htmlFor="inviteEmail" className="text-gray-900 font-medium">
              Correo electrónico
            </Label>
            <Input
              id="inviteEmail"
              type="email"
              value={newInviteEmail}
              onChange={(e) => setNewInviteEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              disabled={loading}
              className="mt-1"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInvitation())}
            />
          </div>
          <div className="w-40">
            <Label htmlFor="inviteRole" className="text-gray-900 font-medium">
              Rol
            </Label>
            <select
              id="inviteRole"
              value={newInviteRole}
              onChange={(e) => setNewInviteRole(e.target.value as 'supervisor' | 'developer')}
              disabled={loading}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="developer">Developer</option>
              <option value="supervisor">Supervisor</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleAddInvitation}
              disabled={loading}
              variant="outline"
              className="px-4"
            >
              <Mail className="w-4 h-4 mr-2" />
              Agregar
            </Button>
          </div>
        </div>

        {invitations.length > 0 && (
          <div className="border border-gray-200 rounded-lg divide-y">
            {invitations.map((invitation, index) => (
              <div key={index} className="flex items-center justify-between p-3">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{invitation.email}</p>
                  <p className="text-sm text-gray-500 capitalize">{invitation.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  {invitation.status === 'sent' && (
                    <span className="text-xs text-green-600 font-medium">✓ Enviada</span>
                  )}
                  {invitation.status === 'error' && (
                    <span className="text-xs text-red-600 font-medium">✗ Error</span>
                  )}
                  {invitation.status === 'pending' && (
                    <Button
                      onClick={() => handleRemoveInvitation(invitation.email)}
                      variant="ghost"
                      size="sm"
                      disabled={loading}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          onClick={() => router.push('/admin/dashboard')}
          variant="outline"
          disabled={loading}
          className="flex-1"
        >
          Saltar este paso
        </Button>
        <Button
          onClick={handleSendInvitations}
          disabled={loading}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : invitations.length > 0 ? (
            `Invitar (${invitations.length})`
          ) : (
            'Ir al inicio'
          )}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 p-4">
      <Card className="max-w-4xl w-full p-8 shadow-xl">
        {renderStepIndicator()}
        
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </Card>
    </div>
  )
}
