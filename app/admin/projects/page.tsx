"use client"

import { useEffect, useState } from "react"
import { AppHeader } from "@/components/navigation/app-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Users, GitBranch, ExternalLink, Loader2 } from "lucide-react"
import { Github, Gitlab } from "lucide-react"
import { useAppSelector } from "@/lib/store/hooks"
import { managementService } from "@/lib/services/managementService"
import { toast } from "sonner"
import { translateApiError } from "@/lib/utils/error-translator"
import { validateRepositoryUrl, getRepositoryProvider, type RepositoryProvider } from "@/lib/utils/repository"

interface Team {
  id: string
  name: string
  description?: string
}

export default function ProjectsPage() {
  const { user } = useAppSelector((state) => state.auth)
  const [projects, setProjects] = useState<any[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    team_id: '',
    repository_url: '',
    url: '',
  })

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)

        // Fetch projects and teams in parallel
        const [userProjects, userTeams] = await Promise.all([
          managementService.getUserProjects(user?.id || ''),
          managementService.getAllTeams(),
        ])

        setProjects(userProjects?.results || [])
        setTeams(userTeams?.results || [])
      } catch (error: any) {
        console.error('Error fetching data:', error)
        const errorMessage = translateApiError(error)
        toast.error(errorMessage)
        setProjects([])
        setTeams([])
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  const handleCreateProject = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error('El nombre del proyecto es requerido')
      return
    }

    if (!formData.team_id) {
      toast.error('Debes seleccionar un equipo')
      return
    }

    // Validate repository URL if provided
    if (formData.repository_url) {
      const validation = validateRepositoryUrl(formData.repository_url)
      if (!validation.isValid) {
        toast.error(validation.error || 'URL de repositorio inválida')
        return
      }
    }

    setIsCreating(true)
    try {
      const newProject = await managementService.createProject({
        name: formData.name,
        description: formData.description || undefined,
        team_id: formData.team_id,
        repository_url: formData.repository_url || undefined,
        url: formData.url || undefined,
      })

      // Auto-add the admin user as owner
      try {
        await managementService.addProjectMember({
          project: newProject.id,
          user_id: user?.id || '',
          role: 'owner',
        })
      } catch (memberError) {
        console.error('Error adding admin as owner:', memberError)
        // Don't fail the whole operation if this fails
      }

      toast.success('¡Proyecto creado exitosamente!')

      // Add new project to list
      setProjects([newProject, ...projects])

      // Reset form and close dialog
      setFormData({
        name: '',
        description: '',
        team_id: '',
        repository_url: '',
        url: '',
      })
      setIsDialogOpen(false)
    } catch (error: any) {
      const errorMessage = translateApiError(error)
      toast.error(errorMessage)
      console.error('Error creating project:', error)
    } finally {
      setIsCreating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white">
        <AppHeader />
        <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white">
      <AppHeader />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Proyectos</h1>
            <p className="text-gray-600 mt-1">Gestiona tus proyectos y equipos</p>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Proyecto
          </Button>
        </div>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="p-6 border-2 border-purple-200 hover:border-purple-400 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{project.name}</h3>
                    {project.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                    )}
                  </div>
                  <Badge className="bg-brand text-brand-foreground">
                    {project.role || 'Member'}
                  </Badge>
                </div>

                {/* Project Info */}
                <div className="space-y-2 mb-4">
                  {project.team_name && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {project.team_name}
                    </div>
                  )}
                  {project.repository_url && (() => {
                    const provider = getRepositoryProvider(project.repository_url)
                    const ProviderIcon = provider === 'github' ? Github : provider === 'gitlab' ? Gitlab : GitBranch
                    return (
                      <div className="flex items-center text-sm text-gray-600">
                        <ProviderIcon className="w-4 h-4 mr-2" />
                        <a
                          href={project.repository_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-purple-600 truncate flex items-center gap-1"
                        >
                          {project.repository_url.split('/').slice(-2).join('/')}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )
                  })()}
                  {project.url && (
                    <div className="flex items-center text-sm text-gray-600">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-purple-600 truncate"
                      >
                        {project.url}
                      </a>
                    </div>
                  )}
                </div>

                {/* Members Count */}
                {project.member_count !== undefined && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      {project.member_count} {project.member_count === 1 ? 'miembro' : 'miembros'}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-purple-600 text-purple-600 hover:bg-purple-50"
                  >
                    Ver Detalles
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border-2 border-dashed border-gray-300">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GitBranch className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No tienes proyectos aún
              </h3>
              <p className="text-gray-600 mb-6">
                Crea tu primer proyecto para empezar a colaborar con tu equipo
              </p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Proyecto
              </Button>
            </div>
          </Card>
        )}
      </main>

      {/* Create Project Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
            <DialogDescription>
              Completa la información del proyecto. Los campos marcados con * son obligatorios.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">
                  Nombre del proyecto <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Sistema de Ventas"
                  disabled={isCreating}
                />
              </div>

              <div>
                <Label htmlFor="team">
                  Equipo <span className="text-red-500">*</span>
                </Label>
                <select
                  id="team"
                  value={formData.team_id}
                  onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
                  disabled={isCreating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Seleccionar equipo...</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe brevemente el proyecto..."
                disabled={isCreating}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="url">URL del Proyecto</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://miproyecto.com"
                disabled={isCreating}
              />
            </div>

            <div>
              <Label htmlFor="repository_url">URL del Repositorio (GitHub o GitLab)</Label>
              <Input
                id="repository_url"
                type="url"
                value={formData.repository_url}
                onChange={(e) => setFormData({ ...formData, repository_url: e.target.value })}
                placeholder="https://github.com/usuario/repo"
                disabled={isCreating}
              />
              <p className="text-xs text-gray-500 mt-1">Solo se permiten URLs de GitHub o GitLab</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={isCreating || !formData.name.trim() || !formData.team_id}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear Proyecto'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
