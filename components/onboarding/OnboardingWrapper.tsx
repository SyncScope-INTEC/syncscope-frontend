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

  // Show custom header with logout for onboarding
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 right-0 p-4 z-50">
        <button
          onClick={() => {
            // Clear local storage and state logic would go here
            // For now specific implementation depends on auth slice but usually:
            localStorage.removeItem('persist:root')
            window.location.href = '/auth/admin-login'
          }}
          className="text-gray-500 hover:text-red-600 font-medium text-sm flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-lg border border-gray-200 shadow-sm transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
          </svg>
          Cerrar Sesión
        </button>
      </header>

      {onboardingState === ONBOARDING_STATES.NEW_ADMIN ? (
        <AdminOnboarding />
      ) : onboardingState === ONBOARDING_STATES.NEW_SUPERVISOR ? (
        <SupervisorOnboarding />
      ) : (
        children
      )}
    </div>
  )
}
