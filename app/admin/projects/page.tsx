"use client"

import { useEffect, useState } from "react"
import { AppHeader } from "@/components/navigation/app-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, GitBranch, ExternalLink } from "lucide-react"
import { useAppSelector } from "@/lib/store/hooks"
import { managementService } from "@/lib/services/managementService"
import { toast } from "sonner"

export default function ProjectsPage() {
  const { user } = useAppSelector((state) => state.auth)
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        setIsLoading(true)

        // Obtener proyectos del usuario
        const userProjects = await managementService.getUserProjects(user?.id || '')
        setProjects(userProjects || [])
      } catch (error: any) {
        console.error('Error fetching projects:', error)
        toast.error('Error al cargar proyectos')
        setProjects([])
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchProjects()
    }
  }, [user])

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
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
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
                  {project.repository_url && (
                    <div className="flex items-center text-sm text-gray-600">
                      <GitBranch className="w-4 h-4 mr-2" />
                      <a
                        href={project.repository_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-purple-600 truncate"
                      >
                        {project.repository_url.split('/').slice(-2).join('/')}
                      </a>
                    </div>
                  )}
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
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Crear Proyecto
              </Button>
            </div>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  )
}
