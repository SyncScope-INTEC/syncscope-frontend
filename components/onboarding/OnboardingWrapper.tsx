'use client'

import { useOnboardingState } from '@/lib/hooks/useOnboardingState'
import { ONBOARDING_STATES } from '@/lib/types/roles'
import { AdminOnboarding } from '@/components/onboarding/AdminOnboarding'
import { SupervisorOnboarding } from '@/components/onboarding/SupervisorOnboarding'

interface OnboardingWrapperProps {
  children: React.ReactNode
}

export function OnboardingWrapper({ children }: OnboardingWrapperProps) {
  const { onboardingState, loading } = useOnboardingState()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // Show onboarding for new users
  if (onboardingState === ONBOARDING_STATES.NEW_ADMIN) {
    return <AdminOnboarding />
  }

  if (onboardingState === ONBOARDING_STATES.NEW_SUPERVISOR) {
    return <SupervisorOnboarding />
  }

  // Show normal content for established users
  return <>{children}</>
}
