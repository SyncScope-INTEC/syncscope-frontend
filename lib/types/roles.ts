export const USER_ROLES = {
  ADMIN: 'admin',
  SUPERVISOR: 'supervisor',
  DEVELOPER: 'developer',
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

export const ONBOARDING_STATES = {
  NEW_ADMIN: 'new_admin',
  NEW_SUPERVISOR: 'new_supervisor',
  ESTABLISHED_ADMIN: 'established_admin',
  ESTABLISHED_SUPERVISOR: 'established_supervisor',
  DEVELOPER: 'developer',
} as const

export type OnboardingState = typeof ONBOARDING_STATES[keyof typeof ONBOARDING_STATES]

export interface OnboardingData {
  state: OnboardingState
  hasProjects: boolean
  hasSupervisedUsers?: boolean
  projectCount?: number
}
