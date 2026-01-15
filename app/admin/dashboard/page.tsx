"use client"

import { useEffect, useState } from "react"
import { AppHeader } from "@/components/navigation/app-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, ExternalLink, Github } from "lucide-react"
import Image from "next/image"
import { useAppSelector } from "@/lib/store/hooks"
import { analyticsService } from "@/lib/services/analyticsService"
import { monitoringService } from "@/lib/services/monitoringService"
import { authService } from "@/lib/services/authService"
import { managementService } from "@/lib/services/managementService"
import { useRouter } from "next/navigation"
import { isDevMode, getCurrentYears } from "@/lib/utils/devMode"
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton"
import { ProjectSelector } from "@/components/selectors/project-selector"
import { useDashboardMetrics } from "@/lib/hooks/useDashboardMetrics"
import { formatDuration } from "@/lib/utils/metrics"
import { MetricCards } from "@/components/dashboard/metric-cards"
import { calculateProjectProgress } from "@/lib/utils/projectProgress"

export default function AdminDashboard() {
  const router = useRouter()
  const { user } = useAppSelector((state) => state.auth)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [sessionStats, setSessionStats] = useState<any>(null)
  const [recentSessions, setRecentSessions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [employees, setEmployees] = useState<any[]>([]) 
  const [projects, setProjects] = useState<any[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [loadingTeamMembers, setLoadingTeamMembers] = useState(false)

  // Fetch real metrics for selected project

  const metrics = useDashboardMetrics(selectedProjectId)

  // Calculate project progress using shared utility
  const projectProgress = calculateProjectProgress(metrics)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true)

        const [dashboard, stats, sessions, supervisedUsers, userProjects] = await Promise.all([
          analyticsService.getDashboard().catch(() => null),
          monitoringService.getUserSessionStats(user?.id || '').catch(() => null),
          monitoringService.getUserSessions(user?.id || '', { limit: 3 }).catch(() => []),
          authService.getSupervisedUsers().catch(() => []),
          managementService.getUserProjects(user?.id || '').catch(() => ({ results: [] })), // Added this line
        ])

        setDashboardData(dashboard)
        setSessionStats(stats)
        setRecentSessions(sessions || [])
        // Handle projects response structure
        const projectsList = userProjects?.results || []
        setProjects(projectsList)
        
        // Auto-select first project if available
        if (projectsList.length > 0 && !selectedProjectId) {
          setSelectedProjectId(projectsList[0].id)
        }

        // Mapear usuarios supervisados a formato de empleados
        // FILTRAR por empresa del usuario actual (temporal hasta que backend lo haga)
        const filteredSupervision = supervisedUsers?.filter(
          (supervision: any) =>
            supervision.supervisee?.company?.id === user?.company?.id
        ) || []

        const employeesData = filteredSupervision.map((supervision: any) => ({
          name: `${supervision.supervisee?.first_name || 'Usuario'} ${supervision.supervisee?.last_name || ''}`,
          role: supervision.supervisee?.role || 'Developer',
          status: supervision.supervisee?.is_active ? 'Activo' : 'Inactivo',
          color: supervision.supervisee?.is_active ? 'text-purple-500' : 'text-gray-400',
          isCurrentUser: false,
        }))

        // Agregar el usuario actual al inicio
        const currentUserEmployee = {
          name: `${user?.first_name || 'Usuario'} ${user?.last_name || ''}`,
          role: user?.role || 'Project Manager',
          status: 'Activo',
          color: 'text-purple-500',
          isCurrentUser: true,
        }

        setEmployees([currentUserEmployee, ...employeesData])
      } catch (error: any) {
        console.error('Error fetching dashboard:', error)
        // Fallback a datos mock si falla
        setEmployees([
          {
            name: `${user?.first_name || 'Usuario'} ${user?.last_name || ''}`,
            role: user?.role || 'Project Manager',
            status: 'Activo',
            color: 'text-purple-500',
            isCurrentUser: true,
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchDashboardData()
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



  const updates = recentSessions.length > 0
    ? recentSessions.map((session: any) => ({
      text: "Sesión de desarrollo",
      author: `${user?.first_name || 'Usuario'} ${user?.last_name || ''}`,
      time: new Date(session.session_start).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
      timeDetail: new Date(session.session_start).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    }))
    : []

  return (
    <>
      <AppHeader />
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-white">
        <main className="flex-1 container mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              {user?.company_name || user?.company?.name || 'Mi Empresa'}
            </h1>
            <div className="flex items-center gap-4">
              <Image
                src="/Gitlab.png"
                alt="GitLab"
                width={32}
                height={32}
                className="cursor-pointer"
              />
              <Github className="w-8 h-8 text-gray-900 cursor-pointer" />
            </div>
          </div>

          {isLoading ? (
            <DashboardSkeleton />
          ) : (
            <>
              {/* Metrics Cards */}
              <div className="mb-8">
                <MetricCards metrics={metrics} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="border-2 border-brand-light">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Team Members
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0 hover:bg-transparent"
                    onClick={() => router.push('/admin/reports')}
                  >
                    <ExternalLink className="w-4 h-4 text-purple-500" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Project Selector */}
                <ProjectSelector
                  projects={projects}
                  selectedProjectId={selectedProjectId}
                  onSelectProject={setSelectedProjectId}
                />

                {/* Team Members List */}
                {loadingTeamMembers ? (
                  <div className="text-sm text-gray-500 text-center py-4">Cargando...</div>
                ) : teamMembers.length > 0 ? (
                  teamMembers.map((member, index) => (
                    <div key={member.id || index} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {member.user_name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{member.user_name}</p>
                        <p className="text-xs text-gray-600">{member.role}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs text-purple-500">
                        {member.team_name}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    {selectedProjectId ? 'No hay miembros en este proyecto' : 'Selecciona un proyecto'}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Status and Projects */}
            <div className="space-y-6">
              {/* Current Status */}
              <Card className="border-2 border-purple-200">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Estado actual</h3>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#8b5cf6"
                          strokeWidth="3"
                          strokeDasharray={`${projectProgress}, 100`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-gray-900">
                          {projectProgress}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-600">
                    {projects.length > 0 ? projects[0].name : 'Sin proyectos'}
                  </p>
                </CardContent>
              </Card>

              {/* Performance Card */}
              <Card className="bg-purple-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">
                        {sessionStats?.active_sessions || 0}
                      </div>
                      <div className="text-sm opacity-90">
                        {sessionStats?.active_sessions
                          ? 'Sesiones activas'
                          : 'Más rendimiento esta semana'}
                      </div>
                    </div>
                    <Clock className="w-8 h-8 opacity-75" />
                  </div>
                </CardContent>
              </Card>

              {/* Projects */}
              <Card className="border-2 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Proyectos
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 p-0 hover:bg-transparent"
                      onClick={() => router.push('/admin/reports')}
                    >
                      <ExternalLink className="w-4 h-4 text-purple-500" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {projects.length > 0 ? (
                    projects.map((project, index) => (
                      <div key={project.id} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded ${
                          index === 0 ? 'bg-gradient-to-br from-purple-400 to-blue-500' :
                          index === 1 ? 'bg-gradient-to-br from-purple-600 to-indigo-600' :
                          'bg-gradient-to-br from-indigo-500 to-purple-500'
                        }`}></div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {project.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {project.created_at 
                              ? new Date(project.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
                              : new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
                            }
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No hay proyectos asignados
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Activity Section */}
            <Card className="border-2 border-brand-light">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Actividad</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-brand-dark border-brand-dark bg-transparent"
                  onClick={() => router.push('/admin/alerts-history')}
                >
                  Ver más
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Year Selector */}
                <div className="flex gap-2">
                  {getCurrentYears().map((year) => (
                    <Badge key={year} variant="secondary" className="text-xs">
                      {year}
                    </Badge>
                  ))}
                </div>

                {/* Month Headers */}
                <div className="grid grid-cols-6 gap-1 text-xs text-gray-600 mb-2">
                  <span>Nov</span>
                  <span>Dec</span>
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                </div>

                {/* Activity Grid */}
                <div className="grid grid-cols-6 gap-1">
                  {Array.from({ length: 42 }, (_, i) => {
                    const colors = [
                      "bg-gray-100",
                      "bg-pink-200",
                      "bg-blue-300",
                      "bg-blue-500",
                      "bg-cyan-300",
                      "bg-blue-600",
                    ]
                    const randomColor = colors[Math.floor(Math.random() * colors.length)]
                    return <div key={i} className={`w-3 h-3 rounded-sm ${randomColor}`}></div>
                  })}
                </div>

                <div className="flex justify-between text-xs text-gray-600">
                  <span>Contribuciones</span>
                  <span>Menos</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-100 rounded-sm"></div>
                    <div className="w-2 h-2 bg-pink-200 rounded-sm"></div>
                    <div className="w-2 h-2 bg-blue-300 rounded-sm"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-sm"></div>
                  </div>
                  <span>Más</span>
                </div>

                {/* Recent Updates */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Última actualización</h4>
                  <div className="space-y-2">
                    {updates.map((update, index) => (
                      <div key={index} className="flex justify-between items-start text-xs">
                        <div>
                          <p className="text-gray-900">{update.text}</p>
                          <p className="text-gray-600">{update.author}</p>
                        </div>
                        <div className="text-right text-gray-600">
                          <p>{update.time}</p>
                          <p>{update.timeDetail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Stats */}
                <div className="flex gap-2 flex-wrap">
                  <Badge className="bg-brand text-brand-foreground text-xs">
                    {sessionStats?.avg_session_duration_minutes
                      ? `${Math.floor(sessionStats.avg_session_duration_minutes / 60)}h ${Math.floor(sessionStats.avg_session_duration_minutes % 60)}m`
                      : '7h 43m'}{' '}
                    Tiempo promedio de actividad
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-700 text-xs">
                    {sessionStats?.active_sessions || 3} proyectos En progreso
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
              </>
          )}
        </main>
      </div>
    </>
  )
}