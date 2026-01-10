import { managementApi as api } from './api'

export const managementService = {
  // Projects CRUD
  getAllProjects: async (params?: { 
    page?: number
    company?: string  // Filter by company ID (UUID)
    user?: string     // Filter by user ID (UUID) - shows projects where user is a member
  }) => {
    const response = await api.get('/management/projects/', { params })
    return response.data
  },

  getProject: async (id: string) => {
    const response = await api.get(`/management/projects/${id}/`)
    return response.data
  },

  createProject: async (data: {
    name: string
    description?: string
    team: string // UUID del team
    repository_url?: string
    url?: string
  }) => {
    const response = await api.post('/management/projects/', data)
    return response.data
  },

  updateProject: async (id: string, data: any) => {
    const response = await api.put(`/management/projects/${id}/`, data)
    return response.data
  },

  partialUpdateProject: async (id: string, data: any) => {
    const response = await api.patch(`/management/projects/${id}/`, data)
    return response.data
  },

  deleteProject: async (id: string) => {
    const response = await api.delete(`/management/projects/${id}/`)
    return response.data
  },

  // Project Members
  getAllProjectMembers: async (params?: { page?: number }) => {
    const response = await api.get('/management/project-members/', { params })
    return response.data
  },

  getProjectMember: async (id: string) => {
    const response = await api.get(`/management/project-members/${id}/`)
    return response.data
  },

  addProjectMember: async (data: {
    project: string // UUID
    user_id: string // UUID
    role: 'owner' | 'contributor' | 'viewer'
  }) => {
    const response = await api.post('/management/project-members/', data)
    return response.data
  },

  updateProjectMember: async (id: string, data: any) => {
    const response = await api.put(`/management/project-members/${id}/`, data)
    return response.data
  },

  removeProjectMember: async (id: string) => {
    const response = await api.delete(`/management/project-members/${id}/`)
    return response.data
  },

  // Teams CRUD
  getAllTeams: async (params?: { page?: number }) => {
    const response = await api.get('/management/teams/', { params })
    return response.data
  },

  getTeam: async (id: string) => {
    const response = await api.get(`/management/teams/${id}/`)
    return response.data
  },

  createTeam: async (data: { name: string; description?: string }) => {
    const response = await api.post('/management/teams/', data)
    return response.data
  },

  updateTeam: async (id: string, data: any) => {
    const response = await api.put(`/management/teams/${id}/`, data)
    return response.data
  },

  deleteTeam: async (id: string) => {
    const response = await api.delete(`/management/teams/${id}/`)
    return response.data
  },

  // Team Members
  getTeamMembers: async (teamId: string) => {
    const response = await api.get(`/management/teams/${teamId}/members/`)
    return response.data
  },

  addTeamMember: async (teamId: string, data: any) => {
    const response = await api.post(`/management/teams/${teamId}/members/`, data)
    return response.data
  },

  // Team Projects
  getTeamProjects: async (teamId: string) => {
    const response = await api.get(`/management/teams/${teamId}/projects/`)
    return response.data
  },

  // User Projects (using query params)
  getUserProjects: async (userId: string, params?: { page?: number }) => {
    const response = await api.get('/management/projects/', { 
      params: { user: userId, ...params } 
    })
    return response.data
  },

  // Projects by Company and User
  getProjectsByCompanyAndUser: async (companyId: string, userId: string, params?: { page?: number }) => {
    const response = await api.get('/management/projects/', { 
      params: { company: companyId, user: userId, ...params } 
    })
    return response.data
  },

  // Team Members (separate endpoint)
  getAllTeamMembers: async (params?: { 
    page?: number
    project?: string  // Filter team members by project ID (UUID)
  }) => {
    const response = await api.get('/management/team-members/', { params })
    return response.data
  },

  getTeamMemberDetails: async (id: string) => {
    const response = await api.get(`/management/team-members/${id}/`)
    return response.data
  },

  createTeamMember: async (data: {
    team: string // UUID
    user_id: string // UUID
    role: 'lead' | 'developer' | 'senior_developer' | 'junior_developer' | 'intern' | 'designer' | 'qa'
  }) => {
    const response = await api.post('/management/team-members/', data)
    return response.data
  },

  updateTeamMember: async (id: string, data: any) => {
    const response = await api.put(`/management/team-members/${id}/`, data)
    return response.data
  },

  removeTeamMember: async (id: string) => {
    const response = await api.delete(`/management/team-members/${id}/`)
    return response.data
  },

  // Organization Settings
  getOrganizationSettings: async () => {
    const response = await api.get('/management/organization/settings/')
    return response.data
  },

  updateOrganizationSettings: async (id: string, data: {
    deletion_protection_enabled?: boolean
    new_deletion_password?: string
  }) => {
    const response = await api.put(`/management/organization/settings/${id}/`, data)
    return response.data
  },

  verifyDeletionPassword: async (data: { password: string }) => {
    const response = await api.post('/management/organization/settings/verify_deletion_password/', data)
    return response.data
  },

  resetFailedAttempts: async (id: string) => {
    const response = await api.post(`/management/organization/settings/${id}/reset_failed_attempts/`)
    return response.data
  },

  // Integrations
  getAllIntegrations: async (params?: { page?: number }) => {
    const response = await api.get('/management/integrations/', { params })
    return response.data
  },

  getIntegration: async (id: string) => {
    const response = await api.get(`/management/integrations/${id}/`)
    return response.data
  },

  createIntegration: async (data: {
    project: string // UUID
    type: 'github' | 'gitlab' | 'jira' | 'slack' | 'discord' | 'teams' | 'trello' | 'asana' | 'jenkins' | 'circleci' | 'custom'
    config_data: any
    is_active?: boolean
  }) => {
    const response = await api.post('/management/integrations/', data)
    return response.data
  },

  updateIntegration: async (id: string, data: any) => {
    const response = await api.put(`/management/integrations/${id}/`, data)
    return response.data
  },

  deleteIntegration: async (id: string) => {
    const response = await api.delete(`/management/integrations/${id}/`)
    return response.data
  },

  // GitHub Integration
  getAllGitHubIntegrations: async (params?: { page?: number }) => {
    const response = await api.get('/management/github-integrations/', { params })
    return response.data
  },

  getGitHubIntegration: async (id: string) => {
    const response = await api.get(`/management/github-integrations/${id}/`)
    return response.data
  },

  createGitHubIntegration: async (data: {
    project: string // UUID
    repository_owner: string
    repository_name: string
    is_active?: boolean
  }) => {
    const response = await api.post('/management/github-integrations/', data)
    return response.data
  },

  updateGitHubIntegration: async (id: string, data: any) => {
    const response = await api.put(`/management/github-integrations/${id}/`, data)
    return response.data
  },

  deleteGitHubIntegration: async (id: string) => {
    const response = await api.delete(`/management/github-integrations/${id}/`)
    return response.data
  },

  syncGitHubCommits: async (id: string) => {
    const response = await api.post(`/management/github-integrations/${id}/sync_commits/`)
    return response.data
  },

  // Commits
  getAllCommits: async (params?: { page?: number }) => {
    const response = await api.get('/management/commits/', { params })
    return response.data
  },

  getCommit: async (id: string) => {
    const response = await api.get(`/management/commits/${id}/`)
    return response.data
  },
}
