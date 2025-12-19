import Stripe from 'stripe'

// Allow build to succeed without STRIPE_SECRET_KEY
// It will be required at runtime when actually used
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || ''

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
})

export const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
  }
  return stripe
}

export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
}
