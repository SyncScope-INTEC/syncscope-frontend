import { ProtectedRoute } from "@/components/auth/protected-route"
import { OnboardingWrapper } from "@/components/onboarding/OnboardingWrapper"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requireAdminAccess={true}>
      <OnboardingWrapper>
        {children}
      </OnboardingWrapper>
    </ProtectedRoute>
  )
}