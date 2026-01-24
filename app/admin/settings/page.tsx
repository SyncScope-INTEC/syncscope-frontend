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
import { Users, Mail, FolderKanban, Loader2, X, Plus, GitBranch, ExternalLink } from 'lucide-react'
import { Github, Gitlab } from 'lucide-react'
import { authService } from '@/lib/services/authService'
import { managementService } from '@/lib/services/managementService'
import { getPlanLimit } from '@/lib/utils/planLimits'
import { translateApiError } from '@/lib/utils/error-translator'
import { validateRepositoryUrl, getRepositoryProvider } from '@/lib/utils/repository'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

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

  // Projects state
  const [projects, setProjects] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    team_id: '',
    repository_url: '',
    url: '',
  })

  // Member management state
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false)
  const [membersTab, setMembersTab] = useState('members')
  const [projectMembers, setProjectMembers] = useState<any[]>([])
  const [projectInvitations, setProjectInvitations] = useState<any[]>([])
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [invitationRole, setInvitationRole] = useState<'developer' | 'supervisor'>('developer')
  const [isInviting, setIsInviting] = useState(false)

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true)
      const [usersData, invitationsData, projectsData, teamsData] = await Promise.all([
        authService.getSupervisedUsers(),
        authService.getInvitations(),
        managementService.getAllProjects({ company: user?.company?.id }),
        managementService.getAllTeams(),
      ])

      const mappedUsers = (usersData?.map((s: any) => s.supervisee) || []).filter(Boolean)
      if (user && !mappedUsers.find((u: any) => u.id === user.id)) {
        mappedUsers.unshift(user)
      }

      setUsers(mappedUsers)
      setInvitations(invitationsData || [])
      setProjects(projectsData?.results || [])
      setTeams(teamsData?.results || [])
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

  const handleCreateProject = async () => {
    if (!formData.name.trim()) {
      toast.error('El nombre del proyecto es requerido')
      return
    }

    if (!formData.team_id) {
      toast.error('Debes seleccionar un equipo')
      return
    }

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

      try {
        await managementService.addProjectMember({
          project: newProject.id,
          user_id: user?.id || '',
          role: 'owner',
        })
      } catch (memberError) {
        console.error('Error adding admin as owner:', memberError)
      }

      toast.success('¡Proyecto creado exitosamente!')
      setProjects([newProject, ...projects])
      setIsDialogOpen(false)
      setFormData({ name: '', description: '', team_id: '', repository_url: '', url: '' })
    } catch (error: any) {
      const errorMessage = translateApiError(error)
      toast.error(errorMessage)
    } finally {
      setIsCreating(false)
    }
  }

  // Member Management Functions
  const handleOpenMembersDialog = async (project: any) => {
    setSelectedProject(project)
    setIsMembersDialogOpen(true)
    setMembersTab('members')
    await fetchProjectMembers(project.id)
    await fetchProjectInvitations(project.id)
  }

  const fetchProjectMembers = async (projectId: string) => {
    try {
      const response = await managementService.getAllProjectMembers({ page: 1 })
      // Filter members for this specific project
      const members = response.results?.filter((m: any) => m.project === projectId) || []
      setProjectMembers(members)
    } catch (error) {
      console.error('Error fetching project members:', error)
      toast.error('Error al cargar miembros')
    }
  }

  const fetchProjectInvitations = async (projectId: string) => {
    try {
      const invitations = await managementService.getProjectInvitations({ project: projectId })
      setProjectInvitations(invitations || [])
    } catch (error) {
      console.error('Error fetching invitations:', error)
      toast.error('Error al cargar invitaciones')
    }
  }

  const handleToggleUserSelection = (userId: string) => {
    const newSelection = new Set(selectedUsers)
    if (newSelection.has(userId)) {
      newSelection.delete(userId)
    } else {
      newSelection.add(userId)
    }
    setSelectedUsers(newSelection)
  }

  const handleInviteUsers = async () => {
    if (selectedUsers.size === 0) {
      toast.error('Selecciona al menos un usuario')
      return
    }

    setIsInviting(true)
    let successCount = 0
    let errorCount = 0

    for (const userId of selectedUsers) {
      const selectedUser = users.find(u => u.id === userId)
      if (!selectedUser) continue

      try {
        await managementService.sendProjectInvitation({
          project_id: selectedProject.id,
          invitee_email: selectedUser.email,
          role: invitationRole,
        })
        successCount++
      } catch (error: any) {
        errorCount++
        console.error(`Error inviting ${selectedUser.email}:`, error)
      }
    }

    setIsInviting(false)
    setSelectedUsers(new Set())

    if (successCount > 0) {
      toast.success(`${successCount} invitación(es) enviada(s) exitosamente`)
      await fetchProjectInvitations(selectedProject.id)
      setMembersTab('pending')
    }

    if (errorCount > 0) {
      toast.error(`${errorCount} invitación(es) fallaron`)
    }
  }

  const handleCancelProjectInvitation = async (invitationId: string) => {
    try {
      await managementService.cancelProjectInvitation(invitationId)
      toast.success('Invitación cancelada')
      await fetchProjectInvitations(selectedProject.id)
    } catch (error) {
      toast.error('Error al cancelar invitación')
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
                      Gestiona los proyectos de tu empresa ({projects.length} proyectos)
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Proyecto
                  </Button>
                </div>

                {projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                      <Card key={project.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{project.name}</h3>
                            {project.description && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{project.description}</p>
                            )}
                          </div>

                          <div className="space-y-2">
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
                          </div>

                          <Button
                            onClick={() => handleOpenMembersDialog(project)}
                            variant="outline"
                            size="sm"
                            className="w-full mt-2"
                          >
                            <Users className="w-4 h-4 mr-2" />
                            Gestionar Miembros
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FolderKanban className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No hay proyectos creados</p>
                    <p className="text-sm mt-2">Crea tu primer proyecto para comenzar</p>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>

          {/* Project Creation Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
                <DialogDescription>
                  Completa la información del proyecto
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Mi Proyecto"
                      disabled={isCreating}
                    />
                  </div>
                  <div>
                    <Label htmlFor="team">Equipo *</Label>
                    <select
                      id="team"
                      value={formData.team_id}
                      onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
                      disabled={isCreating}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Seleccionar equipo...</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>{team.name}</option>
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
                    placeholder="Descripción del proyecto..."
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
                  disabled={isCreating || !formData.name || !formData.team_id}
                  className="bg-purple-600 hover:bg-purple-700"
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

          {/* Member Management Dialog */}
          <Dialog open={isMembersDialogOpen} onOpenChange={setIsMembersDialogOpen}>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Gestionar Miembros - {selectedProject?.name}</DialogTitle>
                <DialogDescription>
                  Administra los miembros e invitaciones del proyecto
                </DialogDescription>
              </DialogHeader>

              <Tabs value={membersTab} onValueChange={setMembersTab} className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="members">Miembros Actuales</TabsTrigger>
                  <TabsTrigger value="invite">Invitar Usuarios</TabsTrigger>
                  <TabsTrigger value="pending">Invitaciones Pendientes</TabsTrigger>
                </TabsList>

                {/* Tab 1: Current Members */}
                <TabsContent value="members" className="space-y-4">
                  {projectMembers.length > 0 ? (
                    <div className="space-y-2">
                      {projectMembers.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                              {member.user_email?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-medium">{member.user_email}</p>
                              <Badge variant="outline" className="text-xs">{member.role}</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No hay miembros en este proyecto</p>
                    </div>
                  )}
                </TabsContent>

                {/* Tab 2: Invite Users */}
                <TabsContent value="invite" className="space-y-4">
                  <div className="mb-4">
                    <Label>Rol para los usuarios invitados</Label>
                    <select
                      value={invitationRole}
                      onChange={(e) => setInvitationRole(e.target.value as 'developer' | 'supervisor')}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                    >
                      <option value="developer">Developer</option>
                      <option value="supervisor">Supervisor</option>
                    </select>
                  </div>

                  {users.filter(u => !projectMembers.some(m => m.user_id === u.id)).length > 0 ? (
                    <div className="space-y-2">
                      {users
                        .filter(u => !projectMembers.some(m => m.user_id === u.id))
                        .map((user) => (
                          <div key={user.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                            <Checkbox
                              checked={selectedUsers.has(user.id)}
                              onCheckedChange={() => handleToggleUserSelection(user.id)}
                            />
                            <div className="flex-1">
                              <p className="font-medium">{user.first_name} {user.last_name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                            <Badge variant="outline">{user.role}</Badge>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Todos los usuarios ya son miembros del proyecto</p>
                    </div>
                  )}

                  {selectedUsers.size > 0 && (
                    <Button
                      onClick={handleInviteUsers}
                      disabled={isInviting}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      {isInviting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Enviar {selectedUsers.size} Invitación(es)
                        </>
                      )}
                    </Button>
                  )}
                </TabsContent>

                {/* Tab 3: Pending Invitations */}
                <TabsContent value="pending" className="space-y-4">
                  {projectInvitations.length > 0 ? (
                    <div className="space-y-2">
                      {projectInvitations.map((invitation) => (
                        <div key={invitation.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{invitation.invitee_email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">{invitation.role}</Badge>
                              <span className="text-xs text-gray-500">
                                Expira: {new Date(invitation.expires_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelProjectInvitation(invitation.id)}
                          >
                            <X className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No hay invitaciones pendientes</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </>
  )
}
