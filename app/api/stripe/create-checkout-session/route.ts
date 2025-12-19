import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/config'
import { STRIPE_PLANS, type PlanType } from '@/lib/stripe/plans'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { plan } = body as { plan: PlanType }

    if (!plan || !STRIPE_PLANS[plan]) {
      return NextResponse.json(
        { error: 'Plan inválido' },
        { status: 400 }
      )
    }

    const planConfig = STRIPE_PLANS[plan]
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

    // Crear sesión de Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: planConfig.priceId,
          quantity: 1,
        },
      ],

      // Recolectar teléfono
      phone_number_collection: {
        enabled: true,
      },

      // URLs de redirección
      success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payment/cancel`,

      // Metadata para el webhook
      metadata: {
        plan,
      },

      // Configuración adicional
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    console.error('Error details:', {
      type: error.type,
      message: error.message,
      code: error.code,
      param: error.param,
      raw: error.raw
    })
    return NextResponse.json(
      { error: error.message || 'Error al crear sesión de pago' },
      { status: 500 }
    )
  }
}
