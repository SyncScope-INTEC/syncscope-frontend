'use client'

import { useState, useEffect } from 'react'
import { useAppSelector } from '@/lib/store/hooks'
import { toast } from 'sonner'
import { AppHeader } from "@/components/navigation/app-header"
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Mail, FolderKanban, Loader2, X } from 'lucide-react'
import { authService } from '@/lib/services/authService'
import { getPlanLimit } from '@/lib/utils/planLimits'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('users')
  const { user } = useAppSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)

  // Data states
  const [users, setUsers] = useState<any[]>([])
  const [invitations, setInvitations] = useState<any[]>([])

  // Invite form states
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'developer' | 'supervisor'>('developer')

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true)
      const [usersData, invitationsData] = await Promise.all([
        authService.getSupervisedUsers(), // Using this as proxy for company users for now
        authService.getInvitations()
      ])

      // Transform supervised users to flat list if needed, depending on API response structure
      // Assuming headers getSupervisedUsers returns list of supervision objects
      const mappedUsers = usersData?.map((s: any) => s.supervisee) || []

      // Add current user if not in list
      if (user && !mappedUsers.find((u: any) => u.id === user.id)) {
        mappedUsers.unshift(user)
      }

      setUsers(mappedUsers)
      setInvitations(invitationsData || [])
    } catch (error) {
      console.error('Error fetching settings data:', error)
      toast.error('Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Limits Logic
  const planLimit = getPlanLimit(user?.plan || 'starter')
  const activeUsersCount = users.length
  const pendingInvitationsCount = invitations.filter((i: any) => !i.is_accepted && !i.is_expired).length
  const totalSpotsUsed = activeUsersCount + pendingInvitationsCount
  const remainingSpots = planLimit - totalSpotsUsed
  const canInvite = remainingSpots > 0

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inviteEmail.trim()) return
    if (!canInvite) {
      toast.error(`Has alcanzado el límite de usuarios para tu plan ${user?.plan || 'Starter'} `)
      return
    }

    try {
      setLoading(true)
      await authService.sendInvitation({
        invitee_email: inviteEmail,
        role: inviteRole
      })
      toast.success('Invitación enviada exitosamente')
      setInviteEmail('')
      fetchData() // Reload lists
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al enviar invitación')
    } finally {
      setLoading(false)
    }
  }

  const handleResendInvitation = async (id: string) => {
    try {
      await authService.resendInvitation(id)
      toast.success('Invitación reenviada')
    } catch (error) {
      toast.error('Error al reenviar')
    }
  }

  const handleCancelInvitation = async (id: string) => {
    try {
      await authService.cancelInvitation(id)
      toast.success('Invitación cancelada')
      fetchData()
    } catch (error) {
      toast.error('Error al cancelar')
    }
  }

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
            <p className="text-gray-600 mt-2">
              Gestiona usuarios, invitaciones y proyectos de tu empresa
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Usuarios</span>
              </TabsTrigger>
              <TabsTrigger value="invitations" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">Invitaciones</span>
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4" />
                <span className="hidden sm:inline">Proyectos</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Usuarios de la empresa</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Gestiona los miembros de tu equipo ({activeUsersCount} usuarios activos)
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={canInvite ? "secondary" : "destructive"}>
                      Plan {user?.plan || 'Starter'}: {totalSpotsUsed}/{planLimit === Infinity ? '∞' : planLimit} usuarios
                    </Badge>
                  </div>
                </div>

                <div className="rounded-md border">
                  {/* Simple Table equivalent */}
                  <div className="grid grid-cols-4 gap-4 p-4 font-medium bg-gray-50 border-b text-sm">
                    <span>Usuario</span>
                    <span>Rol</span>
                    <span>Estado</span>
                    <span>Fecha Unión</span>
                  </div>
                  {users.length > 0 ? (
                    <div className="divide-y">
                      {users.map((u, i) => (
                        <div key={u.id || i} className="grid grid-cols-4 gap-4 p-4 items-center text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                              {u.first_name?.[0] || u.email?.[0] || 'U'}
                            </div>
                            <div>
                              <p className="font-medium">{u.first_name} {u.last_name}</p>
                              <p className="text-xs text-gray-500">{u.email}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="w-fit capitalize">{u.role}</Badge>
                          <Badge className="w-fit bg-green-500">Activo</Badge>
                          <span className="text-gray-500">
                            {u.date_joined ? new Date(u.date_joined).toLocaleDateString() : '-'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">No hay usuarios encontrados</div>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="invitations" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Invite Form */}
                <Card className="p-6 md:col-span-1 h-fit">
                  <h2 className="text-lg font-semibold mb-4">Invitar Nuevo Usuario</h2>
                  <form onSubmit={handleInvite} className="space-y-4">
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="colaborador@ejemplo.com"
                        required
                      />
                    </div>
                    <div>
                      <Label>Rol</Label>
                      <select
                        className="w-full flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={inviteRole}
                        onChange={(e: any) => setInviteRole(e.target.value)}
                      >
                        <option value="developer">Developer</option>
                        <option value="supervisor">Supervisor</option>
                      </select>
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        disabled={loading || !canInvite}
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
                        Enviar Invitación
                      </Button>
                      {!canInvite && (
                        <p className="text-xs text-red-500 mt-2 text-center">Límite de plan alcanzado</p>
                      )}
                    </div>
                  </form>
                </Card>

                {/* Invitations List */}
                <Card className="p-6 md:col-span-2">
                  <h2 className="text-lg font-semibold mb-4">Invitaciones Enviadas</h2>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-4 gap-4 p-4 font-medium bg-gray-50 border-b text-sm">
                      <span className="col-span-2">Email</span>
                      <span>Rol</span>
                      <span>Acciones</span>
                    </div>
                    {invitations.length > 0 ? (
                      <div className="divide-y">
                        {invitations.map((inv) => (
                          <div key={inv.id} className="grid grid-cols-4 gap-4 p-4 items-center text-sm">
                            <div className="col-span-2">
                              <p className="font-medium">{inv.invitee_email}</p>
                              <p className="text-xs text-gray-500">
                                Expira: {new Date(inv.expires_at).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="outline" className="w-fit capitalize">{inv.role}</Badge>
                            <div className="flex gap-2">
                              {/* Validar si backend soporta resend/cancel, si no, ocultar */}
                              <Button variant="ghost" size="sm" onClick={() => handleCancelInvitation(inv.id)} title="Cancelar">
                                <X className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500">No hay invitaciones pendientes</div>
                    )}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Proyectos</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Gestiona los proyectos de tu empresa
                    </p>
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <FolderKanban className="w-4 h-4 mr-2" />
                    Crear proyecto
                  </Button>
                </div>

                <div className="text-center py-12 text-gray-500">
                  <FolderKanban className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Lista de proyectos próximamente...</p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  )
}
