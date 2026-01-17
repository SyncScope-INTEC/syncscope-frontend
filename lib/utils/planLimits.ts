export type PlanType = 'starter' | 'growth' | 'enterprise'

export const PLAN_LIMITS: Record<PlanType, number> = {
  starter: 5,
  enterprise: 25,
  growth: Infinity,
}

export const getPlanLimit = (plan: string): number => {
  const normalizedPlan = plan?.toLowerCase() as PlanType
  return PLAN_LIMITS[normalizedPlan] || 5 // Default to starter limit if unknown
}
