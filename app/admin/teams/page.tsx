"use client"

import { useEffect, useState } from "react"
import { AppHeader } from "@/components/navigation/app-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Settings } from "lucide-react"
import { useAppSelector } from "@/lib/store/hooks"
import { managementService } from "@/lib/services/managementService"
import { toast } from "sonner"

export default function TeamsPage() {
  const { user } = useAppSelector((state) => state.auth)
  const [teams, setTeams] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchTeams() {
      try {
        setIsLoading(true)

        // Obtener equipos de la empresa
        const teamsData = await managementService.getAllTeams()

        // Filtrar por empresa del usuario (temporal hasta que backend lo haga)
        const filteredTeams = teamsData?.results?.filter(
          (team: any) => team.company === user?.company?.id
        ) || []

        setTeams(filteredTeams)
      } catch (error: any) {
        console.error('Error fetching teams:', error)
        toast.error('Error al cargar equipos')
        setTeams([])
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchTeams()
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
            <h1 className="text-3xl font-bold text-gray-900">Equipos</h1>
            <p className="text-gray-600 mt-1">Gestiona los equipos de tu empresa</p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Equipo
          </Button>
        </div>

        {/* Teams Grid */}
        {teams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <Card key={team.id} className="p-6 border-2 border-purple-200 hover:border-purple-400 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{team.name}</h3>
                    {team.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{team.description}</p>
                    )}
                  </div>
                </div>

                {/* Team Stats */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Miembros
                    </span>
                    <Badge variant="outline" className="text-purple-600 border-purple-600">
                      {team.member_count || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      Proyectos
                    </span>
                    <Badge variant="outline" className="text-brand-dark border-brand-dark">
                      {team.project_count || 0}
                    </Badge>
                  </div>
                </div>

                {/* Created Date */}
                {team.created_at && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Creado: {new Date(team.created_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
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
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay equipos aún
              </h3>
              <p className="text-gray-600 mb-6">
                Crea tu primer equipo para organizar a los miembros de tu empresa
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Crear Equipo
              </Button>
            </div>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  )
}
