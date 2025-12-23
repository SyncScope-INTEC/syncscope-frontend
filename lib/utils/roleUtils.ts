import { USER_ROLES, UserRole } from '@/lib/types/roles'

/**
 * Check if user is an admin
 */
export const isAdmin = (role?: string): boolean => {
  return role === USER_ROLES.ADMIN
}

/**
 * Check if user is a supervisor
 */
export const isSupervisor = (role?: string): boolean => {
  return role === USER_ROLES.SUPERVISOR
}

/**
 * Check if user is a developer
 */
export const isDeveloper = (role?: string): boolean => {
  return role === USER_ROLES.DEVELOPER
}

/**
 * Check if user can access admin routes
 * Admin and Supervisor roles have access
 */
export const canAccessAdminRoutes = (role?: string): boolean => {
  return isAdmin(role) || isSupervisor(role)
}

/**
 * Get display name for role
 */
export const getRoleDisplayName = (role?: string): string => {
  switch (role) {
    case USER_ROLES.ADMIN:
      return 'Administrador'
    case USER_ROLES.SUPERVISOR:
      return 'Supervisor'
    case USER_ROLES.DEVELOPER:
      return 'Desarrollador'
    default:
      return 'Usuario'
  }
}

/**
 * Get role badge color
 */
export const getRoleBadgeColor = (role?: string): string => {
  switch (role) {
    case USER_ROLES.ADMIN:
      return 'bg-purple-100 text-purple-800 border-purple-200'
    case USER_ROLES.SUPERVISOR:
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case USER_ROLES.DEVELOPER:
      return 'bg-green-100 text-green-800 border-green-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}
