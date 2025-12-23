import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { managementService } from '@/lib/services/managementService'
import { authService } from '@/lib/services/authService'
import { ONBOARDING_STATES, OnboardingState, OnboardingData } from '@/lib/types/roles'
import { isAdmin, isSupervisor, isDeveloper } from '@/lib/utils/roleUtils'

export const useOnboardingState = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const detectOnboardingState = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setError(null)

        // Developer - no onboarding needed
        if (isDeveloper(user.role)) {
          setOnboardingData({
            state: ONBOARDING_STATES.DEVELOPER,
            hasProjects: false,
          })
          setLoading(false)
          return
        }

        // Admin - check if company has projects
        if (isAdmin(user.role)) {
          try {
            const projects = await managementService.getAllProjects()
            const hasProjects = projects?.results?.length > 0
            const projectCount = projects?.results?.length || 0

            setOnboardingData({
              state: hasProjects
                ? ONBOARDING_STATES.ESTABLISHED_ADMIN
                : ONBOARDING_STATES.NEW_ADMIN,
              hasProjects,
              projectCount,
            })
          } catch (err) {
            console.error('Error fetching projects:', err)
            // If error fetching projects, assume new admin
            setOnboardingData({
              state: ONBOARDING_STATES.NEW_ADMIN,
              hasProjects: false,
              projectCount: 0,
            })
          }
          setLoading(false)
          return
        }

        // Supervisor - check if has assigned projects
        if (isSupervisor(user.role)) {
          try {
            const userProjects = await managementService.getUserProjects(user.id)
            const hasProjects = userProjects?.length > 0
            const projectCount = userProjects?.length || 0

            // Optionally check for supervised users
            let hasSupervisedUsers = false
            try {
              const supervisedUsers = await authService.getSupervisedUsers()
              hasSupervisedUsers = supervisedUsers?.results?.length > 0
            } catch (err) {
              console.error('Error fetching supervised users:', err)
            }

            setOnboardingData({
              state: hasProjects
                ? ONBOARDING_STATES.ESTABLISHED_SUPERVISOR
                : ONBOARDING_STATES.NEW_SUPERVISOR,
              hasProjects,
              projectCount,
              hasSupervisedUsers,
            })
          } catch (err) {
            console.error('Error fetching supervisor data:', err)
            // If error, assume new supervisor
            setOnboardingData({
              state: ONBOARDING_STATES.NEW_SUPERVISOR,
              hasProjects: false,
              projectCount: 0,
              hasSupervisedUsers: false,
            })
          }
          setLoading(false)
          return
        }

        // Unknown role
        setLoading(false)
      } catch (error) {
        console.error('Error detecting onboarding state:', error)
        setError('Error al detectar el estado de onboarding')
        setLoading(false)
      }
    }

    detectOnboardingState()
  }, [user])

  const refetch = async () => {
    setLoading(true)
    // Trigger re-detection by updating a dependency
    // This will be called after creating a project or assignment
  }

  return {
    onboardingData,
    onboardingState: onboardingData?.state || null,
    loading,
    error,
    user,
    refetch,
  }
}
