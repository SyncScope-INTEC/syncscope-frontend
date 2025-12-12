import axios from 'axios'

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL

const api = axios.create({
  baseURL: `${GATEWAY_URL}/management`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const state = localStorage.getItem('persist:root')
      if (state) {
        try {
          const parsedState = JSON.parse(state)
          const authState = JSON.parse(parsedState.auth)
          const token = authState.accessToken
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        } catch (error) {
          console.error('Error parsing token:', error)
        }
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const managementService = {
  // Projects CRUD
  getAllProjects: async (params?: { page?: number }) => {
    const response = await api.get('/projects/', { params })
    return response.data
  },

  getProject: async (id: string) => {
    const response = await api.get(`/projects/${id}/`)
    return response.data
  },

  createProject: async (data: {
    name: string
    description?: string
    team: string // UUID del team
    repository_url?: string
    url?: string
  }) => {
    const response = await api.post('/projects/', data)
    return response.data
  },

  updateProject: async (id: string, data: any) => {
    const response = await api.put(`/projects/${id}/`, data)
    return response.data
  },

  partialUpdateProject: async (id: string, data: any) => {
    const response = await api.patch(`/projects/${id}/`, data)
    return response.data
  },

  deleteProject: async (id: string) => {
    const response = await api.delete(`/projects/${id}/`)
    return response.data
  },

  // Project Members
  getAllProjectMembers: async (params?: { page?: number }) => {
    const response = await api.get('/project-members/', { params })
    return response.data
  },

  getProjectMember: async (id: string) => {
    const response = await api.get(`/project-members/${id}/`)
    return response.data
  },

  addProjectMember: async (data: {
    project: string // UUID
    user_id: string // UUID
    role: 'owner' | 'contributor' | 'viewer'
  }) => {
    const response = await api.post('/project-members/', data)
    return response.data
  },

  updateProjectMember: async (id: string, data: any) => {
    const response = await api.put(`/project-members/${id}/`, data)
    return response.data
  },

  removeProjectMember: async (id: string) => {
    const response = await api.delete(`/project-members/${id}/`)
    return response.data
  },

  // Teams CRUD
  getAllTeams: async (params?: { page?: number }) => {
    const response = await api.get('/teams/', { params })
    return response.data
  },

  getTeam: async (id: string) => {
    const response = await api.get(`/teams/${id}/`)
    return response.data
  },

  createTeam: async (data: { name: string; description?: string }) => {
    const response = await api.post('/teams/', data)
    return response.data
  },

  updateTeam: async (id: string, data: any) => {
    const response = await api.put(`/teams/${id}/`, data)
    return response.data
  },

  deleteTeam: async (id: string) => {
    const response = await api.delete(`/teams/${id}/`)
    return response.data
  },

  // Team Members
  getTeamMembers: async (teamId: string) => {
    const response = await api.get(`/teams/${teamId}/members/`)
    return response.data
  },

  addTeamMember: async (teamId: string, data: any) => {
    const response = await api.post(`/teams/${teamId}/members/`, data)
    return response.data
  },

  // Team Projects
  getTeamProjects: async (teamId: string) => {
    const response = await api.get(`/teams/${teamId}/projects/`)
    return response.data
  },

  // User Projects
  getUserProjects: async (userId: string) => {
    const response = await api.get(`/users/${userId}/projects/`)
    return response.data
  },

  // Team Members (separate endpoint)
  getAllTeamMembers: async (params?: { page?: number }) => {
    const response = await api.get('/team-members/', { params })
    return response.data
  },

  getTeamMemberDetails: async (id: string) => {
    const response = await api.get(`/team-members/${id}/`)
    return response.data
  },

  createTeamMember: async (data: {
    team: string // UUID
    user_id: string // UUID
    role: 'lead' | 'developer' | 'senior_developer' | 'junior_developer' | 'intern' | 'designer' | 'qa'
  }) => {
    const response = await api.post('/team-members/', data)
    return response.data
  },

  updateTeamMember: async (id: string, data: any) => {
    const response = await api.put(`/team-members/${id}/`, data)
    return response.data
  },

  removeTeamMember: async (id: string) => {
    const response = await api.delete(`/team-members/${id}/`)
    return response.data
  },

  // Organization Settings
  getOrganizationSettings: async () => {
    const response = await api.get('/organization/settings/')
    return response.data
  },

  updateOrganizationSettings: async (id: string, data: {
    deletion_protection_enabled?: boolean
    new_deletion_password?: string
  }) => {
    const response = await api.put(`/organization/settings/${id}/`, data)
    return response.data
  },

  verifyDeletionPassword: async (data: { password: string }) => {
    const response = await api.post('/organization/settings/verify_deletion_password/', data)
    return response.data
  },

  resetFailedAttempts: async (id: string) => {
    const response = await api.post(`/organization/settings/${id}/reset_failed_attempts/`)
    return response.data
  },

  // Integrations
  getAllIntegrations: async (params?: { page?: number }) => {
    const response = await api.get('/integrations/', { params })
    return response.data
  },

  getIntegration: async (id: string) => {
    const response = await api.get(`/integrations/${id}/`)
    return response.data
  },

  createIntegration: async (data: {
    project: string // UUID
    type: 'github' | 'gitlab' | 'jira' | 'slack' | 'discord' | 'teams' | 'trello' | 'asana' | 'jenkins' | 'circleci' | 'custom'
    config_data: any
    is_active?: boolean
  }) => {
    const response = await api.post('/integrations/', data)
    return response.data
  },

  updateIntegration: async (id: string, data: any) => {
    const response = await api.put(`/integrations/${id}/`, data)
    return response.data
  },

  deleteIntegration: async (id: string) => {
    const response = await api.delete(`/integrations/${id}/`)
    return response.data
  },

  // GitHub Integration
  getAllGitHubIntegrations: async (params?: { page?: number }) => {
    const response = await api.get('/github-integrations/', { params })
    return response.data
  },

  getGitHubIntegration: async (id: string) => {
    const response = await api.get(`/github-integrations/${id}/`)
    return response.data
  },

  createGitHubIntegration: async (data: {
    project: string // UUID
    repository_owner: string
    repository_name: string
    is_active?: boolean
  }) => {
    const response = await api.post('/github-integrations/', data)
    return response.data
  },

  updateGitHubIntegration: async (id: string, data: any) => {
    const response = await api.put(`/github-integrations/${id}/`, data)
    return response.data
  },

  deleteGitHubIntegration: async (id: string) => {
    const response = await api.delete(`/github-integrations/${id}/`)
    return response.data
  },

  syncGitHubCommits: async (id: string) => {
    const response = await api.post(`/github-integrations/${id}/sync_commits/`)
    return response.data
  },

  // Commits
  getAllCommits: async (params?: { page?: number }) => {
    const response = await api.get('/commits/', { params })
    return response.data
  },

  getCommit: async (id: string) => {
    const response = await api.get(`/commits/${id}/`)
    return response.data
  },
}
