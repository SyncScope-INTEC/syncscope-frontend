"use client"

import { useState, useEffect } from "react"
import { AppHeader } from "@/components/navigation/app-header"
import { Footer } from "@/components/footer"
import { DashboardFilters } from "@/components/filters/dashboard-filters"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { TeamMembersTable } from "@/components/tables/team-members-table"
import Image from "next/image"
import { useAppSelector } from "@/lib/store/hooks"
import { authService } from "@/lib/services/authService"
import { analyticsService } from "@/lib/services/analyticsService"
import { monitoringService } from "@/lib/services/monitoringService"
import { managementService } from "@/lib/services/managementService"
import { toast } from "sonner"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { CardSkeleton } from "@/components/skeletons/card-skeleton"
import { ProjectSelector } from "@/components/selectors/project-selector"
import { useDashboardMetrics } from "@/lib/hooks/useDashboardMetrics"
import { formatDuration } from "@/lib/utils/metrics"
import { calculateProjectProgress, getCurrentPhase } from "@/lib/utils/projectProgress"

export default function ReportsPage() {
  const { user } = useAppSelector((state) => state.auth)
  const [profile, setProfile] = useState<any>(null)
  const [profileData, setProfileData] = useState<any>(null)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [sessionStats, setSessionStats] = useState<any>(null)
  const [team, setTeam] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [projects, setProjects] = useState<any[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [loadingTeamMembers, setLoadingTeamMembers] = useState(false)

  // Fetch real metrics for selected project
  const metrics = useDashboardMetrics(selectedProjectId)

  // Calculate project progress and phase using shared utility
  const projectProgress = calculateProjectProgress(metrics)
  const currentPhase = getCurrentPhase(projectProgress)


  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)

        // Obtener datos en paralelo
        const [profileDataResponse, dashboard, stats, supervisedUsers, userProjects] = await Promise.all([
          authService.getProfile().catch(() => null),
          analyticsService.getDashboard().catch(() => null),
          monitoringService.getUserSessionStats(user?.id || '').catch(() => null),
          authService.getSupervisedUsers().catch(() => []),
          managementService.getUserProjects(user?.id || '').catch(() => ({ results: [] })),
        ])

        setProfileData(profileDataResponse)

        setProfile({
          firstName: profileDataResponse?.first_name || user?.first_name || 'Usuario',
          lastName: profileDataResponse?.last_name || user?.last_name || '',
          role: profileDataResponse?.role || user?.role || 'Usuario',
          email: profileDataResponse?.email || user?.email || '',
          phone: profileDataResponse?.phone_number || profileDataResponse?.phone || '',
          identifier: user?.id || '000000000',
          company: profileDataResponse?.company?.name || user?.company?.name || user?.company_name || 'Sin empresa',
          profileImage: profileDataResponse?.profile_image_path || profileDataResponse?.profile_image || '/professional-woman-smiling.png',
        })

        setDashboardData(dashboard)
        setSessionStats(stats)
        const projectsList = userProjects?.results || []
        setProjects(projectsList)
        
        // Auto-select first project if available
        if (projectsList.length > 0 && !selectedProjectId) {
          setSelectedProjectId(projectsList[0].id)
        }

        // Mapear usuarios supervisados a formato de equipo
        // FILTRAR por empresa del usuario actual (temporal hasta que backend lo haga)
        const filteredSupervision = supervisedUsers?.filter(
          (supervision: any) =>
            supervision.supervisee?.company?.id === profileDataResponse?.company?.id ||
            supervision.supervisee?.company?.id === user?.company?.id
        ) || []

        const teamData = filteredSupervision.map((supervision: any) => {
          const lastLogin = supervision.supervisee?.last_login
          const isToday = lastLogin && new Date(lastLogin).toDateString() === new Date().toDateString()
          const role = supervision.supervisee?.role || 'developer'

          return {
            id: supervision.supervisee?.id || supervision.id,
            name: `${supervision.supervisee?.first_name || 'Usuario'} ${supervision.supervisee?.last_name || ''}`,
            role: role.charAt(0).toUpperCase() + role.slice(1),
            lastActivity: isToday
              ? 'Activo'
              : lastLogin
                ? new Date(lastLogin).toLocaleString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })
                : 'Sin actividad',
          }
        })

        // Agregar el usuario actual al equipo
        const currentUserRole = profileDataResponse?.role || user?.role || 'developer'
        setTeam([
          {
            id: user?.id || '0',
            name: profileDataResponse?.first_name || 'Usuario',
            role: currentUserRole.charAt(0).toUpperCase() + currentUserRole.slice(1),
            lastActivity: 'Activo', // Usuario actual siempre activo
          },
          ...teamData,
        ])
      } catch (error: any) {
        console.error('Error fetching data:', error)
        toast.error('Error al cargar los datos')

        // Fallback data
        setProfile({
          firstName: user?.first_name || 'Usuario',
          lastName: user?.last_name || '',
          role: user?.role || 'Usuario',
          email: user?.email || '',
          phone: '',
          identifier: user?.id || '000000000',
          company: user?.company_name || 'Sin empresa',
          profileImage: '/professional-woman-smiling.png',
        })
        setTeam([])
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  // Fetch team members when selected project changes
  useEffect(() => {
    async function fetchTeamMembers() {
      if (!selectedProjectId) {
        setTeamMembers([])
        return
      }

      try {
        setLoadingTeamMembers(true)
        const members = await managementService.getAllTeamMembers({ 
          project: selectedProjectId 
        })
        setTeamMembers(members?.results || [])
      } catch (error) {
        console.error('Error fetching team members:', error)
        setTeamMembers([])
      } finally {
        setLoadingTeamMembers(false)
      }
    }

    fetchTeamMembers()
  }, [selectedProjectId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white">
        <AppHeader />
        <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
          <div className="mb-8">
            <div className="h-9 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <CardSkeleton variant="tall" />
            <CardSkeleton variant="tall" />
            <CardSkeleton variant="tall" />
          </div>

          <div className="mb-12">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
            <TableSkeleton rows={5} columns={3} />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white">
      <AppHeader />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bienvenid@, {profile?.firstName || 'Usuario'}
          </h1>
          <p className="text-gray-600 mt-1">
            {profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'Usuario'}
          </p>
        </div>

        {/* Filters */}
        <DashboardFilters className="mb-8" onFilterChange={(filters) => {
          console.log('Filtros aplicados:', filters)
          // TODO: Filtrar datos según filtros seleccionados
        }} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* User Profile Card */}
          <Card className="p-6 border border-purple-200">
            <div className="flex gap-4">
              {/* Profile Image */}
              <div className="w-24 h-32 bg-gray-300 rounded-lg flex-shrink-0 overflow-hidden relative">
                {profile?.profileImage ? (
                  <Image
                    src={profile.profileImage}
                    alt={profile.firstName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold">
                    {profile?.firstName?.charAt(0) || 'U'}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 space-y-2 text-sm">
                <h2 className="font-semibold text-gray-900 text-base">
                  {profile?.firstName} {profile?.lastName}
                </h2>
                <div>
                  <p className="text-xs text-gray-500">Compañía</p>
                  <p className="text-gray-900 font-semibold">{profile?.company}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Correo electrónico</p>
                  <p className="text-gray-900 font-semibold">{profile?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Número telefónico</p>
                  <p className="text-gray-900 font-semibold">{profile?.phone}</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Nombre: {profile?.firstName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Apellido: {profile?.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Usuario GitHub: {profile?.firstName ? (profileData?.github_username || 'No configurado') : 'No configurado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Usuario GitLab: {profile?.firstName ? (profileData?.gitlab_username || 'No configurado') : 'No configurado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Zona horaria: {profile?.firstName ? (profileData?.timezone || 'No configurado') : 'No configurado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estado: Activo</span>
              </div>
            </div>
          </Card>

          {/* Project Card */}
          <Card className="p-6 border border-yellow-200">
            <div className="flex gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded"></div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {projects.length > 0 ? projects[0].name : 'Sin proyecto'}
                </h3>
                <p className="text-xs text-gray-500">
                  {projects.length > 0 && projects[0].created_at
                    ? new Date(projects[0].created_at).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })
                    : new Date().toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })
                  }
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Progreso del proyecto</h4>
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="2"
                      strokeDasharray={`${projectProgress}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-purple-600">
                      {projectProgress}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badges with Progress Indicators */}
              <div className="space-y-2">
                {['Inicio', 'Planificación', 'Diseño', 'Construcción'].map((status, index) => {
                  const isCompleted = index < currentPhase
                  const isCurrent = index === currentPhase
                  
                  return (
                    <div key={status} className="flex items-center gap-2">
                      <Badge 
                        variant={isCurrent ? "default" : "outline"} 
                        className={`text-xs ${
                          isCompleted ? 'bg-green-100 text-green-700 border-green-300' : 
                          isCurrent ? 'bg-purple-600 text-white' : 
                          'text-gray-400 border-gray-200'
                        }`}
                      >
                        {status}
                      </Badge>
                      {isCompleted && (
                        <span className="text-xs text-green-600">✓ Completado</span>
                      )}
                      {isCurrent && (
                        <span className="text-xs text-purple-600">● En progreso</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>

          {/* Stats Card */}
          <Card className="p-6 border border-yellow-200 space-y-4">
            <div>
              <div className="text-2xl font-bold text-green-400">
                {sessionStats?.avg_session_duration_minutes
                  ? `${Math.floor(sessionStats.avg_session_duration_minutes / 60)}h ${Math.floor(sessionStats.avg_session_duration_minutes % 60)}m`
                  : '7h 43m'}
              </div>
              <p className="text-xs text-gray-500">Tiempo promedio de actividad</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {sessionStats?.active_sessions || 0} proyectos
              </div>
              <p className="text-xs text-gray-500">En progreso</p>
            </div>
            {sessionStats?.total_sessions !== undefined && (
              <div>
                <div className="text-2xl font-bold text-blue-600">{sessionStats.total_sessions}</div>
                <p className="text-xs text-gray-500">Total de sesiones</p>
              </div>
            )}
          </Card>
        </div>

        {/* Team Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Equipo de trabajo</h2>
            <div className="w-64">
              <ProjectSelector
                projects={projects}
                selectedProjectId={selectedProjectId}
                onSelectProject={setSelectedProjectId}
              />
            </div>
          </div>
          <TeamMembersTable 
            members={teamMembers.map(member => ({
              id: member.id,
              name: member.user_name,
              role: member.role,
              lastActivity: 'Activo',
            }))} 
            isLoading={loadingTeamMembers} 
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}