"use client"

import { useEffect, useState } from "react"
import { AppHeader } from "@/components/navigation/app-header"
import { Footer } from "@/components/footer"
import { ProfileCard } from "@/components/cards/profile-card"
import { ActivityCard } from "@/components/cards/activity-card"
import { useAppSelector } from "@/lib/store/hooks"
import { authService } from "@/lib/services/authService"
import { monitoringService } from "@/lib/services/monitoringService"
import { toast } from "sonner"

export default function AdminProfilePage() {
  const { user } = useAppSelector((state) => state.auth)
  const [profile, setProfile] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProfileData() {
      try {
        setIsLoading(true)

        // Obtener perfil del usuario
        const profileData = await authService.getProfile()

        // Obtener últimas sesiones como actividades
        const sessions = await monitoringService
          .getUserSessions(user?.id || '', { limit: 3 })
          .catch(() => [])

        // Mapear sesiones a formato de actividades
        const mappedActivities =
          sessions?.map((session: any, index: number) => ({
            id: session.session_id || `${index}`,
            title: `Sesión de desarrollo`,
            description: session.ide_name || 'IDE desconocido',
            date: new Date(session.session_start).toLocaleDateString('es-ES'),
            time: session.git_repository_url || 'Sin repositorio',
          })) || []

        setProfile({
          firstName: profileData.first_name || user?.first_name || '',
          lastName: profileData.last_name || user?.last_name || '',
          role: profileData.role || user?.role || 'Usuario',
          email: profileData.email || user?.email || '',
          phone: profileData.phone || '000-0000-000',
          identifier: user?.id || '000000000',
          company: profileData.company_name || user?.company_name || 'Sin empresa',
          gitHubUser: profileData.github_username || 'N/A',
          gitLabUser: profileData.gitlab_username || 'N/A',
          timezone: profileData.timezone || 'UTC-4',
          status: 'Activo',
          createdDate: new Date(profileData.created_at || Date.now()).toLocaleDateString('es-ES'),
          lastUpdated: new Date(profileData.updated_at || Date.now()).toLocaleDateString('es-ES'),
          profileImage: profileData.profile_image || '/professional-person.png',
        })

        setActivities(mappedActivities)
      } catch (error: any) {
        console.error('Error fetching profile:', error)
        toast.error('Error al cargar el perfil')

        // Fallback con datos del usuario de Redux
        setProfile({
          firstName: user?.first_name || 'Usuario',
          lastName: user?.last_name || '',
          role: user?.role || 'Usuario',
          email: user?.email || '',
          phone: '000-0000-000',
          identifier: user?.id || '000000000',
          company: user?.company_name || 'Sin empresa',
          gitHubUser: 'N/A',
          gitLabUser: 'N/A',
          timezone: 'UTC-4',
          status: 'Activo',
          createdDate: new Date().toLocaleDateString('es-ES'),
          lastUpdated: new Date().toLocaleDateString('es-ES'),
          profileImage: '/professional-person.png',
        })

        setActivities([])
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchProfileData()
    }
  }, [user])

  const handleEditProfile = () => {
    toast.info('Función de edición próximamente')
  }

  const handleViewMoreActivities = () => {
    toast.info('Ver más actividades próximamente')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <AppHeader />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <AppHeader />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600">No se pudo cargar el perfil</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bienvenido, {profile.firstName}</h1>
          <p className="text-gray-600 mt-1">{profile.role}</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card - Spans 2 columns on large screens */}
          <div className="lg:col-span-2">
            <ProfileCard
              firstName={profile.firstName}
              lastName={profile.lastName}
              role={profile.role}
              email={profile.email}
              phone={profile.phone}
              identifier={profile.identifier}
              company={profile.company}
              gitHubUser={profile.gitHubUser}
              gitLabUser={profile.gitLabUser}
              timezone={profile.timezone}
              status={profile.status}
              createdDate={profile.createdDate}
              lastUpdated={profile.lastUpdated}
              profileImage={profile.profileImage}
              onEdit={handleEditProfile}
              showEditButton={true}
            />
          </div>

          {/* Activity Card */}
          <ActivityCard activities={activities} onViewMore={handleViewMoreActivities} />
        </div>
      </main>

      <Footer />
    </div>
  )
}