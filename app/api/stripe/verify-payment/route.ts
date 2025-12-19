import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe/config'

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe() // Validates STRIPE_SECRET_KEY at runtime
    const body = await req.json()
    const { sessionId } = body as { sessionId: string }

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID es requerido' },
        { status: 400 }
      )
    }

    // Verificar la sesión con Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'subscription'],
    })

    // Verificar que el pago fue exitoso
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'El pago no ha sido completado' },
        { status: 400 }
      )
    }

    // Extraer datos del cliente (solo email y teléfono de Stripe)
    const customerData = {
      email: session.customer_details?.email || '',
      phone: session.customer_details?.phone || '',
    }

    // Obtener el plan
    const plan = session.metadata?.plan || 'starter'

    return NextResponse.json({
      customerData,
      plan,
      subscriptionId: typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id,
      customerId: typeof session.customer === 'string'
        ? session.customer
        : session.customer?.id,
    })
  } catch (error: any) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: error.message || 'Error al verificar el pago' },
      { status: 500 }
    )
  }
}
