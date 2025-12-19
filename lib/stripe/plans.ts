export type PlanType = 'starter' | 'growth' | 'enterprise'

export interface StripePlan {
  priceId: string
  name: string
  amount: number
  currency: string
  interval: 'month' | 'year'
}

// TODO: Replace these with your actual Stripe Price IDs from dashboard.stripe.com
// These are placeholder IDs - you need to create products and prices in Stripe Dashboard
export const STRIPE_PLANS: Record<PlanType, StripePlan> = {
  starter: {
    priceId: process.env.STRIPE_PRICE_STARTER || 'price_starter_placeholder',
    name: 'Starter',
    amount: 19,
    currency: 'usd',
    interval: 'month',
  },
  growth: {
    priceId: process.env.STRIPE_PRICE_GROWTH || 'price_growth_placeholder',
    name: 'Growth',
    amount: 149,
    currency: 'usd',
    interval: 'month',
  },
  enterprise: {
    priceId: process.env.STRIPE_PRICE_ENTERPRISE || 'price_enterprise_placeholder',
    name: 'Enterprise',
    amount: 69,
    currency: 'usd',
    interval: 'month',
  },
}

export function getPlanFromPriceId(priceId: string): PlanType | null {
  for (const [plan, config] of Object.entries(STRIPE_PLANS)) {
    if (config.priceId === priceId) {
      return plan as PlanType
    }
  }
  return null
}
