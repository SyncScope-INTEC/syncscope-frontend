"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { AppHeader } from "@/components/navigation/app-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EditProfileModal } from "@/components/modals/edit-profile-modal"
import { useAppSelector } from "@/lib/store/hooks"
import { authService } from "@/lib/services/authService"
import { monitoringService } from "@/lib/services/monitoringService"
import { toast } from "sonner"

export default function AdminProfilePage() {
  const { user } = useAppSelector((state) => state.auth)
  const [profile, setProfile] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    async function fetchProfileData() {
      try {
        setIsLoading(true)

        // Obtener perfil del usuario desde el backend
        const profileData = await authService.getProfile()

        // Construir URL completa de imagen de perfil
        let profileImageUrl = ''
        if (profileData.profile_image_path) {
          // Construir URL completa con el base URL del API
          const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:8000'
          profileImageUrl = `${AUTH_API_URL}/media/${profileData.profile_image_path}`
        }

        if (user?.id) {
          try {
            const imageData = await authService.getUserImage(user.id)
            if (imageData?.url) {
              profileImageUrl = imageData.url
            }
          } catch (_imgError) {
            console.log('No profile image found, using default')
          }
        }

        // Obtener últimas sesiones como actividades
        const sessions = await monitoringService
          .getUserSessions(user?.id || '', { limit: 5 })
          .catch(() => [])

        // Mapear sesiones a formato de actividades
        const mappedActivities =
          sessions?.map((session: any, index: number) => ({
            id: session.session_id || `${index}`,
            title: session.git_repository_url?.split('/').pop() || 'Sesión de desarrollo',
            assignee: `${profileData.first_name} ${profileData.last_name}`,
            date: new Date(session.session_start).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            }),
          })) || []

        setProfile({
          firstName: profileData.first_name || 'Usuario',
          lastName: profileData.last_name || '',
          role: profileData.role || 'Usuario',
          email: profileData.email || '',
          phone: profileData.phone || '',
          identifier: profileData.id || '000000000',
          company: profileData.company?.name || profileData.company_name || 'Sin empresa',
          gitHubUser: profileData.github_username || 'No configurado',
          gitLabUser: profileData.gitlab_username || 'No configurado',
          timezone: profileData.timezone || 'UTC-4',
          status: profileData.is_active ? 'Activo' : 'Inactivo',
          createdDate: '',
          lastUpdated: '',
          profileImage: profileImageUrl,
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
          profileImage: '',
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

  const handleSaveProfile = async (data: { email: string; phone: string; timezone: string; image?: File }) => {
    try {
      // Actualizar perfil en el backend
      await authService.updateProfile({
        timezone: data.timezone,
        // Note: email y phone no están en el endpoint de updateProfile según la API
        // Solo se puede actualizar first_name, last_name, timezone
      })

      // Si hay imagen, subirla
      if (data.image && user?.id) {
        await authService.uploadUserImage(user.id, data.image)
        toast.success('Imagen de perfil actualizada')
      }

      setProfile({ ...profile, ...data })
      toast.success('Perfil actualizado exitosamente')

      // Recargar perfil para obtener nueva imagen con cache busting
      const updatedProfile = await authService.getProfile()
      setProfile((prev: any) => ({
        ...prev,
        profileImage: updatedProfile.profile_image_path ? `${updatedProfile.profile_image_path}?t=${Date.now()}` : '',
        timezone: updatedProfile.timezone,
      }))
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast.error('Error al actualizar el perfil')
    }
  }

  const handleViewMoreActivities = () => {
    toast.info('Ver más actividades próximamente')
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

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white">
        <AppHeader />
        <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
          <p className="text-center text-gray-600">No se encontró información del perfil</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white">
      <AppHeader />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        {/* Removed header section to save space */}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card - Spans 2 columns on large screens */}
          <Card className="lg:col-span-2 p-6 border-2 border-purple-200">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Image - Larger */}
              <div className="flex-shrink-0">
                <div className="relative w-48 h-56 rounded-lg overflow-hidden border-2 border-purple-200 bg-gray-200">
                  {profile.profileImage ? (
                    <Image
                      src={profile.profileImage}
                      alt={`${profile.firstName} ${profile.lastName}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  ) : null}
                  {!profile.profileImage && (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-24 h-24 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-6">
                {/* Top Section - Company, Email, Phone */}
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-500">Compañía</p>
                    <p className="text-gray-900 font-semibold">{profile.company}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Correo electrónico</p>
                    <p className="text-gray-900 font-semibold">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Número telefónico</p>
                    <p className="text-gray-900 font-semibold">{profile.phone || 'No configurado'}</p>
                  </div>
                </div>

                {/* Bottom Section - Personal Info Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-gray-500">Nombre</p>
                    <p className="text-gray-900 font-semibold">{profile.firstName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Apellido</p>
                    <p className="text-gray-900 font-semibold">{profile.lastName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Usuario GitHub</p>
                    <p className="text-gray-900 font-semibold">{profile.gitHubUser}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Usuario GitLab</p>
                    <p className="text-gray-900 font-semibold">{profile.gitLabUser}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Zona horaria</p>
                    <p className="text-gray-900 font-semibold">{profile.timezone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Estado</p>
                    <p className="text-gray-900 font-semibold">{profile.status}</p>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={() => setShowEditModal(true)}
                    variant="outline"
                    className="border-purple-600 text-purple-600 hover:bg-purple-50"
                  >
                    Editar
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Activity Card */}
          <Card className="p-6 border-2 border-yellow-300 bg-yellow-50/50 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Próximas actividades</h3>

            {activities.length > 0 ? (
              <div className="space-y-3 flex-1">
                {activities.map((activity) => (
                  <div key={activity.id} className="text-sm">
                    <p className="font-semibold text-gray-900">{activity.title}</p>
                    <p className="text-gray-600">{activity.assignee}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 flex-1">No hay actividades recientes</p>
            )}

            {/* Ver más button - stays at bottom */}
            <div className="pt-6 mt-auto">
              <Button
                onClick={handleViewMoreActivities}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full"
              >
                Ver más
              </Button>
            </div>
          </Card>
        </div>
      </main>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        profile={{
          email: profile.email,
          phone: profile.phone,
          timezone: profile.timezone,
        }}
        onSave={handleSaveProfile}
      />

      <Footer />
    </div>
  )
}